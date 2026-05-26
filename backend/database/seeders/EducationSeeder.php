<?php

namespace Database\Seeders;

use App\Models\Education;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    public function run(): void
    {
        Education::updateOrCreate(
            ['school' => 'State University'],
            [
                'degree' => 'BSc Computer Science',
                'description' => 'Focused on web technologies and distributed systems.',
                'start_date' => '2014-08-01',
                'end_date' => '2018-06-15',
                'sort_order' => 0,
            ]
        );
    }
}
