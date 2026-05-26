<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        return SkillResource::collection(
            Skill::query()->where('is_active', true)->orderBy('sort_order')->orderBy('name')->get()
        );
    }
}
