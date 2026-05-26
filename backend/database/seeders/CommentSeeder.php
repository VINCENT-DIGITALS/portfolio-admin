<?php

namespace Database\Seeders;

use App\Models\Comment;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Maria Santos', 'email' => 'maria@example.com', 'message' => 'Great work — clean UI and fast performance.', 'rating' => 5, 'status' => 'approved'],
            ['name' => 'John Lim', 'email' => 'john@example.com', 'message' => 'Loved the chat project!', 'rating' => 4, 'status' => 'approved'],
            ['name' => 'Anonymous', 'email' => null, 'message' => 'Pending review.', 'rating' => null, 'status' => 'pending'],
        ];
        foreach ($items as $row) {
            Comment::updateOrCreate(['name' => $row['name'], 'message' => $row['message']], $row);
        }
    }
}
