<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::query();
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }
        return CommentResource::collection($query->latest()->get());
    }

    public function updateStatus(Request $request, Comment $comment)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in([Comment::STATUS_PENDING, Comment::STATUS_APPROVED, Comment::STATUS_REJECTED])],
        ]);
        $comment->update($data);
        return new CommentResource($comment);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return response()->json(['message' => 'Comment deleted.']);
    }
}
