<?php
// Custom router for the PHP built-in server: serve static files when they exist,
// otherwise dispatch into Laravel's front controller (public/index.php).
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}
require __DIR__ . '/index.php';
