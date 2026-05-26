<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query()->where('is_published', true);

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }
        if ($category = $request->string('category')->toString()) {
            $query->where('category', $category);
        }

        return ProjectResource::collection(
            $query->orderBy('sort_order')->orderByDesc('created_at')->get()
        );
    }

    public function show(string $slug)
    {
        $project = Project::with('images')->where('slug', $slug)->where('is_published', true)->firstOrFail();
        return new ProjectResource($project);
    }
}
