<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class PublicSettingsController extends Controller
{
    /**
     * Public, safe-to-expose subset of the settings table.
     * Returns a normalized payload the frontend can consume directly.
     */
    public function index()
    {
        $all = Setting::all()->pluck('value', 'key');

        $bool = fn (string $key, bool $default = true): bool => $this->toBool($all[$key] ?? null, $default);

        return response()->json([
            'data' => [
                'site_title' => (string) ($all['site_title'] ?? 'My Portfolio'),
                'site_tagline' => (string) ($all['site_tagline'] ?? ''),
                'theme' => (string) ($all['theme'] ?? 'system'),
                'comments_open' => $bool('comments_open', true),
                'maintenance_mode' => $bool('maintenance_mode', false),
                'maintenance_message' => (string) ($all['maintenance_message'] ?? 'The site is currently undergoing maintenance. Please check back soon.'),
                'nav' => [
                    'home' => $bool('nav_home_enabled', true),
                    'about' => $bool('nav_about_enabled', true),
                    'projects' => $bool('nav_projects_enabled', true),
                    'blogs' => $bool('nav_blogs_enabled', true),
                    'comments' => $bool('nav_comments_enabled', true),
                    'contact' => $bool('nav_contact_enabled', true),
                ],
            ],
        ]);
    }

    private function toBool(mixed $value, bool $default): bool
    {
        if ($value === null) return $default;
        $v = is_string($value) ? strtolower(trim($value)) : $value;
        return in_array($v, ['1', 'true', 'on', 'yes', true, 1], true);
    }
}
