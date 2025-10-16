<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Sample data for testing
$articles = [
    [
        'ArticleID' => 1,
        'Title' => 'Climate Change Impact on Global Economy',
        'Content' => 'Climate change is having a profound impact on the global economy. Rising temperatures, extreme weather events, and sea level rise are causing significant economic losses worldwide. Governments and businesses are increasingly recognizing the need for sustainable practices and green investments.',
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
        'Content' => 'Artificial intelligence and machine learning are transforming healthcare delivery. Medical professionals can now diagnose diseases more accurately using AI-powered tools. Telemedicine has become mainstream, allowing patients to receive care remotely.',
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
        'Content' => 'Farmers worldwide are adopting sustainable agriculture practices to protect the environment. Organic farming, crop rotation, and reduced pesticide use are becoming more common. These methods help preserve soil health and biodiversity.',
        'Summary' => 'Farmers adopt eco-friendly methods like organic farming and crop rotation for better sustainability.',
        'SourceName' => 'Reuters',
        'SourceURL' => 'https://www.reuters.com',
        'LanguageName' => 'English',
        'Category' => 'Agriculture',
        'DifficultyLevel' => 'Intermediate',
        'ReadingTime' => 3,
        'WordCount' => 72,
        'PublishedAt' => '2024-01-13 09:15:00'
    ]
];

echo json_encode([
    'success' => true,
    'data' => $articles,
    'total' => count($articles)
], JSON_UNESCAPED_UNICODE);
?>
