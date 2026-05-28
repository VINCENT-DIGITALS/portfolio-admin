<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;

class BlogController extends Controller
{
    public function index()
    {
        return BlogResource::collection(Blog::query()->orderByDesc('created_at')->get());
    }

    public function store(StoreBlogRequest $request)
    {
        $data = $request->validated();
        if ($request->boolean('is_published') && empty($data['published_at'])) {
            $data['published_at'] = now();
        }
        $blog = Blog::create($data);
        return new BlogResource($blog);
    }

    public function show(Blog $blog)
    {
        return new BlogResource($blog);
    }

    public function update(UpdateBlogRequest $request, Blog $blog)
    {
        $data = $request->validated();
        if ($request->boolean('is_published') && empty($blog->published_at) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }
        $blog->update($data);
        return new BlogResource($blog);
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();
        return response()->json(['message' => 'Blog deleted.']);
    }
}
