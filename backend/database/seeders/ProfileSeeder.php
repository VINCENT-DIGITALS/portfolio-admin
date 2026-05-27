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
}
