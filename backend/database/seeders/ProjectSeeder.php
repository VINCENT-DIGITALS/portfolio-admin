<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Portfolio Platform',
                'short_description' => 'A dynamic portfolio platform with admin CMS.',
                'full_description' => 'Full-stack portfolio built with Next.js + Laravel + Supabase.',
                'category' => 'Web App',
                'status' => 'completed',
                'role' => 'Full-stack',
                'tech_stack' => ['Next.js', 'TypeScript', 'TailwindCSS', 'Laravel', 'PostgreSQL', 'Supabase'],
                'is_featured' => true,
                'is_published' => true,
                'github_url' => 'https://github.com/example/portfolio',
                'live_demo_url' => 'https://example.dev',
            ],
            [
                'title' => 'E-commerce Dashboard',
                'short_description' => 'Admin dashboard for managing online store.',
                'full_description' => 'Realtime analytics, product CRUD, and order management.',
                'category' => 'Dashboard',
                'status' => 'completed',
                'role' => 'Frontend',
                'tech_stack' => ['Next.js', 'TailwindCSS', 'tRPC'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => 'Realtime Chat App',
                'short_description' => 'A realtime chat application.',
                'full_description' => 'WebSocket-powered chat with Laravel Reverb and Next.js.',
                'category' => 'Web App',
                'status' => 'in-progress',
                'role' => 'Full-stack',
                'tech_stack' => ['Laravel Reverb', 'Next.js', 'PostgreSQL'],
                'is_featured' => false,
                'is_published' => true,
            ],
        ];
        foreach ($projects as $i => $p) {
            Project::updateOrCreate(['title' => $p['title']], $p + ['sort_order' => $i]);
        }
    }
}
