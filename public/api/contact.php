<?php
// ── Configuración SMTP ────────────────────────────────────────────────────────
// La contraseña NUNCA se guarda en el repositorio. Se lee de una variable de
// entorno o de un fichero PHP fuera del docroot (p. ej. junto a public_html
// en Hostinger), que devuelve el valor con `return`.
// El fichero puede devolver la contraseña como string (formato antiguo) o un
// array ['smtp_pass' => ..., 'turnstile_secret' => ...].
$externalConfig = dirname(__DIR__, 2) . '/smtp_config.php';
$config = is_file($externalConfig) ? require $externalConfig : [];
if (!is_array($config)) $config = ['smtp_pass' => (string) $config];

$smtpPass        = getenv('SMTP_PASS') ?: (string) ($config['smtp_pass'] ?? '');
$turnstileSecret = getenv('TURNSTILE_SECRET') ?: (string) ($config['turnstile_secret'] ?? '');

define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 587);                        // STARTTLS
define('SMTP_USER', 'info@hyperfocus.es');
define('SMTP_PASS', $smtpPass);
define('MAIL_FROM', 'info@hyperfocus.es');
define('MAIL_TO',   'info@hyperfocus.es');
// ─────────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=UTF-8');

$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://hyperfocus.es', 'https://www.hyperfocus.es'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (str_starts_with($_SERVER['HTTP_HOST'] ?? '', 'localhost')) {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['success' => false]); exit; }

// ── Rate limiting por IP ───────────────────────────────────────────────────
// Evita inundar el formulario/SMTP con envíos automatizados o en bucle.
// Mínimo 20s entre envíos y máximo 10 envíos por IP cada 24h.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile = sys_get_temp_dir() . '/hf_contact_' . hash('sha256', $ip) . '.json';
$now = time();
$rl = ['last' => 0, 'count' => 0, 'windowStart' => $now];
if (is_file($rlFile)) {
    $stored = json_decode((string) file_get_contents($rlFile), true);
    if (is_array($stored)) $rl = array_merge($rl, $stored);
}
if ($now - $rl['last'] < 20) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Demasiadas solicitudes. Espera unos segundos e inténtalo de nuevo.']);
    exit;
}
if ($now - $rl['windowStart'] > 86400) {
    $rl['windowStart'] = $now;
    $rl['count'] = 0;
}
if ($rl['count'] >= 10) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Has alcanzado el límite de envíos. Escríbenos directamente a info@hyperfocus.es']);
    exit;
}
$rl['last'] = $now;
$rl['count']++;
file_put_contents($rlFile, json_encode($rl), LOCK_EX);

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) { http_response_code(400); echo json_encode(['success' => false]); exit; }

// Honeypot
if (!empty($data['company_url'])) { echo json_encode(['success' => true]); exit; }

// ── Cloudflare Turnstile ─────────────────────────────────────────────────────
// Solo se exige si hay clave secreta configurada (así el formulario no se
// rompe mientras no estén dadas de alta las claves).
if ($turnstileSecret !== '') {
    $token = is_string($data['turnstileToken'] ?? null) ? $data['turnstileToken'] : '';
    $verified = false;
    if ($token !== '') {
        $ctx = stream_context_create(['http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query(['secret' => $turnstileSecret, 'response' => $token, 'remoteip' => $ip]),
            'timeout' => 10,
        ]]);
        $resp = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx);
        $json = $resp ? json_decode($resp, true) : null;
        $verified = is_array($json) && !empty($json['success']);
    }
    if (!$verified) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No hemos podido verificar que no eres un robot. Recarga la página e inténtalo de nuevo.']);
        exit;
    }
}

// Validación
foreach (['nombre','email','mensaje'] as $f) {
    if (empty($data[$f]) || !is_string($data[$f])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios.']);
        exit;
    }
}
$email = filter_var(str_replace(["\r", "\n"], '', trim($data['email'])), FILTER_VALIDATE_EMAIL);
if (!$email) { http_response_code(400); echo json_encode(['success' => false, 'error' => 'Email inválido.']); exit; }

function s(string $v): string {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

$nombre         = s($data['nombre']);
$telefono       = s(is_string($data['telefono'] ?? null) ? $data['telefono'] : '');
$mensaje        = s(function_exists('mb_substr') ? mb_substr($data['mensaje'], 0, 3000) : substr($data['mensaje'], 0, 3000));

// ── SMTP (PHPMailer) ─────────────────────────────────────────────────────────
// PHPMailer se encarga de STARTTLS, la autenticación, la codificación de
// cabeceras (sin inyección de saltos de línea) y de comprobar cada respuesta
// del servidor. Copia sin Composer en api/lib/PHPMailer (ver VERSION).

require_once __DIR__ . '/lib/PHPMailer/Exception.php';
require_once __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/lib/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailerException;

function smtp_send(string $to, string $toName, string $subject, string $plainBody, ?array $replyTo = null, string $htmlBody = ''): bool {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->Port       = SMTP_PORT;
        $mail->SMTPAuth   = true;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->Timeout    = 15;
        $mail->CharSet    = PHPMailer::CHARSET_UTF8;
        $mail->Encoding   = PHPMailer::ENCODING_BASE64;

        $mail->setFrom(MAIL_FROM, 'Hyperfocus');
        $mail->addAddress($to, $toName);
        if ($replyTo) {
            $mail->addReplyTo($replyTo['email'], $replyTo['name'] ?? '');
        }

        $mail->Subject = $subject;
        if ($htmlBody !== '') {
            $mail->isHTML(true);
            $mail->Body    = $htmlBody;
            $mail->AltBody = $plainBody;
        } else {
            $mail->Body = $plainBody;
        }

        return $mail->send();
    } catch (MailerException $e) {
        error_log('contact.php: ' . $mail->ErrorInfo);
        return false;
    }
}

// ── Correo interno (para vosotros) ───────────────────────────────────────────

$asunto = str_replace(["\r", "\n"], ' ', html_entity_decode("Nueva solicitud · $nombre", ENT_QUOTES, 'UTF-8'));

$cuerpoPlano  = "Nombre:   $nombre\n";
$cuerpoPlano .= "Email:    $email\n";
$cuerpoPlano .= "Teléfono: " . ($telefono ?: '—') . "\n";
$cuerpoPlano .= "\nMensaje:\n$mensaje\n";

$mensajeHtml     = nl2br($mensaje);
$telefonoDisplay = $telefono ?: '—';

$cuerpoHtml = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#040506;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#040506;">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

        <!-- Logo / marca -->
        <tr>
          <td style="padding-bottom:36px;">
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.25);">HYPERFOCUS</p>
          </td>
        </tr>

        <!-- Cabecera -->
        <tr>
          <td style="padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.07);">
            <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Nueva solicitud</p>
            <h1 style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:-0.02em;color:#ffffff;">$nombre</h1>
          </td>
        </tr>

        <!-- Campos -->
        <tr>
          <td style="padding-top:28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

              <!-- Email + Teléfono -->
              <tr>
                <td style="padding-bottom:20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="60%" style="padding-right:16px;">
                        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Email</p>
                        <a href="mailto:$email" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#ffffff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.2);">$email</a>
                      </td>
                      <td width="40%">
                        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Teléfono</p>
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.75);">$telefonoDisplay</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Mensaje -->
              <tr>
                <td style="padding-bottom:24px;">
                  <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Mensaje</p>
                  <div style="background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 18px;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.75);">$mensajeHtml</p>
                  </div>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding-top:4px;border-top:1px solid rgba(255,255,255,0.07);">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                    <tr>
                      <td style="background-color:#ffffff;border-radius:10px;">
                        <a href="mailto:$email" style="display:inline-block;padding:12px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#040506;text-decoration:none;">Responder a $nombre</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:40px;">
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.2);">Formulario de contacto · hyperfocus.es</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;

$enviado = smtp_send(MAIL_TO, 'Hyperfocus', $asunto, $cuerpoPlano, ['email' => $email, 'name' => trim(preg_replace('/\s+/', ' ', strip_tags($data['nombre'])))], $cuerpoHtml);

if (!$enviado) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'No se pudo enviar el mensaje. Escríbenos a info@hyperfocus.es']);
    exit;
}

// ── Confirmación al cliente ───────────────────────────────────────────────────

$asuntoUser = 'Hemos recibido tu mensaje — Hyperfocus';

// Texto fijo: el acuse no incluye nada escrito por el usuario, para que el
// formulario no sirva para enviar contenido arbitrario desde info@ a terceros.
$cuerpoUserPlano  = "Hola,\n\n";
$cuerpoUserPlano .= "Hemos recibido tu mensaje a través del formulario de hyperfocus.es y te responderemos en menos de 48 horas.\n\n";
$cuerpoUserPlano .= "Si no has enviado tú este formulario, puedes ignorar este correo.\n\n";
$cuerpoUserPlano .= "Si tienes cualquier duda, escríbenos a info@hyperfocus.es\n\n";
$cuerpoUserPlano .= "El equipo de Hyperfocus\nhttps://hyperfocus.es\n";

$cuerpoUserHtml = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#040506;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#040506;">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

        <!-- Logo / marca -->
        <tr>
          <td style="padding-bottom:36px;">
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.25);">HYPERFOCUS</p>
          </td>
        </tr>

        <!-- Cabecera -->
        <tr>
          <td style="padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.07);">
            <p style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Mensaje recibido</p>
            <h1 style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:-0.02em;color:#ffffff;">Hola.</h1>
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.45);">Hemos recibido tu solicitud y la revisaremos personalmente. Te respondemos en menos de 48 horas.</p>
          </td>
        </tr>

        <!-- Próximos pasos -->
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.07);padding-top:28px;padding-bottom:32px;">
            <p style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Próximos pasos</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:12px;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;">
                        <div style="display:inline-block;width:20px;height:20px;background-color:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50%;text-align:center;line-height:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;color:rgba(255,255,255,0.35);">1</div>
                      </td>
                      <td style="padding-left:10px;">
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.45);">Revisamos tu solicitud en detalle</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:12px;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;">
                        <div style="display:inline-block;width:20px;height:20px;background-color:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50%;text-align:center;line-height:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;color:rgba(255,255,255,0.35);">2</div>
                      </td>
                      <td style="padding-left:10px;">
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.45);">Te respondemos en menos de 48 horas</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;">
                        <div style="display:inline-block;width:20px;height:20px;background-color:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50%;text-align:center;line-height:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;color:rgba(255,255,255,0.35);">3</div>
                      </td>
                      <td style="padding-left:10px;">
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.45);">Primera llamada sin compromiso</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.07);padding-top:28px;">
            <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.3);">Si tienes cualquier duda, escríbenos a <a href="mailto:info@hyperfocus.es" style="color:rgba(255,255,255,0.5);text-decoration:none;">info@hyperfocus.es</a></p>
            <p style="margin:8px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.2);">El equipo de Hyperfocus · <a href="https://hyperfocus.es" style="color:rgba(255,255,255,0.2);text-decoration:none;">hyperfocus.es</a></p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;

smtp_send($email, '', $asuntoUser, $cuerpoUserPlano, null, $cuerpoUserHtml);

echo json_encode(['success' => true]);
