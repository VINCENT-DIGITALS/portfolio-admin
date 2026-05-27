#!/usr/bin/env sh
set -e

php artisan config:clear
php artisan route:clear
php artisan config:cache
php artisan route:cache

php -S 0.0.0.0:${PORT:-10000} -t public
