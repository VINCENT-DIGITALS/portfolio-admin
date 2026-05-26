<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Profile::query()->firstOrCreate([], ['full_name' => 'Your Name']);
        return new ProfileResource($profile);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'full_name' => ['sometimes', 'required', 'string', 'max:160'],
            'title' => ['nullable', 'string', 'max:160'],
            'bio' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:160'],
            'email' => ['nullable', 'email', 'max:200'],
            'phone' => ['nullable', 'string', 'max:60'],
            'profile_image_url' => ['nullable', 'url'],
            'resume_url' => ['nullable', 'url'],
            'github_url' => ['nullable', 'url'],
            'linkedin_url' => ['nullable', 'url'],
            'facebook_url' => ['nullable', 'url'],
            'portfolio_url' => ['nullable', 'url'],
        ]);

        $profile = Profile::query()->firstOrCreate([], ['full_name' => $data['full_name'] ?? 'Your Name']);
        $profile->update($data);
        return new ProfileResource($profile);
    }
}
