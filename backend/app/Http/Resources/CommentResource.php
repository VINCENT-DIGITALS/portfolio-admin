<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when(optional($request->user())->isAdmin(), $this->email),
            'message' => $this->message,
            'rating' => $this->rating,
            'project_id' => $this->project_id,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
