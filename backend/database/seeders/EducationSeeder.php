<?php

namespace Database\Seeders;

use App\Models\Education;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EducationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('education')->delete();

        $items = [
            [
                'school' => 'Central Luzon State University',
                'degree' => 'College — Bachelor of Science in Information Technology',
                'description' => 'A state university in the Philippines, known for its excellence in agricultural sciences, research, and technology, contributing significantly to national development and innovation. Graduated Cum Laude with a GPA of 1.59. Coursework included software engineering, database management, process design, and project management.',
                'start_date' => '2021-08-01',
                'end_date' => '2025-07-31',
            ],
            [
                'school' => 'Wesleyan University-Philippines – Aurora Campus',
                'degree' => 'Senior High — Humanities and Social Sciences',
                'description' => 'A private educational institution known for its strong academic programs and community involvement, providing quality education to students in the Aurora region.',
                'start_date' => '2019-08-01',
                'end_date' => '2021-05-31',
            ],
            [
                'school' => 'Maria Aurora National High School',
                'degree' => 'Junior High',
                'description' => 'A public educational institution in Aurora, committed to providing quality secondary education and fostering student development through academic and extracurricular activities.',
                'start_date' => '2015-06-01',
                'end_date' => '2019-04-30',
            ],
            [
                'school' => 'Maria Aurora Central School',
                'degree' => 'Elementary',
                'description' => 'A public elementary school in Aurora, dedicated to nurturing young learners with a strong foundation in academics, values, and holistic development.',
                'start_date' => '2009-06-01',
                'end_date' => '2015-03-31',
            ],
        ];

        foreach ($items as $i => $row) {
            Education::create($row + ['sort_order' => $i]);
        }
    }
}
