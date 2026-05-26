<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request)
    {
        ContactMessage::create($request->validated());
        return response()->json(['message' => 'Message sent successfully.'], 201);
    }
}
