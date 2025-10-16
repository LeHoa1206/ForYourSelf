<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('user');
            $table->string('avatar')->nullable();
            $table->json('preferences')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('video_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#3B82F6');
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('youtube_id');
            $table->string('video_url');
            $table->string('thumbnail_url')->nullable();
            $table->integer('duration'); // in minutes
            $table->foreignId('category_id')->constrained('video_categories');
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
            $table->string('language', 2)->default('en');
            $table->integer('view_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['category_id', 'is_active']);
            $table->index(['difficulty_level', 'is_active']);
            $table->index(['created_at', 'is_active']);
        });

        Schema::create('video_subtitles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained('videos')->onDelete('cascade');
            $table->decimal('start_time', 10, 2);
            $table->decimal('end_time', 10, 2);
            $table->text('text');
            $table->string('language', 2)->default('en');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['video_id', 'start_time']);
            $table->index(['video_id', 'language']);
        });

        Schema::create('video_vocabulary', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained('videos')->onDelete('cascade');
            $table->string('word');
            $table->text('definition');
            $table->string('pronunciation')->nullable();
            $table->text('example_sentence')->nullable();
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['video_id', 'difficulty_level']);
        });

        Schema::create('video_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained('videos')->onDelete('cascade');
            $table->enum('type', ['multiple_choice', 'fill_blank', 'true_false', 'matching']);
            $table->text('question');
            $table->json('options')->nullable();
            $table->string('correct_answer');
            $table->text('explanation')->nullable();
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['video_id', 'type']);
        });

        Schema::create('user_video_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('video_id')->constrained('videos')->onDelete('cascade');
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->integer('time_watched')->default(0); // in seconds
            $table->boolean('completed')->default(false);
            $table->timestamp('last_watched_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'video_id']);
            $table->index(['user_id', 'completed']);
        });

        Schema::create('user_vocabulary', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('word');
            $table->text('definition');
            $table->integer('mastery_level')->default(0); // 0-5
            $table->timestamp('last_reviewed_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'word']);
            $table->index(['user_id', 'mastery_level']);
        });

        Schema::create('news_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#10B981');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('featured_image')->nullable();
            $table->foreignId('category_id')->constrained('news_categories');
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
            $table->integer('read_time')->nullable(); // in minutes
            $table->integer('view_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['category_id', 'is_active']);
            $table->index(['is_featured', 'is_active']);
        });

        Schema::create('dictation_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#8B5CF6');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('dictation_exercises', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->text('audio_url')->nullable();
            $table->foreignId('level_id')->constrained('dictation_levels');
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
            $table->integer('duration')->nullable(); // in seconds
            $table->integer('attempt_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['level_id', 'difficulty_level']);
        });

        Schema::create('user_exercise_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained('video_exercises')->onDelete('cascade');
            $table->string('user_answer');
            $table->boolean('is_correct');
            $table->integer('time_taken')->nullable(); // in seconds
            $table->timestamps();
            
            $table->index(['user_id', 'is_correct']);
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('user_exercise_attempts');
        Schema::dropIfExists('dictation_exercises');
        Schema::dropIfExists('dictation_levels');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('news_categories');
        Schema::dropIfExists('user_vocabulary');
        Schema::dropIfExists('user_video_progress');
        Schema::dropIfExists('video_exercises');
        Schema::dropIfExists('video_vocabulary');
        Schema::dropIfExists('video_subtitles');
        Schema::dropIfExists('videos');
        Schema::dropIfExists('video_categories');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
