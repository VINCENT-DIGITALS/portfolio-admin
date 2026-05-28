<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

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
        $data = $request->validated();
        $images = $data['images'] ?? [];
        unset($data['images']);

        $project = DB::transaction(function () use ($data, $images) {
            $project = Project::create($data);
            $this->syncProjectImages($project, $images);

            return $project;
        });

        return new ProjectResource($project->load('images'));
    }

    public function show(Project $project)
    {
        return new ProjectResource($project->load('images'));
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();
        $images = $data['images'] ?? [];
        unset($data['images']);

        DB::transaction(function () use ($project, $data, $images) {
            $project->update($data);
            $this->syncProjectImages($project, $images);
        });

        return new ProjectResource($project->load('images'));
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Project deleted.']);
    }

    private function syncProjectImages(Project $project, array $images): void
    {
        $keepIds = [];

        foreach (array_values($images) as $index => $image) {
            $payload = [
                'image_url' => $image['image_url'],
                'caption' => $image['caption'] ?? null,
                'sort_order' => $image['sort_order'] ?? $index,
            ];

            if (!empty($image['id'])) {
                $record = $project->images()->whereKey($image['id'])->first();

                if ($record) {
                    $record->update($payload);
                    $keepIds[] = $record->id;
                    continue;
                }
            }

            $keepIds[] = $project->images()->create($payload)->id;
        }

        $project->images()
            ->when(
                count($keepIds) > 0,
                fn ($query) => $query->whereNotIn('id', $keepIds),
                fn ($query) => $query
            )
            ->delete();
    }
}
