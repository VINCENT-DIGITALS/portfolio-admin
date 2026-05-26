<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::query()->where('status', Comment::STATUS_APPROVED);

        if ($request->filled('project_id')) {
            $query->where('project_id', (int) $request->input('project_id'));
        } elseif ($request->boolean('general_only')) {
            $query->whereNull('project_id');
        }

        return CommentResource::collection($query->latest()->get());
    }

    public function store(StoreCommentRequest $request)
    {
        $comment = Comment::create($request->validated() + ['status' => Comment::STATUS_PENDING]);
        return (new CommentResource($comment))->additional(['message' => 'Thank you! Your comment is pending review.']);
    }
}
