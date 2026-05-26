<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            ['name' => 'TypeScript', 'category' => 'Languages'],
            ['name' => 'PHP', 'category' => 'Languages'],
            ['name' => 'Next.js', 'category' => 'Frameworks'],
            ['name' => 'Laravel', 'category' => 'Frameworks'],
            ['name' => 'TailwindCSS', 'category' => 'Frameworks'],
            ['name' => 'PostgreSQL', 'category' => 'Databases'],
            ['name' => 'Supabase', 'category' => 'Platforms'],
            ['name' => 'Vercel', 'category' => 'Platforms'],
        ];
        foreach ($skills as $i => $s) {
            Skill::updateOrCreate(['name' => $s['name']], $s + ['sort_order' => $i, 'is_active' => true]);
        }
    }
}
