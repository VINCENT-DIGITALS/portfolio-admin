<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EducationResource;
use App\Models\Education;

class EducationController extends Controller
{
    public function index()
    {
        return EducationResource::collection(
            Education::query()->orderBy('sort_order')->orderByDesc('start_date')->get()
        );
    }
}
