<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Test data without database
$testArticles = [
    [
        'ArticleID' => 1,
        'Title' => 'Climate Change Impact on Global Economy',
        'Content' => 'Climate change is having a profound impact on the global economy. Rising temperatures, extreme weather events, and environmental degradation are creating significant challenges for businesses, governments, and communities worldwide. The economic costs of climate change are already substantial and are expected to increase dramatically in the coming decades.',
        'Summary' => 'This article explores how climate change affects the global economy and what can be done to mitigate its impact.',
        'SourceName' => 'Climate News',
        'Category' => 'Environment',
        'DifficultyLevel' => 'Intermediate',
        'ReadingTime' => 5,
        'WordCount' => 150
    ],
    [
        'ArticleID' => 2,
        'Title' => 'Technology Revolution in Healthcare',
        'Content' => 'Artificial intelligence and machine learning are revolutionizing healthcare delivery. From diagnostic tools to treatment recommendations, technology is transforming how medical professionals provide care to patients. These innovations promise to improve outcomes while reducing costs.',
        'Summary' => 'An overview of how AI and technology are changing healthcare for the better.',
        'SourceName' => 'Health Tech',
        'Category' => 'Technology',
        'DifficultyLevel' => 'Advanced',
        'ReadingTime' => 4,
        'WordCount' => 120
    ],
    [
        'ArticleID' => 3,
        'Title' => 'Sustainable Agriculture Practices',
        'Content' => 'Sustainable agriculture is essential for feeding the world\'s growing population while protecting the environment. Farmers are adopting innovative techniques such as precision farming, organic methods, and renewable energy to create more efficient and environmentally friendly food production systems.',
        'Summary' => 'Learn about modern sustainable farming practices that benefit both farmers and the environment.',
        'SourceName' => 'Agri News',
        'Category' => 'Agriculture',
        'DifficultyLevel' => 'Beginner',
        'ReadingTime' => 6,
        'WordCount' => 180
    ]
];

echo json_encode([
    'success' => true,
    'data' => $testArticles,
    'total' => count($testArticles),
    'message' => 'Test articles loaded successfully'
], JSON_UNESCAPED_UNICODE);
?>
