<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
        return CommentResource::collection(
            Comment::query()->where('status', Comment::STATUS_APPROVED)->latest()->get()
        );
    }

    public function store(StoreCommentRequest $request)
    {
        $comment = Comment::create($request->validated() + ['status' => Comment::STATUS_PENDING]);
        return (new CommentResource($comment))->additional(['message' => 'Thank you! Your comment is pending review.']);
    }
}
