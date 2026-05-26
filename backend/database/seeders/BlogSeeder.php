<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Building a Portfolio with Next.js & Laravel',
                'excerpt' => 'A walkthrough of how this portfolio platform is built.',
                'content' => "## Introduction\n\nThis post walks through the architecture of the portfolio platform: Next.js on the frontend, Laravel API on the backend, Supabase for Postgres + storage.\n\n### Why this stack?\n\n- Type-safe end-to-end\n- Fast DX\n- Free hosting tiers\n",
                'tags' => ['nextjs', 'laravel', 'supabase'],
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'Sanctum SPA Cookie Auth, the Right Way',
                'excerpt' => 'Configure CORS + Sanctum so Next.js can call your Laravel API safely.',
                'content' => "Sanctum SPA cookie auth depends on three things being aligned: stateful domains, CORS with credentials, and the CSRF cookie.\n",
                'tags' => ['laravel', 'sanctum', 'auth'],
                'is_published' => true,
                'published_at' => now()->subDays(3),
            ],
        ];
        foreach ($posts as $p) {
            Blog::updateOrCreate(['title' => $p['title']], $p);
        }
    }
}
