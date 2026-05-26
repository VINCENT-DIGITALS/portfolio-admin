<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'issuer' => $this->issuer,
            'issue_date' => $this->issue_date?->toDateString(),
            'certificate_url' => $this->certificate_url,
            'image_url' => $this->image_url,
            'sort_order' => $this->sort_order,
        ];
    }
}
