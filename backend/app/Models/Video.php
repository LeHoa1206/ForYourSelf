<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

/**
 * Video Model - Core video content for English learning
 * 
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string $youtube_id
 * @property string $video_url
 * @property string|null $thumbnail_url
 * @property int $duration
 * @property int $category_id
 * @property string $difficulty_level
 * @property string $language
 * @property int $view_count
 * @property bool $is_active
 * @property int $created_by
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Video extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'youtube_id',
        'video_url',
        'thumbnail_url',
        'duration',
        'category_id',
        'difficulty_level',
        'language',
        'view_count',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'view_count' => 'integer',
        'duration' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_duration',
        'difficulty_badge_color',
        'category_name',
    ];

    /**
     * Get the category that owns the video.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(VideoCategory::class, 'category_id');
    }

    /**
     * Get the user who created the video.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the subtitles for the video.
     */
    public function subtitles(): HasMany
    {
        return $this->hasMany(VideoSubtitle::class);
    }

    /**
     * Get the vocabulary for the video.
     */
    public function vocabulary(): HasMany
    {
        return $this->hasMany(VideoVocabulary::class);
    }

    /**
     * Get the exercises for the video.
     */
    public function exercises(): HasMany
    {
        return $this->hasMany(VideoExercise::class);
    }

    /**
     * Get user progress for this video.
     */
    public function userProgress(): HasMany
    {
        return $this->hasMany(UserVideoProgress::class);
    }

    /**
     * Get formatted duration attribute.
     */
    public function getFormattedDurationAttribute(): string
    {
        $hours = floor($this->duration / 60);
        $minutes = $this->duration % 60;
        
        if ($hours > 0) {
            return sprintf('%d:%02d', $hours, $minutes);
        }
        
        return sprintf('%d min', $minutes);
    }

    /**
     * Get difficulty badge color.
     */
    public function getDifficultyBadgeColorAttribute(): string
    {
        return match($this->difficulty_level) {
            'beginner' => 'green',
            'intermediate' => 'yellow',
            'advanced' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get category name.
     */
    public function getCategoryNameAttribute(): string
    {
        return $this->category?->name ?? 'Uncategorized';
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'category_name' => $this->category_name,
            'difficulty_level' => $this->difficulty_level,
            'language' => $this->language,
        ];
    }

    /**
     * Scope for active videos.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for difficulty level.
     */
    public function scopeDifficulty($query, string $level)
    {
        return $query->where('difficulty_level', $level);
    }

    /**
     * Scope for category.
     */
    public function scopeCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Increment view count.
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    /**
     * Get YouTube embed URL.
     */
    public function getYouTubeEmbedUrl(): string
    {
        return "https://www.youtube.com/embed/{$this->youtube_id}";
    }

    /**
     * Get YouTube thumbnail URL.
     */
    public function getYouTubeThumbnailUrl(): string
    {
        return "https://img.youtube.com/vi/{$this->youtube_id}/maxresdefault.jpg";
    }
}
