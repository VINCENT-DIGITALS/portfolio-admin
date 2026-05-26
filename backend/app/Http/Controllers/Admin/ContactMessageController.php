<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index()
    {
        return ContactMessageResource::collection(ContactMessage::query()->latest()->get());
    }

    public function markRead(Request $request, ContactMessage $message)
    {
        $message->update(['is_read' => (bool) $request->input('is_read', true)]);
        return new ContactMessageResource($message);
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();
        return response()->json(['message' => 'Message deleted.']);
    }
}
