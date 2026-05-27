<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('skills')->delete();

        $skills = [
            // Languages
            ['name' => 'PHP',              'category' => 'Languages'],
            ['name' => 'Dart',             'category' => 'Languages'],
            ['name' => 'JavaScript',       'category' => 'Languages'],
            ['name' => 'HTML',             'category' => 'Languages'],
            ['name' => 'CSS',              'category' => 'Languages'],
            // Frameworks
            ['name' => 'Laravel',          'category' => 'Frameworks'],
            ['name' => 'Flutter',          'category' => 'Frameworks'],
            ['name' => 'ReactJS',          'category' => 'Frameworks'],
            ['name' => 'FlutterFlow',      'category' => 'Frameworks'],
            // Databases
            ['name' => 'MySQL',            'category' => 'Databases'],
            ['name' => 'Firebase',         'category' => 'Databases'],
            // APIs
            ['name' => 'RESTful API',      'category' => 'APIs'],
            // Tools
            ['name' => 'Git',              'category' => 'Tools'],
            ['name' => 'GitHub',           'category' => 'Tools'],
            ['name' => 'phpMyAdmin',       'category' => 'Tools'],
            // Design
            ['name' => 'Figma',            'category' => 'Design'],
            ['name' => 'Canva',            'category' => 'Design'],
            // Collaboration
            ['name' => 'Trello',           'category' => 'Collaboration'],
            ['name' => 'Slack',            'category' => 'Collaboration'],
            ['name' => 'MS Suite',         'category' => 'Collaboration'],
            ['name' => 'Google Workspace', 'category' => 'Collaboration'],
            // CMS
            ['name' => 'WordPress',        'category' => 'CMS'],
        ];

        foreach ($skills as $i => $s) {
            Skill::create($s + ['sort_order' => $i, 'is_active' => true]);
        }
    }
}
