<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool { return (bool) optional($this->user())->isAdmin(); }

    public function rules(): array
    {
        $id = $this->route('project')?->id;
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('projects', 'slug')->ignore($id)],
            'short_description' => ['nullable', 'string'],
            'full_description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'max:60'],
            'role' => ['nullable', 'string', 'max:120'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'github_url' => ['nullable', 'url'],
            'live_demo_url' => ['nullable', 'url'],
            'featured_image_url' => ['nullable', 'url'],
            'tech_stack' => ['nullable', 'array'],
            'tech_stack.*' => ['string', 'max:80'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
