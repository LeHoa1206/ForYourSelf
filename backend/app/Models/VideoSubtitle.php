<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Video Subtitle Model - Bilingual subtitles for videos
 * 
 * @property int $id
 * @property int $video_id
 * @property float $start_time
 * @property float $end_time
 * @property string $text
 * @property string $language
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class VideoSubtitle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'video_id',
        'start_time',
        'end_time',
        'text',
        'language',
        'is_active',
    ];

    protected $casts = [
        'start_time' => 'float',
        'end_time' => 'float',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_start_time',
        'formatted_end_time',
        'duration',
    ];

    /**
     * Get the video that owns the subtitle.
     */
    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }

    /**
     * Get formatted start time.
     */
    public function getFormattedStartTimeAttribute(): string
    {
        return $this->formatTime($this->start_time);
    }

    /**
     * Get formatted end time.
     */
    public function getFormattedEndTimeAttribute(): string
    {
        return $this->formatTime($this->end_time);
    }

    /**
     * Get duration in seconds.
     */
    public function getDurationAttribute(): float
    {
        return $this->end_time - $this->start_time;
    }

    /**
     * Format time in MM:SS format.
     */
    private function formatTime(float $seconds): string
    {
        $minutes = floor($seconds / 60);
        $seconds = floor($seconds % 60);
        return sprintf('%02d:%02d', $minutes, $seconds);
    }

    /**
     * Scope for active subtitles.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for language.
     */
    public function scopeLanguage($query, string $language)
    {
        return $query->where('language', $language);
    }

    /**
     * Scope for time range.
     */
    public function scopeTimeRange($query, float $startTime, float $endTime)
    {
        return $query->where('start_time', '>=', $startTime)
                    ->where('end_time', '<=', $endTime);
    }

    /**
     * Get bilingual subtitles for a video.
     */
    public static function getBilingualSubtitles(int $videoId): array
    {
        $englishSubtitles = self::where('video_id', $videoId)
            ->where('language', 'en')
            ->active()
            ->orderBy('start_time')
            ->get();

        $vietnameseSubtitles = self::where('video_id', $videoId)
            ->where('language', 'vi')
            ->active()
            ->orderBy('start_time')
            ->get()
            ->keyBy('start_time');

        return $englishSubtitles->map(function ($subtitle) use ($vietnameseSubtitles) {
            $vietnameseText = $vietnameseSubtitles->get($subtitle->start_time)?->text ?? null;
            
            return [
                'id' => $subtitle->id,
                'video_id' => $subtitle->video_id,
                'start_time' => $subtitle->start_time,
                'end_time' => $subtitle->end_time,
                'english_text' => $subtitle->text,
                'vietnamese_text' => $vietnameseText,
                'language' => $subtitle->language,
                'formatted_start_time' => $subtitle->formatted_start_time,
                'formatted_end_time' => $subtitle->formatted_end_time,
                'duration' => $subtitle->duration,
            ];
        })->toArray();
    }
}
