<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Profile::query()->first();
        return $profile ? new ProfileResource($profile) : response()->json(['data' => null]);
    }
}
