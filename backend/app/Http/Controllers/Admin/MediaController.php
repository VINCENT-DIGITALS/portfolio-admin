<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MediaFileResource;
use App\Models\MediaFile;
use App\Services\SupabaseStorageService;
use Illuminate\Http\Request;
use Throwable;

class MediaController extends Controller
{
    public function __construct(protected SupabaseStorageService $storage) {}

    public function index()
    {
        return MediaFileResource::collection(MediaFile::query()->latest()->get());
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:20480'], // 20MB
            'folder' => ['nullable', 'string', 'max:120'],
        ]);

        $uploaded = $this->storage->upload($request->file('file'), $request->string('folder')->toString() ?: 'uploads');

        $media = MediaFile::create([
            'file_name' => $uploaded['name'],
            'file_url' => $uploaded['url'],
            'file_type' => $uploaded['type'],
            'file_size' => $uploaded['size'],
            'folder' => $request->string('folder')->toString() ?: 'uploads',
        ]);

        return new MediaFileResource($media);
    }

    public function destroy(MediaFile $media)
    {
        try {
            $path = $this->storage->pathFromUrl($media->file_url);
            if ($path) {
                $this->storage->delete($path);
            }
        } catch (Throwable $e) {
            // Continue — DB record still removed.
        }
        $media->delete();
        return response()->json(['message' => 'File deleted.']);
    }
}
