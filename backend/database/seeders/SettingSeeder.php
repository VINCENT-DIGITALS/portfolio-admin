<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'site_title' => 'My Portfolio',
            'site_tagline' => 'Building things on the web',
            'theme' => 'system',
            'comments_open' => '1',

            // Maintenance
            'maintenance_mode' => '0',
            'maintenance_message' => 'The site is currently undergoing maintenance. Please check back soon.',

            // Public nav visibility (1 = visible)
            'nav_home_enabled' => '1',
            'nav_about_enabled' => '1',
            'nav_projects_enabled' => '1',
            'nav_blogs_enabled' => '1',
            'nav_comments_enabled' => '1',
            'nav_contact_enabled' => '1',
        ];
        foreach ($defaults as $k => $v) {
            Setting::firstOrCreate(['key' => $k], ['value' => $v]);
        }
    }
}
