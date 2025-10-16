<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\DictationController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('register', [AuthController::class, 'register']);
        Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
        Route::put('profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
        Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
    });

    // Public video routes
    Route::get('videos', [VideoController::class, 'index']);
    Route::get('videos/{id}', [VideoController::class, 'show']);
    Route::get('videos/search', [VideoController::class, 'search']);
    Route::get('videos/{id}/subtitles', [VideoController::class, 'subtitles']);

    // Public category routes
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{id}', [CategoryController::class, 'show']);

    // Public news routes
    Route::get('news', [NewsController::class, 'index']);
    Route::get('news/{id}', [NewsController::class, 'show']);

    // Public dictation routes
    Route::get('dictation', [DictationController::class, 'index']);
    Route::get('dictation/{id}', [DictationController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        
        // Video progress
        Route::post('videos/{id}/progress', [VideoController::class, 'updateProgress']);
        
        // User progress
        Route::get('progress', [ProgressController::class, 'index']);
        Route::get('progress/video/{id}', [ProgressController::class, 'getVideoProgress']);
        
        // Admin routes
        Route::prefix('admin')->middleware('role:admin')->group(function () {
            Route::get('stats', [AdminController::class, 'getStats']);
            Route::get('users', [AdminController::class, 'getUsers']);
            Route::put('users/{id}/role', [AdminController::class, 'updateUserRole']);
            Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
            
            // Video management
            Route::post('videos', [VideoController::class, 'store']);
            Route::put('videos/{id}', [VideoController::class, 'update']);
            Route::delete('videos/{id}', [VideoController::class, 'destroy']);
            
            // News management
            Route::post('news', [NewsController::class, 'store']);
            Route::put('news/{id}', [NewsController::class, 'update']);
            Route::delete('news/{id}', [NewsController::class, 'destroy']);
            
            // Dictation management
            Route::post('dictation', [DictationController::class, 'store']);
            Route::put('dictation/{id}', [DictationController::class, 'update']);
            Route::delete('dictation/{id}', [DictationController::class, 'destroy']);
        });
    });

    // File upload
    Route::post('upload', function (Request $request) {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'type' => 'required|in:image,video,audio'
        ]);

        $file = $request->file('file');
        $type = $request->input('type');
        
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('uploads/' . $type, $filename, 'public');
        
        return response()->json([
            'success' => true,
            'data' => [
                'filename' => $filename,
                'path' => $path,
                'url' => asset('storage/' . $path),
                'size' => $file->getSize(),
                'type' => $file->getMimeType()
            ]
        ]);
    })->middleware('auth:sanctum');

    // Analytics
    Route::get('analytics', function (Request $request) {
        $period = $request->get('period', 'month');
        
        // Mock analytics data
        $data = [
            'users' => [
                'total' => 1250,
                'active' => 890,
                'new_this_period' => 156
            ],
            'videos' => [
                'total' => 45,
                'views' => 12500,
                'completion_rate' => 78.5
            ],
            'engagement' => [
                'avg_session_duration' => '12:34',
                'bounce_rate' => 23.4,
                'return_rate' => 67.8
            ]
        ];
        
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    })->middleware('auth:sanctum');

    Route::post('analytics/track', function (Request $request) {
        $request->validate([
            'event' => 'required|string',
            'data' => 'nullable|array'
        ]);

        // Log analytics event
        \Log::info('Analytics Event', [
            'event' => $request->input('event'),
            'data' => $request->input('data'),
            'user_id' => auth()->id(),
            'timestamp' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Event tracked successfully'
        ]);
    })->middleware('auth:sanctum');
});

// Health check
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});
