<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VideoRequest;
use App\Http\Resources\VideoResource;
use App\Http\Resources\VideoCollection;
use App\Models\Video;
use App\Models\VideoSubtitle;
use App\Services\VideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Video API Controller - Handles all video-related API endpoints
 * 
 * Features:
 * - CRUD operations for videos
 * - Video search and filtering
 * - Subtitle management
 * - Progress tracking
 * - Analytics
 */
class VideoController extends Controller
{
    public function __construct(
        private VideoService $videoService
    ) {
        $this->middleware('auth:sanctum')->except(['index', 'show', 'search']);
        $this->middleware('role:admin')->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of videos with advanced filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'videos_' . md5(serialize($request->all()));
        
        $videos = Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Video::with(['category', 'creator'])
                ->active()
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('category_id')) {
                $query->category($request->category_id);
            }

            if ($request->has('difficulty')) {
                $query->difficulty($request->difficulty);
            }

            if ($request->has('language')) {
                $query->where('language', $request->language);
            }

            if ($request->has('search')) {
                $query->search($request->search);
            }

            if ($request->has('duration_min')) {
                $query->where('duration', '>=', $request->duration_min);
            }

            if ($request->has('duration_max')) {
                $query->where('duration', '<=', $request->duration_max);
            }

            // Pagination
            $perPage = min($request->get('per_page', 12), 50);
            
            return $query->paginate($perPage);
        });

        return response()->json([
            'success' => true,
            'data' => new VideoCollection($videos),
            'meta' => [
                'total' => $videos->total(),
                'per_page' => $videos->perPage(),
                'current_page' => $videos->currentPage(),
                'last_page' => $videos->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created video.
     */
    public function store(VideoRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $video = $this->videoService->createVideo($request->validated());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Video created successfully',
                'data' => new VideoResource($video->load(['category', 'creator']))
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create video',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified video with full details.
     */
    public function show(Request $request, Video $video): JsonResponse
    {
        // Increment view count
        $video->incrementViewCount();

        // Load relationships
        $video->load([
            'category',
            'creator',
            'subtitles' => function ($query) {
                $query->active()->orderBy('start_time');
            },
            'vocabulary',
            'exercises'
        ]);

        // Get user progress if authenticated
        $userProgress = null;
        if ($request->user()) {
            $userProgress = $video->userProgress()
                ->where('user_id', $request->user()->id)
                ->first();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'video' => new VideoResource($video),
                'subtitles' => VideoSubtitle::getBilingualSubtitles($video->id),
                'user_progress' => $userProgress,
                'related_videos' => $this->getRelatedVideos($video)
            ]
        ]);
    }

    /**
     * Update the specified video.
     */
    public function update(VideoRequest $request, Video $video): JsonResponse
    {
        try {
            DB::beginTransaction();

            $video = $this->videoService->updateVideo($video, $request->validated());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Video updated successfully',
                'data' => new VideoResource($video->load(['category', 'creator']))
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update video',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified video.
     */
    public function destroy(Video $video): JsonResponse
    {
        try {
            $video->delete();

            return response()->json([
                'success' => true,
                'message' => 'Video deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete video',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Search videos with advanced filters.
     */
    public function search(Request $request): JsonResponse
    {
        $query = Video::with(['category', 'creator'])
            ->active()
            ->search($request->get('q', ''));

        // Apply filters
        if ($request->has('filters')) {
            $filters = $request->get('filters', []);
            
            if (isset($filters['category_id'])) {
                $query->category($filters['category_id']);
            }
            
            if (isset($filters['difficulty'])) {
                $query->difficulty($filters['difficulty']);
            }
            
            if (isset($filters['language'])) {
                $query->where('language', $filters['language']);
            }
        }

        $perPage = min($request->get('per_page', 12), 50);
        $videos = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => new VideoCollection($videos),
            'meta' => [
                'total' => $videos->total(),
                'per_page' => $videos->perPage(),
                'current_page' => $videos->currentPage(),
                'last_page' => $videos->lastPage(),
            ]
        ]);
    }

    /**
     * Get video subtitles.
     */
    public function subtitles(Video $video): JsonResponse
    {
        $subtitles = VideoSubtitle::getBilingualSubtitles($video->id);

        return response()->json([
            'success' => true,
            'data' => $subtitles
        ]);
    }

    /**
     * Update user progress for a video.
     */
    public function updateProgress(Request $request, Video $video): JsonResponse
    {
        $request->validate([
            'progress_percentage' => 'required|numeric|min:0|max:100',
            'time_watched' => 'required|numeric|min:0',
            'completed' => 'boolean'
        ]);

        $user = $request->user();
        
        $progress = $video->userProgress()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'progress_percentage' => $request->progress_percentage,
                'time_watched' => $request->time_watched,
                'completed' => $request->get('completed', false),
                'last_watched_at' => now()
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Progress updated successfully',
            'data' => $progress
        ]);
    }

    /**
     * Get related videos.
     */
    private function getRelatedVideos(Video $video): array
    {
        return Video::with(['category'])
            ->where('id', '!=', $video->id)
            ->where(function ($query) use ($video) {
                $query->where('category_id', $video->category_id)
                      ->orWhere('difficulty_level', $video->difficulty_level);
            })
            ->active()
            ->limit(6)
            ->get()
            ->map(fn($v) => new VideoResource($v))
            ->toArray();
    }
}
