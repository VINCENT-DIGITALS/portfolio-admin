<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'title' => $this->title,
            'bio' => $this->bio,
            'location' => $this->location,
            'email' => $this->email,
            'phone' => $this->phone,
            'profile_image_url' => $this->profile_image_url,
            'resume_url' => $this->resume_url,
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'facebook_url' => $this->facebook_url,
            'portfolio_url' => $this->portfolio_url,
            'updated_at' => $this->updated_at,
        ];
    }
}
