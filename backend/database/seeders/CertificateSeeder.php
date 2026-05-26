<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        Certificate::updateOrCreate(
            ['title' => 'AWS Certified Cloud Practitioner'],
            [
                'issuer' => 'Amazon Web Services',
                'issue_date' => '2023-04-01',
                'certificate_url' => 'https://aws.amazon.com/certification/',
                'sort_order' => 0,
            ]
        );
    }
}
