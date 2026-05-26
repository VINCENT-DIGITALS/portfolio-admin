<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Setting::all()->pluck('value', 'key')]);
    }

    public function upsert(Request $request)
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable'],
        ]);

        foreach ($data['settings'] as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json(['message' => 'Settings saved.', 'data' => Setting::all()->pluck('value', 'key')]);
    }

    public function destroy(string $key)
    {
        Setting::where('key', $key)->delete();
        return response()->json(['message' => 'Setting deleted.']);
    }
}
