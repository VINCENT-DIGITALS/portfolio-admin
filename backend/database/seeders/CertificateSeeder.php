<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('certificates')->delete();

        $items = [
            [
                'title' => 'Cum Laude, Class of 2025',
                'issuer' => 'Central Luzon State University',
                'description' => 'Graduated with honors, recognizing academic excellence and dedication throughout the Bachelor of Science in Information Technology program.',
                'issue_date' => '2025-07-31',
                'certificate_url' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Google Workspace Specialization',
                'issuer' => 'Google',
                'description' => 'Earned a specialization in Google Workspace tools, showcasing skills in collaboration and productivity through advanced use of Google applications.',
                'issue_date' => '2024-01-01',
                'certificate_url' => 'https://vincent-digitals.github.io/mainportfolio/static/media/GOOGLE_WORSPACE_SPECIALIZATION.e3cf81fe5d98252077d7.pdf',
                'image_url' => null,
            ],
            [
                'title' => 'Participant, 10th TOPCIT Philippines, 2024',
                'issuer' => 'TOPCIT Philippines',
                'description' => 'Participated in the 10th TOPCIT Philippines assessment program to demonstrate technical problem-solving skills.',
                'issue_date' => '2024-01-01',
                'certificate_url' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Regional Finalist, Philippine Startup Challenge 9, 2024',
                'issuer' => 'Philippine Startup Challenge',
                'description' => 'Achieved Top 15 regional finalist position for a startup idea and business plan in the Philippine Startup Challenge 9.',
                'issue_date' => '2024-01-01',
                'certificate_url' => null,
                'image_url' => null,
            ],
        ];

        foreach ($items as $i => $row) {
            Certificate::create($row + ['sort_order' => $i]);
        }
    }
}
