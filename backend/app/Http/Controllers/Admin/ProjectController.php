<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        return ProjectResource::collection(
            Project::with('images')->orderBy('sort_order')->orderByDesc('created_at')->get()
        );
    }

    public function store(StoreProjectRequest $request)
    {
        $project = Project::create($request->validated());
        return new ProjectResource($project->load('images'));
    }

    public function show(string $project)
    {
        $project = Project::with('images')->findOrFail($project);

        return new ProjectResource($project->load('images'));
    }

    public function update(UpdateProjectRequest $request, string $project)
    {
        $project = Project::findOrFail($project);

        $project->update($request->validated());
        return new ProjectResource($project->load('images'));
    }

    public function destroy(string $project)
    {
        $project = Project::findOrFail($project);

        $project->delete();
        return response()->json(['message' => 'Project deleted.']);
    }
}
