<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Sample articles data
$articles = [
    [
        'ArticleID' => 1,
        'Title' => 'Climate Change Impact on Global Economy',
        'Content' => 'Climate change is having a profound impact on the global economy. Rising temperatures, extreme weather events, and sea level rise are causing significant economic losses worldwide. Governments and businesses are increasingly recognizing the need for sustainable practices and green investments. The transition to renewable energy sources is accelerating, creating new job opportunities while phasing out traditional industries. International cooperation is crucial to address these challenges effectively.',
        'Summary' => 'Climate change affects global economy through extreme weather and rising costs, requiring sustainable solutions.',
        'SourceName' => 'BBC News',
        'SourceURL' => 'https://www.bbc.com/news',
        'LanguageName' => 'English',
        'Category' => 'Environment',
        'DifficultyLevel' => 'Intermediate',
        'ReadingTime' => 3,
        'WordCount' => 85,
        'PublishedAt' => '2024-01-15 10:00:00'
    ],
    [
        'ArticleID' => 2,
        'Title' => 'New Technology Revolutionizes Healthcare',
        'Content' => 'Artificial intelligence and machine learning are transforming healthcare delivery. Medical professionals can now diagnose diseases more accurately using AI-powered tools. Telemedicine has become mainstream, allowing patients to receive care remotely. These innovations improve patient outcomes while reducing healthcare costs. However, challenges remain in data privacy and ensuring equitable access to technology.',
        'Summary' => 'AI and telemedicine are changing healthcare, improving diagnosis and access to care.',
        'SourceName' => 'CNN',
        'SourceURL' => 'https://www.cnn.com',
        'LanguageName' => 'English',
        'Category' => 'Technology',
        'DifficultyLevel' => 'Advanced',
        'ReadingTime' => 4,
        'WordCount' => 78,
        'PublishedAt' => '2024-01-14 15:30:00'
    ],
    [
        'ArticleID' => 3,
        'Title' => 'Sustainable Agriculture Practices Gain Momentum',
        'Content' => 'Farmers worldwide are adopting sustainable agriculture practices to protect the environment. Organic farming, crop rotation, and reduced pesticide use are becoming more common. These methods help preserve soil health and biodiversity. Consumers are increasingly demanding sustainably produced food. Government policies are supporting this transition through subsidies and regulations.',
        'Summary' => 'Farmers adopt eco-friendly methods like organic farming and crop rotation for better sustainability.',
        'SourceName' => 'Reuters',
        'SourceURL' => 'https://www.reuters.com',
        'LanguageName' => 'English',
        'Category' => 'Agriculture',
        'DifficultyLevel' => 'Intermediate',
        'ReadingTime' => 3,
        'WordCount' => 72,
        'PublishedAt' => '2024-01-13 09:15:00'
    ],
    [
        'ArticleID' => 4,
        'Title' => 'Space Exploration Reaches New Milestones',
        'Content' => 'Recent advances in space technology have opened new possibilities for exploration and research. Private companies are now leading the way in commercial space travel, making it more accessible to civilians. International space stations continue to serve as platforms for scientific experiments and international cooperation. Future missions to Mars and beyond are being planned with ambitious timelines.',
        'Summary' => 'Space exploration advances with private companies and international cooperation driving new missions.',
        'SourceName' => 'Space News',
        'SourceURL' => 'https://www.spacenews.com',
        'LanguageName' => 'English',
        'Category' => 'Science',
        'DifficultyLevel' => 'Advanced',
        'ReadingTime' => 4,
        'WordCount' => 88,
        'PublishedAt' => '2024-01-12 14:20:00'
    ],
    [
        'ArticleID' => 5,
        'Title' => 'Digital Education Transforms Learning',
        'Content' => 'Online learning platforms have revolutionized education, making quality instruction accessible to students worldwide. Virtual reality and augmented reality technologies are creating immersive learning experiences. Artificial intelligence is being used to personalize education and provide adaptive learning paths. These innovations are particularly valuable in remote and underserved areas.',
        'Summary' => 'Digital education uses VR, AR, and AI to create personalized and accessible learning experiences.',
        'SourceName' => 'Education Weekly',
        'SourceURL' => 'https://www.educationweekly.com',
        'LanguageName' => 'English',
        'Category' => 'Education',
        'DifficultyLevel' => 'Intermediate',
        'ReadingTime' => 3,
        'WordCount' => 76,
        'PublishedAt' => '2024-01-11 11:45:00'
    ]
];

echo json_encode([
    'success' => true,
    'data' => $articles,
    'total' => count($articles)
], JSON_UNESCAPED_UNICODE);
?>
