<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EducationResource;
use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index()
    {
        return EducationResource::collection(Education::query()->orderBy('sort_order')->orderByDesc('start_date')->get());
    }

    public function store(Request $request)
    {
        return new EducationResource(Education::create($this->validateRequest($request)));
    }

    public function update(Request $request, Education $education)
    {
        $education->update($this->validateRequest($request, true));
        return new EducationResource($education);
    }

    public function destroy(Education $education)
    {
        $education->delete();
        return response()->json(['message' => 'Education entry deleted.']);
    }

    private function validateRequest(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'school' => [$partial ? 'sometimes' : 'required', 'string', 'max:160'],
            'degree' => ['nullable', 'string', 'max:160'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
