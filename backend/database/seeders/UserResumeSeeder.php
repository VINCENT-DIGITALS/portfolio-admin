<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * One-off seeder that replaces sample portfolio data with the user's
 * actual resume content (John Vincent T. Macayanan).
 *
 *   php artisan db:seed --class=UserResumeSeeder --force
 *
 * Destructive: truncates skills/experiences/education/certificates and
 * deletes all projects (comments are kept; their project_id becomes null).
 */
class UserResumeSeeder extends Seeder
{
    public function run(): void
    {
        $this->updateProfile();
        $this->replaceSkills();
        $this->replaceExperiences();
        $this->replaceEducation();
        $this->replaceCertificates();
        $this->replaceProjects();
    }

    private function updateProfile(): void
    {
        Profile::query()->updateOrCreate(
            ['id' => 1],
            [
                'full_name' => 'John Vincent T. Macayanan',
                'title' => 'Senior App Developer',
                'bio' =>
                    "App Developer based in Quezon City, focused on building production-grade mobile applications and the backend services that power them. I work primarily with Flutter, PHP, and Laravel, and currently ship a multi-app suite for the B1T1 Takeaway Coffee ecosystem — covering franchisee, barista, customer, rider, and internal operations — at Myracle Innovation Inc., where I was promoted to Senior App Developer in January 2026.\n\n"
                    . "Cum Laude graduate in Information Technology from Central Luzon State University. I care about clean architecture, thoughtful UX, and shipping software that people actually use. Open to collaborating on impactful product work, especially anything that blends great mobile experiences with well-designed backend systems.",
                'location' => 'Kamuning, Quezon City, Philippines',
                'email' => 'mac.jvincent@gmail.com',
                'phone' => '+63 949 791 8144',
                'github_url' => 'https://github.com/VINCENT-DIGITALS',
            ]
        );
    }

    private function replaceSkills(): void
    {
        DB::table('skills')->delete();

        $skills = [
            // Languages
            ['name' => 'PHP',         'category' => 'Languages'],
            ['name' => 'Dart',        'category' => 'Languages'],
            ['name' => 'JavaScript',  'category' => 'Languages'],
            ['name' => 'HTML',        'category' => 'Languages'],
            ['name' => 'CSS',         'category' => 'Languages'],
            // Frameworks
            ['name' => 'Laravel',     'category' => 'Frameworks'],
            ['name' => 'Flutter',     'category' => 'Frameworks'],
            ['name' => 'ReactJS',     'category' => 'Frameworks'],
            ['name' => 'FlutterFlow', 'category' => 'Frameworks'],
            // Databases
            ['name' => 'MySQL',       'category' => 'Databases'],
            ['name' => 'Firebase',    'category' => 'Databases'],
            // APIs
            ['name' => 'RESTful API', 'category' => 'APIs'],
            // Tools
            ['name' => 'Git',             'category' => 'Tools'],
            ['name' => 'GitHub',          'category' => 'Tools'],
            ['name' => 'phpMyAdmin',      'category' => 'Tools'],
            ['name' => 'Figma',           'category' => 'Design'],
            ['name' => 'Canva',           'category' => 'Design'],
            ['name' => 'Trello',          'category' => 'Collaboration'],
            ['name' => 'Slack',           'category' => 'Collaboration'],
            ['name' => 'MS Suite',        'category' => 'Collaboration'],
            ['name' => 'Google Workspace','category' => 'Collaboration'],
            ['name' => 'WordPress',       'category' => 'CMS'],
        ];

        foreach ($skills as $i => $s) {
            Skill::create($s + ['sort_order' => $i, 'is_active' => true]);
        }
    }

    private function replaceExperiences(): void
    {
        DB::table('experiences')->delete();

        $items = [
            [
                'company' => 'Myracle Innovation Inc.',
                'position' => 'App Developer',
                'description' => 'Started as Junior App Developer; promoted to Senior App Developer on January 11, 2026. Responsible for developing and maintaining multiple mobile applications and their backend APIs (PHP, GCP) for various clients.',
                'start_date' => '2025-08-01',
                'end_date' => null,
                'is_current' => true,
            ],
            [
                'company' => 'Builders of Information Technology Society (BITS)',
                'position' => 'Resident Member',
                'description' => "Gained experience in producing graphics for events, promotions, and organizational activities.\nContributed to providing fundamentals programming tutorials to lower-year students as part of the organization's outreach and skill-building initiatives.",
                'start_date' => '2024-08-01',
                'end_date' => '2025-08-31',
                'is_current' => false,
            ],
            [
                'company' => 'PhilRice – Central Experiment Station',
                'position' => 'On-the-Job Training',
                'description' => 'Contributed to the development of a service request management system for ICT-related issues through web and mobile platforms, using Laravel, Flutter, MySQL, and phpMyAdmin.',
                'start_date' => '2025-02-01',
                'end_date' => '2025-05-31',
                'is_current' => false,
            ],
        ];

        foreach ($items as $i => $row) {
            Experience::create($row + ['sort_order' => $i]);
        }
    }

    private function replaceEducation(): void
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

    private function replaceCertificates(): void
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

    private function replaceProjects(): void
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
