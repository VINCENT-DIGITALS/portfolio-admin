<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Comment;
use App\Models\ContactMessage;
use App\Models\Project;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'totals' => [
                'projects' => Project::count(),
                'published_projects' => Project::where('is_published', true)->count(),
                'blogs' => Blog::count(),
                'published_blogs' => Blog::where('is_published', true)->count(),
                'comments_total' => Comment::count(),
                'comments_pending' => Comment::where('status', 'pending')->count(),
                'comments_approved' => Comment::where('status', 'approved')->count(),
                'unread_messages' => ContactMessage::where('is_read', false)->count(),
                'contact_messages_total' => ContactMessage::count(),
            ],
            'recent_comments' => Comment::latest()->take(5)->get(),
            'recent_messages' => ContactMessage::latest()->take(5)->get(),
        ]);
    }
}
