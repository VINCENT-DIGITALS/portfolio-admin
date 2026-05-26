<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'company' => 'Acme Corp',
                'position' => 'Senior Full-stack Engineer',
                'description' => 'Lead engineer building internal CMS and customer-facing portals.',
                'start_date' => '2022-01-01',
                'end_date' => null,
                'is_current' => true,
            ],
            [
                'company' => 'Beta Labs',
                'position' => 'Frontend Developer',
                'description' => 'Built marketing sites and dashboards in React.',
                'start_date' => '2019-06-01',
                'end_date' => '2021-12-15',
                'is_current' => false,
            ],
        ];
        foreach ($items as $i => $row) {
            Experience::updateOrCreate(['company' => $row['company'], 'position' => $row['position']], $row + ['sort_order' => $i]);
        }
    }
}
