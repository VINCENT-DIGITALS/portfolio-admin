<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Models\Blog;

class BlogController extends Controller
{
    public function index()
    {
        return BlogResource::collection(
            Blog::query()->where('is_published', true)->orderByDesc('published_at')->orderByDesc('created_at')->get()
        );
    }

    public function show(string $slug)
    {
        $blog = Blog::query()->where('slug', $slug)->where('is_published', true)->firstOrFail();
        return new BlogResource($blog);
    }
}
