<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index()
    {
        return CertificateResource::collection(Certificate::query()->orderBy('sort_order')->orderByDesc('issue_date')->get());
    }

    public function store(Request $request)
    {
        return new CertificateResource(Certificate::create($this->validateRequest($request)));
    }

    public function update(Request $request, Certificate $certificate)
    {
        $certificate->update($this->validateRequest($request, true));
        return new CertificateResource($certificate);
    }

    public function destroy(Certificate $certificate)
    {
        $certificate->delete();
        return response()->json(['message' => 'Certificate deleted.']);
    }

    private function validateRequest(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'title' => [$partial ? 'sometimes' : 'required', 'string', 'max:200'],
            'issuer' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'issue_date' => ['nullable', 'date'],
            'certificate_url' => ['nullable', 'url'],
            'image_url' => ['nullable', 'url'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
