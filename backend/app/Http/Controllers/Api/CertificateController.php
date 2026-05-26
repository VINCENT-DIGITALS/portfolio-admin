<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;

class CertificateController extends Controller
{
    public function index()
    {
        return CertificateResource::collection(
            Certificate::query()->orderBy('sort_order')->orderByDesc('issue_date')->get()
        );
    }
}
