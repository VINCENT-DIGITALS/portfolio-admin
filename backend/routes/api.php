<?php

use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\CertificateController as AdminCertificateController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EducationController as AdminEducationController;
use App\Http\Controllers\Admin\ExperienceController as AdminExperienceController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PublicSettingsController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/* Admin routes reference projects/blogs by numeric id, while public routes
 * use their slugs. Override the implicit route-model binding so {project}
 * and {blog} are resolved by id (the public routes use a raw {slug} segment
 * so this binding doesn't conflict with them). */
Route::bind('project', fn ($value) => \App\Models\Project::findOrFail($value));
Route::bind('blog', fn ($value) => \App\Models\Blog::findOrFail($value));

/* -------- Public -------- */
Route::get('/public-settings', [PublicSettingsController::class, 'index']);
Route::get('/profile', [ProfileController::class, 'show']);
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::get('/education', [EducationController::class, 'index']);
Route::get('/certificates', [CertificateController::class, 'index']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
Route::get('/comments', [CommentController::class, 'index']);
Route::post('/comments', [CommentController::class, 'store']);
Route::post('/contact', [ContactController::class, 'store']);

/* -------- Admin Auth -------- */
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        Route::middleware('admin')->group(function () {
            Route::get('/dashboard', DashboardController::class);

            Route::apiResource('projects', AdminProjectController::class);
            Route::apiResource('blogs', AdminBlogController::class);
            Route::apiResource('skills', AdminSkillController::class)->except(['show']);
            Route::apiResource('experiences', AdminExperienceController::class)->except(['show']);
            Route::apiResource('education', AdminEducationController::class)->except(['show'])->parameters(['education' => 'education']);
            Route::apiResource('certificates', AdminCertificateController::class)->except(['show']);

            Route::get('/comments', [AdminCommentController::class, 'index']);
            Route::patch('/comments/{comment}/status', [AdminCommentController::class, 'updateStatus']);
            Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy']);

            Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
            Route::patch('/contact-messages/{message}/read', [AdminContactMessageController::class, 'markRead']);
            Route::delete('/contact-messages/{message}', [AdminContactMessageController::class, 'destroy']);

            Route::get('/profile', [AdminProfileController::class, 'show']);
            Route::match(['put', 'patch'], '/profile', [AdminProfileController::class, 'update']);

            Route::get('/media', [MediaController::class, 'index']);
            Route::post('/media/upload', [MediaController::class, 'upload']);
            Route::delete('/media/{media}', [MediaController::class, 'destroy']);

            Route::get('/settings', [SettingController::class, 'index']);
            Route::post('/settings', [SettingController::class, 'upsert']);
            Route::delete('/settings/{key}', [SettingController::class, 'destroy']);
        });
    });
});
