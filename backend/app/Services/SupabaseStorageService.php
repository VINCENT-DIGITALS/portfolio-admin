<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

class SupabaseStorageService
{
    protected Client $http;
    protected string $url;
    protected string $key;
    protected string $bucket;

    public function __construct()
    {
        $this->url = rtrim((string) config('services.supabase.url'), '/');
        $this->key = (string) config('services.supabase.service_role_key');
        $this->bucket = (string) config('services.supabase.bucket');

        if (!$this->url || !$this->key) {
            throw new RuntimeException('Supabase credentials missing. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }

        $this->http = new Client([
            'base_uri' => $this->url,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->key,
                'apikey' => $this->key,
            ],
            'timeout' => 30,
        ]);
    }

    /**
     * Upload an UploadedFile to Supabase Storage and return the public URL + metadata.
     *
     * @return array{url:string,path:string,name:string,type:string,size:int}
     */
    public function upload(UploadedFile $file, string $folder = 'uploads'): array
    {
        $folder = trim($folder, '/');
        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $name = Str::random(24) . ($extension ? '.' . $extension : '');
        $path = ($folder ? $folder . '/' : '') . $name;

        $this->http->post("/storage/v1/object/{$this->bucket}/{$path}", [
            'headers' => [
                'Content-Type' => $file->getMimeType() ?: 'application/octet-stream',
                'x-upsert' => 'true',
            ],
            'body' => fopen($file->getRealPath(), 'rb'),
        ]);

        return [
            'url' => $this->publicUrl($path),
            'path' => $path,
            'name' => $file->getClientOriginalName(),
            'type' => $file->getMimeType() ?: 'application/octet-stream',
            'size' => (int) $file->getSize(),
        ];
    }

    public function delete(string $path): void
    {
        $path = ltrim($path, '/');
        $this->http->delete("/storage/v1/object/{$this->bucket}/{$path}");
    }

    public function publicUrl(string $path): string
    {
        $path = ltrim($path, '/');
        return "{$this->url}/storage/v1/object/public/{$this->bucket}/{$path}";
    }

    /**
     * Extract the storage path from a public URL we previously generated.
     */
    public function pathFromUrl(string $url): ?string
    {
        $needle = "/storage/v1/object/public/{$this->bucket}/";
        $idx = strpos($url, $needle);
        if ($idx === false) {
            return null;
        }
        return substr($url, $idx + strlen($needle));
    }
}
