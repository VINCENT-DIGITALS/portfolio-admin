<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        return ExperienceResource::collection(Experience::query()->orderBy('sort_order')->orderByDesc('start_date')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validateRequest($request);
        return new ExperienceResource(Experience::create($data));
    }

    public function update(Request $request, Experience $experience)
    {
        $data = $this->validateRequest($request, true);
        $experience->update($data);
        return new ExperienceResource($experience);
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();
        return response()->json(['message' => 'Experience deleted.']);
    }

    private function validateRequest(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'company' => [$partial ? 'sometimes' : 'required', 'string', 'max:160'],
            'position' => [$partial ? 'sometimes' : 'required', 'string', 'max:160'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_current' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
