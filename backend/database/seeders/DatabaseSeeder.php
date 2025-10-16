<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\VideoCategory;
use App\Models\Video;
use App\Models\VideoSubtitle;
use App\Models\VideoVocabulary;
use App\Models\VideoExercise;
use App\Models\NewsCategory;
use App\Models\NewsArticle;
use App\Models\DictationLevel;
use App\Models\DictationExercise;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@viplearning.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular user
        User::create([
            'name' => 'John Doe',
            'email' => 'user@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create video categories
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology', 'color' => '#3B82F6'],
            ['name' => 'Business', 'slug' => 'business', 'color' => '#10B981'],
            ['name' => 'Grammar', 'slug' => 'grammar', 'color' => '#F59E0B'],
            ['name' => 'Conversation', 'slug' => 'conversation', 'color' => '#EF4444'],
            ['name' => 'Pronunciation', 'slug' => 'pronunciation', 'color' => '#8B5CF6'],
        ];

        foreach ($categories as $category) {
            VideoCategory::create($category);
        }

        // Create sample videos
        $videos = [
            [
                'title' => 'Learn English Through Technology',
                'slug' => 'learn-english-technology',
                'description' => 'Master technology vocabulary while improving your English skills through real-world examples.',
                'youtube_id' => 'dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration' => 54,
                'category_id' => 1,
                'difficulty_level' => 'intermediate',
                'language' => 'en',
                'created_by' => 1,
            ],
            [
                'title' => 'Business English Essentials',
                'slug' => 'business-english-essentials',
                'description' => 'Essential business English for professional communication and workplace success.',
                'youtube_id' => 'dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration' => 48,
                'category_id' => 2,
                'difficulty_level' => 'intermediate',
                'language' => 'en',
                'created_by' => 1,
            ],
            [
                'title' => 'English Grammar Mastery',
                'slug' => 'english-grammar-mastery',
                'description' => 'Master English grammar with practical examples and interactive exercises.',
                'youtube_id' => 'dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration' => 42,
                'category_id' => 3,
                'difficulty_level' => 'beginner',
                'language' => 'en',
                'created_by' => 1,
            ],
            [
                'title' => 'Daily English Conversations',
                'slug' => 'daily-english-conversations',
                'description' => 'Practice everyday English conversations for real-life situations.',
                'youtube_id' => 'dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration' => 36,
                'category_id' => 4,
                'difficulty_level' => 'beginner',
                'language' => 'en',
                'created_by' => 1,
            ],
            [
                'title' => 'Perfect English Pronunciation',
                'slug' => 'perfect-english-pronunciation',
                'description' => 'Improve your English pronunciation with expert guidance and practice exercises.',
                'youtube_id' => 'dQw4w9WgXcQ',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration' => 45,
                'category_id' => 5,
                'difficulty_level' => 'intermediate',
                'language' => 'en',
                'created_by' => 1,
            ],
        ];

        foreach ($videos as $video) {
            Video::create($video);
        }

        // Create sample subtitles for first video
        $subtitles = [
            ['start_time' => 0.00, 'end_time' => 4.00, 'text' => 'Welcome to our English learning video.', 'language' => 'en'],
            ['start_time' => 4.00, 'end_time' => 8.00, 'text' => 'Today we will learn about technology vocabulary.', 'language' => 'en'],
            ['start_time' => 8.00, 'end_time' => 12.00, 'text' => 'Let\'s start with basic computer terms.', 'language' => 'en'],
            ['start_time' => 12.00, 'end_time' => 16.00, 'text' => 'A computer is an electronic device.', 'language' => 'en'],
            ['start_time' => 16.00, 'end_time' => 20.00, 'text' => 'It processes information and data.', 'language' => 'en'],
        ];

        foreach ($subtitles as $subtitle) {
            VideoSubtitle::create([
                'video_id' => 1,
                'start_time' => $subtitle['start_time'],
                'end_time' => $subtitle['end_time'],
                'text' => $subtitle['text'],
                'language' => $subtitle['language'],
            ]);
        }

        // Create Vietnamese subtitles
        $vietnameseSubtitles = [
            ['start_time' => 0.00, 'end_time' => 4.00, 'text' => 'Chào mừng đến với video học tiếng Anh của chúng tôi.', 'language' => 'vi'],
            ['start_time' => 4.00, 'end_time' => 8.00, 'text' => 'Hôm nay chúng ta sẽ học từ vựng về công nghệ.', 'language' => 'vi'],
            ['start_time' => 8.00, 'end_time' => 12.00, 'text' => 'Hãy bắt đầu với các thuật ngữ máy tính cơ bản.', 'language' => 'vi'],
            ['start_time' => 12.00, 'end_time' => 16.00, 'text' => 'Máy tính là một thiết bị điện tử.', 'language' => 'vi'],
            ['start_time' => 16.00, 'end_time' => 20.00, 'text' => 'Nó xử lý thông tin và dữ liệu.', 'language' => 'vi'],
        ];

        foreach ($vietnameseSubtitles as $subtitle) {
            VideoSubtitle::create([
                'video_id' => 1,
                'start_time' => $subtitle['start_time'],
                'end_time' => $subtitle['end_time'],
                'text' => $subtitle['text'],
                'language' => $subtitle['language'],
            ]);
        }

        // Create sample vocabulary
        $vocabulary = [
            ['word' => 'computer', 'definition' => 'An electronic device for processing data', 'pronunciation' => '/kəmˈpjuːtər/', 'example_sentence' => 'I use my computer every day for work.'],
            ['word' => 'software', 'definition' => 'Programs and applications that run on a computer', 'pronunciation' => '/ˈsɒftweər/', 'example_sentence' => 'This software helps me organize my files.'],
            ['word' => 'hardware', 'definition' => 'Physical components of a computer system', 'pronunciation' => '/ˈhɑːrdweər/', 'example_sentence' => 'The hardware includes the monitor and keyboard.'],
            ['word' => 'internet', 'definition' => 'Global network connecting computers worldwide', 'pronunciation' => '/ˈɪntərnet/', 'example_sentence' => 'I search for information on the internet.'],
            ['word' => 'website', 'definition' => 'A collection of web pages on the internet', 'pronunciation' => '/ˈwebsaɪt/', 'example_sentence' => 'This website has great English lessons.'],
        ];

        foreach ($vocabulary as $vocab) {
            VideoVocabulary::create([
                'video_id' => 1,
                'word' => $vocab['word'],
                'definition' => $vocab['definition'],
                'pronunciation' => $vocab['pronunciation'],
                'example_sentence' => $vocab['example_sentence'],
                'difficulty_level' => 'intermediate',
            ]);
        }

        // Create sample exercises
        $exercises = [
            [
                'type' => 'multiple_choice',
                'question' => 'What is a computer?',
                'options' => json_encode(['An electronic device', 'A type of food', 'A musical instrument', 'A book']),
                'correct_answer' => 'An electronic device',
                'explanation' => 'A computer is an electronic device that processes data.',
                'difficulty_level' => 'beginner',
            ],
            [
                'type' => 'true_false',
                'question' => 'Software refers to physical computer components.',
                'options' => null,
                'correct_answer' => 'False',
                'explanation' => 'Software refers to programs, not physical components.',
                'difficulty_level' => 'intermediate',
            ],
        ];

        foreach ($exercises as $exercise) {
            VideoExercise::create([
                'video_id' => 1,
                'type' => $exercise['type'],
                'question' => $exercise['question'],
                'options' => $exercise['options'],
                'correct_answer' => $exercise['correct_answer'],
                'explanation' => $exercise['explanation'],
                'difficulty_level' => $exercise['difficulty_level'],
            ]);
        }

        // Create news categories
        $newsCategories = [
            ['name' => 'Technology News', 'slug' => 'technology-news', 'color' => '#3B82F6'],
            ['name' => 'Business News', 'slug' => 'business-news', 'color' => '#10B981'],
            ['name' => 'Education News', 'slug' => 'education-news', 'color' => '#F59E0B'],
        ];

        foreach ($newsCategories as $category) {
            NewsCategory::create($category);
        }

        // Create sample news articles
        $newsArticles = [
            [
                'title' => 'The Future of AI in Education',
                'slug' => 'future-ai-education',
                'content' => 'Artificial Intelligence is revolutionizing the way we learn languages...',
                'excerpt' => 'How AI is changing language learning forever.',
                'category_id' => 1,
                'difficulty_level' => 'intermediate',
                'read_time' => 5,
                'created_by' => 1,
            ],
            [
                'title' => 'Remote Work Communication Tips',
                'slug' => 'remote-work-communication',
                'content' => 'Effective communication in remote work environments...',
                'excerpt' => 'Master the art of virtual communication.',
                'category_id' => 2,
                'difficulty_level' => 'intermediate',
                'read_time' => 7,
                'created_by' => 1,
            ],
        ];

        foreach ($newsArticles as $article) {
            NewsArticle::create($article);
        }

        // Create dictation levels
        $dictationLevels = [
            ['name' => 'Beginner', 'slug' => 'beginner', 'color' => '#10B981'],
            ['name' => 'Intermediate', 'slug' => 'intermediate', 'color' => '#F59E0B'],
            ['name' => 'Advanced', 'slug' => 'advanced', 'color' => '#EF4444'],
        ];

        foreach ($dictationLevels as $level) {
            DictationLevel::create($level);
        }

        // Create sample dictation exercises
        $dictationExercises = [
            [
                'title' => 'Daily Routine Dictation',
                'content' => 'I wake up at seven o\'clock every morning. I brush my teeth and have breakfast.',
                'level_id' => 1,
                'difficulty_level' => 'beginner',
                'duration' => 30,
                'created_by' => 1,
            ],
            [
                'title' => 'Technology Vocabulary Dictation',
                'content' => 'Modern computers use advanced software to process complex algorithms efficiently.',
                'level_id' => 2,
                'difficulty_level' => 'intermediate',
                'duration' => 45,
                'created_by' => 1,
            ],
        ];

        foreach ($dictationExercises as $exercise) {
            DictationExercise::create($exercise);
        }
    }
}
