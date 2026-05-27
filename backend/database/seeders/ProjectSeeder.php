<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        // Cascade-deletes project_images; sets comments.project_id to null.
        DB::table('projects')->delete();

        $projects = [
            // ─── Myracle Innovation — B1T1 Takeaway Coffee suite ───
            [
                'title' => 'B1T1 Franchisee',
                'short_description' => 'Franchisee management application with operational monitoring, product ordering, and backend API integration.',
                'full_description' => 'Developed and maintained a franchisee management application with operational monitoring, product ordering, and backend API integration using Flutter, PHP, and GCP. Built for the B1T1 Takeaway Coffee client.',
                'category' => 'Mobile App',
                'status' => 'ongoing',
                'role' => 'App Developer',
                'start_date' => '2025-09-21',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP', 'RESTful API'],
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'title' => 'B1T1 Barista',
                'short_description' => 'Barista operations app with reporting, monitoring, inventory ordering, and real-time backend integration.',
                'full_description' => 'Built and maintained a barista operations app featuring reporting, monitoring, inventory ordering, and real-time backend integration. Part of the B1T1 Takeaway Coffee ecosystem.',
                'category' => 'Mobile App',
                'status' => 'ongoing',
                'role' => 'App Developer',
                'start_date' => '2025-10-07',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP'],
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'title' => 'B1T1 Takeaway Coffee — Customer App',
                'short_description' => 'Consumer application for product ordering, membership tracking, and customer engagement.',
                'full_description' => 'Contributed to the development and maintenance of a consumer application for product ordering, membership tracking, and customer engagement features.',
                'category' => 'Mobile App',
                'status' => 'ongoing',
                'role' => 'App Developer',
                'start_date' => '2025-11-10',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => 'B1T1 Rider',
                'short_description' => 'Delivery service app with order coordination and backend API integration.',
                'full_description' => 'Developed delivery service functionalities connected to the customer application, including order coordination and backend API integration.',
                'category' => 'Mobile App',
                'status' => 'ongoing',
                'role' => 'App Developer',
                'start_date' => '2025-11-10',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP'],
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'title' => 'B1T1 World',
                'short_description' => 'Internal employee communication and coordination platform with task tracking and franchise collaboration.',
                'full_description' => 'Built an internal employee communication and coordination platform with task tracking and franchise collaboration features.',
                'category' => 'Mobile App',
                'status' => 'ongoing',
                'role' => 'App Developer',
                'start_date' => '2026-03-12',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => 'B1T1 RTD',
                'short_description' => 'Platform for ready-to-drink product ordering and backend service integration.',
                'full_description' => 'Developed a platform for ready-to-drink product ordering and backend service integration.',
                'category' => 'Mobile App',
                'status' => 'not-launched',
                'role' => 'App Developer',
                'start_date' => '2026-03-18',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP'],
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'title' => 'JM Pocket',
                'short_description' => 'Executive communication and coordination application for managing employee and franchise operations.',
                'full_description' => 'Created an executive communication and coordination application for managing employee and franchise operations.',
                'category' => 'Mobile App',
                'status' => 'ongoing',
                'role' => 'App Developer',
                'start_date' => '2026-04-21',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP'],
                'is_featured' => false,
                'is_published' => true,
            ],

            // ─── Client: Wonder Society ───
            [
                'title' => 'Wonder Society',
                'short_description' => 'Membership platform with ordering, schedule booking, CCTV monitoring, and family progress tracking.',
                'full_description' => 'Developing a membership platform with ordering, schedule booking, CCTV monitoring, and family progress tracking features, including full backend API development from scratch.',
                'category' => 'Web & Mobile',
                'status' => 'in-progress',
                'role' => 'Full-stack',
                'start_date' => null,
                'tech_stack' => ['Flutter', 'PHP', 'Laravel', 'RESTful API'],
                'is_featured' => true,
                'is_published' => true,
            ],

            // ─── Myracle Innovation Inc. — Internal ───
            [
                'title' => 'Logbook',
                'short_description' => 'Digital construction and work-progress logging application.',
                'full_description' => 'Built a digital construction and work progress logging application to streamline traditional reporting and monitoring workflows.',
                'category' => 'Mobile App',
                'status' => 'ongoing',
                'role' => 'App Developer',
                'start_date' => '2026-05-19',
                'tech_stack' => ['Flutter', 'Dart', 'PHP', 'GCP'],
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'title' => 'Connect Plus',
                'short_description' => 'Partnership management application for communication and collaboration workflows.',
                'full_description' => 'Designed and initiated development for a partnership management application focused on communication and collaboration workflows. UI design completed Dec 3, 2025; development started but postponed.',
                'category' => 'Mobile App',
                'status' => 'paused',
                'role' => 'App Developer & UI Designer',
                'start_date' => '2025-12-03',
                'tech_stack' => ['Flutter', 'Figma'],
                'is_featured' => false,
                'is_published' => true,
            ],

            // ─── Academic Projects ───
            [
                'title' => 'FireFly — Movie Booking System',
                'short_description' => 'Full-stack movie booking platform with scheduling and ticket management.',
                'full_description' => 'Developed a full-stack movie booking platform using HTML, CSS, JavaScript, PHP, and MySQL with scheduling and ticket management functionalities.',
                'category' => 'Academic',
                'status' => 'completed',
                'role' => 'Full-stack',
                'tech_stack' => ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => 'GRILLEDEC — Restaurant Website',
                'short_description' => 'Responsive restaurant website showcasing menus, services, and business information.',
                'full_description' => 'Created a responsive restaurant website showcasing menus, services, and business information using HTML, CSS, and JavaScript.',
                'category' => 'Academic',
                'status' => 'completed',
                'role' => 'Frontend Developer',
                'tech_stack' => ['HTML', 'CSS', 'JavaScript'],
                'is_featured' => false,
                'is_published' => true,
            ],

            // ─── This portfolio site ───
            [
                'title' => 'Portfolio Platform',
                'short_description' => 'Full-stack portfolio site with public pages and an admin CMS.',
                'full_description' => 'A dynamic portfolio platform with public pages, blogs, comment moderation, contact form, media library, and an admin CMS. Frontend: Next.js + TypeScript + TailwindCSS. Backend: Laravel + Sanctum (SPA cookie auth). Database: Supabase Postgres. Storage: Supabase Storage.',
                'category' => 'Web App',
                'status' => 'completed',
                'role' => 'Full-stack',
                'tech_stack' => ['Next.js', 'TypeScript', 'TailwindCSS', 'Laravel', 'PostgreSQL', 'Supabase'],
                'is_featured' => true,
                'is_published' => true,
                'github_url' => 'https://github.com/VINCENT-DIGITALS/portfolio-admin',
            ],
        ];

        foreach ($projects as $i => $p) {
            Project::create($p + ['sort_order' => $i]);
        }
    }
}
