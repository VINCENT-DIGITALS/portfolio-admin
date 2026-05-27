<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        Profile::query()->updateOrCreate(
            ['id' => 1],
            [
                'full_name' => 'John Vincent Macayanan',
                'title' => 'Full-stack Engineer',
                'bio' => 'I build modern web experiences with Next.js, Laravel and PostgreSQL.',
                'location' => 'Manila, Philippines',
                'email' => 'hello@example.com',
                'phone' => '+63 900 000 0000',
                'github_url' => 'https://github.com/example',
                'linkedin_url' => 'https://linkedin.com/in/example',
                'portfolio_url' => 'https://example.dev',
            ]
        );
    }
}
