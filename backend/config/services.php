<?php

return [
    'supabase' => [
        'url' => env('SUPABASE_URL'),
        'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY'),
        'anon_key' => env('SUPABASE_ANON_KEY'),
        'bucket' => env('SUPABASE_STORAGE_BUCKET', 'portfolio'),
    ],
];
