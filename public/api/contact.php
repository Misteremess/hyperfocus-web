<?php
// ── Configuración SMTP ────────────────────────────────────────────────────────
// La contraseña NUNCA se guarda en el repositorio. Se lee de una variable de
// entorno o de un fichero PHP fuera del docroot (p. ej. junto a public_html
// en Hostinger), que devuelve el valor con `return`.
$smtpPass = getenv('SMTP_PASS') ?: '';
if ($smtpPass === '') {
    $externalConfig = dirname(__DIR__, 2) . '/smtp_config.php';
    if (is_file($externalConfig)) {
        $smtpPass = (string) require $externalConfig;
    }
}

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

// Validación
foreach (['nombre','empresa','email','comoNosConocio','ayuda','compromiso','hito','inversion'] as $f) {
    if (empty($data[$f])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios.']);
        exit;
    }
}
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
if (!$email) { http_response_code(400); echo json_encode(['success' => false, 'error' => 'Email inválido.']); exit; }

function s(string $v): string {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}
$nombre         = s($data['nombre']);
$empresa        = s($data['empresa']);
$telefono       = s($data['telefono'] ?? '');
$comoNosConocio = s($data['comoNosConocio']);
$ayuda          = s($data['ayuda']);
$compromiso     = s($data['compromiso']);
$hito           = s($data['hito']);
$inversion      = s($data['inversion']);

// ── SMTP ─────────────────────────────────────────────────────────────────────

function smtp_readline($socket): string {
    $line = '';
    while (!feof($socket)) {
        $ch = fgetc($socket);
        $line .= $ch;
        if ($ch === "\n") break;
    }
    return $line;
}

function smtp_read_response($socket): string {
    $last = '';
    do {
        $last = smtp_readline($socket);
    } while (strlen($last) >= 4 && $last[3] === '-');
    return $last;
}

function smtp_send(string $to, string $toName, string $subject, string $plainBody, array $extraHeaders = [], string $htmlBody = ''): bool {
    $socket = @stream_socket_client('tcp://' . SMTP_HOST . ':' . SMTP_PORT, $errno, $errstr, 15);
    if (!$socket) return false;

    stream_set_timeout($socket, 15);

    $w = function(string $cmd) use ($socket) { fwrite($socket, $cmd . "\r\n"); };
    $r = function() use ($socket) { return smtp_read_response($socket); };

    $r(); // 220 greeting
    $w('EHLO ' . gethostname());
    $r();
    $w('STARTTLS');
    $r(); // 220 Go ahead
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        fclose($socket);
        return false;
    }
    $w('EHLO ' . gethostname());
    $r();
    $w('AUTH LOGIN');
    $r(); // 334
    $w(base64_encode(SMTP_USER));
    $r(); // 334
    $w(base64_encode(SMTP_PASS));
    $authResp = $r(); // 235 o error
    if (strpos($authResp, '235') !== 0) { fclose($socket); return false; }

    $w('MAIL FROM:<' . MAIL_FROM . '>');
    $r();
    $w('RCPT TO:<' . $to . '>');
    $r();
    $w('DATA');
    $r(); // 354

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $msg  = 'From: Hyperfocus <' . MAIL_FROM . ">\r\n";
    $msg .= 'To: ' . $toName . ' <' . $to . ">\r\n";
    $msg .= 'Subject: ' . $encodedSubject . "\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    foreach ($extraHeaders as $k => $v) {
        $msg .= "$k: $v\r\n";
    }

    if ($htmlBody !== '') {
        $boundary = 'hf_' . bin2hex(random_bytes(8));
        $msg .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
        $msg .= "\r\n";
        $msg .= "--$boundary\r\n";
        $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $msg .= "Content-Transfer-Encoding: base64\r\n";
        $msg .= "\r\n";
        $msg .= chunk_split(base64_encode($plainBody));
        $msg .= "--$boundary\r\n";
        $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
        $msg .= "Content-Transfer-Encoding: base64\r\n";
        $msg .= "\r\n";
        $msg .= chunk_split(base64_encode($htmlBody));
        $msg .= "--$boundary--\r\n";
    } else {
        $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $msg .= "Content-Transfer-Encoding: base64\r\n";
        $msg .= "\r\n" . chunk_split(base64_encode($plainBody));
    }

    // Dot-stuffing
    $msg = preg_replace('/^\.$/m', '..', $msg);

    $w($msg);
    $w('.');
    $dataResp = $r();

    $w('QUIT');
    fclose($socket);

    return strpos($dataResp, '250') === 0;
}

// ── Correo interno (para vosotros) ───────────────────────────────────────────

$asunto = "Nueva solicitud · $nombre ($empresa)";

$cuerpoPlano  = "Nombre:   $nombre\n";
$cuerpoPlano .= "Empresa:  $empresa\n";
$cuerpoPlano .= "Email:    $email\n";
$cuerpoPlano .= "Teléfono: " . ($telefono ?: '—') . "\n";
$cuerpoPlano .= "Cómo nos conoció: $comoNosConocio\n\n";
$cuerpoPlano .= "Proyecto:\n$ayuda\n\n";
$cuerpoPlano .= "Tipo de compromiso: $compromiso\n";
$cuerpoPlano .= "Hito / fecha:       $hito\n";
$cuerpoPlano .= "Inversión prevista: $inversion\n";

$ayudaHtml       = nl2br($ayuda);
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
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.35);">$empresa</p>
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

              <!-- Cómo nos conoció -->
              <tr>
                <td style="padding-bottom:20px;">
                  <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Cómo nos conoció</p>
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.75);">$comoNosConocio</p>
                </td>
              </tr>

              <!-- Proyecto -->
              <tr>
                <td style="padding-bottom:24px;">
                  <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Proyecto</p>
                  <div style="background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 18px;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.75);">$ayudaHtml</p>
                  </div>
                </td>
              </tr>

              <!-- Fila: Compromiso + Inversión -->
              <tr>
                <td style="padding-bottom:20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding-right:10px;">
                        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Tipo de compromiso</p>
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.75);">$compromiso</p>
                      </td>
                      <td width="50%" style="padding-left:10px;">
                        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Inversión prevista</p>
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.75);">$inversion</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Hito -->
              <tr>
                <td style="padding-bottom:32px;">
                  <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Hito clave / fecha</p>
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.75);">$hito</p>
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

$enviado = smtp_send(MAIL_TO, 'Hyperfocus', $asunto, $cuerpoPlano, ['Reply-To' => "$nombre <$email>"], $cuerpoHtml);

if (!$enviado) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'No se pudo enviar el mensaje. Escríbenos a info@hyperfocus.es']);
    exit;
}

// ── Confirmación al cliente ───────────────────────────────────────────────────

$asuntoUser = 'Hemos recibido tu mensaje — Hyperfocus';

$cuerpoUserPlano  = "Hola $nombre,\n\n";
$cuerpoUserPlano .= "Hemos recibido tu mensaje y te responderemos en menos de 48 horas.\n\n";
$cuerpoUserPlano .= "Resumen de tu solicitud:\n";
$cuerpoUserPlano .= "──────────────────────────\n";
$cuerpoUserPlano .= "Empresa:    $empresa\n";
$cuerpoUserPlano .= "Proyecto:   $ayuda\n";
$cuerpoUserPlano .= "Inversión:  $inversion\n";
$cuerpoUserPlano .= "──────────────────────────\n\n";
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
            <h1 style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:600;letter-spacing:-0.02em;color:#ffffff;">Hola, $nombre.</h1>
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.45);">Hemos recibido tu solicitud y la revisaremos personalmente. Te respondemos en menos de 48 horas.</p>
          </td>
        </tr>

        <!-- Resumen -->
        <tr>
          <td style="padding-top:28px;padding-bottom:28px;">
            <p style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);">Tu solicitud</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;">
              <tr>
                <td style="padding:20px 22px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:14px;">
                        <p style="margin:0 0 2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.2);">Empresa</p>
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.7);">$empresa</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom:14px;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;">
                        <p style="margin:0 0 2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.2);">Proyecto</p>
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:rgba(255,255,255,0.7);">$ayuda</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;">
                        <p style="margin:0 0 2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.2);">Inversión prevista</p>
                        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.7);">$inversion</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
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

smtp_send($email, $nombre, $asuntoUser, $cuerpoUserPlano, [], $cuerpoUserHtml);

echo json_encode(['success' => true]);
