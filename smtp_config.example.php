<?php
// ── Plantilla de configuración SMTP ─────────────────────────────────────────
// Este fichero NO se sube a public_html. En el servidor de Hostinger,
// colócalo en el directorio HOME (un nivel por encima de public_html),
// renómbralo a "smtp_config.php" y pon la contraseña real del buzón
// info@hyperfocus.es:
//
//   /home/<usuario>/smtp_config.php   <- aquí (fuera del docroot, no accesible por HTTP)
//   /home/<usuario>/public_html/...   <- aquí vive la web
//
// public/api/contact.php lo carga automáticamente con:
//   dirname(__DIR__, 2) . '/smtp_config.php'
// (es decir, dos niveles por encima de /public_html/api/)
//
// IMPORTANTE: la contraseña que estaba en .htaccess quedó expuesta en el
// historial de git. Rótala desde hPanel > Correo antes de poner esto en
// producción y usa aquí la nueva.

return 'TU_NUEVA_CONTRASEÑA_SMTP';
