<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('experiences')->delete();

        $items = [
            [
                'company' => 'Myracle Innovation Inc.',
                'position' => 'App Developer',
                'description' => 'Started as Junior App Developer; promoted to Senior App Developer on January 11, 2026. Responsible for developing and maintaining multiple mobile applications and their backend APIs (PHP, GCP) for various clients.',
                'start_date' => '2025-08-01',
                'end_date' => null,
                'is_current' => true,
            ],
            [
                'company' => 'Builders of Information Technology Society (BITS)',
                'position' => 'Resident Member',
                'description' => "Gained experience in producing graphics for events, promotions, and organizational activities.\nContributed to providing fundamentals programming tutorials to lower-year students as part of the organization's outreach and skill-building initiatives.",
                'start_date' => '2024-08-01',
                'end_date' => '2025-08-31',
                'is_current' => false,
            ],
            [
                'company' => 'PhilRice – Central Experiment Station',
                'position' => 'On-the-Job Training',
                'description' => 'Contributed to the development of a service request management system for ICT-related issues through web and mobile platforms, using Laravel, Flutter, MySQL, and phpMyAdmin.',
                'start_date' => '2025-02-01',
                'end_date' => '2025-05-31',
                'is_current' => false,
            ],
        ];

        foreach ($items as $i => $row) {
            Experience::create($row + ['sort_order' => $i]);
        }
    }
}
