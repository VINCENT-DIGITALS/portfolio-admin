<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        return SkillResource::collection(Skill::query()->orderBy('sort_order')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'category' => ['nullable', 'string', 'max:120'],
            'icon_url' => ['nullable', 'url'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);
        return new SkillResource(Skill::create($data));
    }

    public function update(Request $request, Skill $skill)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'category' => ['nullable', 'string', 'max:120'],
            'icon_url' => ['nullable', 'url'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);
        $skill->update($data);
        return new SkillResource($skill);
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return response()->json(['message' => 'Skill deleted.']);
    }
}
