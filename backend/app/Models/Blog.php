<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (Blog $blog) {
            if (empty($blog->slug) && !empty($blog->title)) {
                $blog->slug = Str::slug($blog->title);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null): ?Model
    {
        $query = $this->newQuery();

        if ($field !== null) {
            return $query->where($field, $value)->firstOrFail();
        }

        if (is_numeric($value)) {
            return $query->whereKey($value)->firstOrFail();
        }

        return $query->where($this->getRouteKeyName(), $value)->firstOrFail();
    }
}
