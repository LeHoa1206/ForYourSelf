<?php
// Insert sample news data for testing
header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO(
        'mysql:host=mysql;dbname=vip_english_learning;charset=utf8mb4',
        'vip_user',
        'vip_password',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );

    // Insert sample news sources
    $sources = [
        [
            'SourceName' => 'BBC News',
            'SourceURL' => 'https://www.bbc.com/news',
            'LanguageID' => 1,
            'Category' => 'International',
            'IsActive' => 1
        ],
        [
            'SourceName' => 'CNN',
            'SourceURL' => 'https://www.cnn.com',
            'LanguageID' => 1,
            'Category' => 'International',
            'IsActive' => 1
        ],
        [
            'SourceName' => 'Reuters',
            'SourceURL' => 'https://www.reuters.com',
            'LanguageID' => 1,
            'Category' => 'International',
            'IsActive' => 1
        ],
        [
            'SourceName' => 'The Guardian',
            'SourceURL' => 'https://www.theguardian.com',
            'LanguageID' => 1,
            'Category' => 'International',
            'IsActive' => 1
        ],
        [
            'SourceName' => 'VnExpress',
            'SourceURL' => 'https://vnexpress.net',
            'LanguageID' => 2,
            'Category' => 'Local',
            'IsActive' => 1
        ]
    ];

    $stmt = $pdo->prepare("
        INSERT INTO NewsSources (SourceName, SourceURL, LanguageID, Category, IsActive) 
        VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($sources as $source) {
        $stmt->execute([
            $source['SourceName'],
            $source['SourceURL'],
            $source['LanguageID'],
            $source['Category'],
            $source['IsActive']
        ]);
    }

    // Get the inserted source IDs
    $sourceIds = $pdo->query("SELECT SourceID FROM NewsSources ORDER BY SourceID DESC LIMIT 5")->fetchAll(PDO::FETCH_COLUMN);
    
    // Get language IDs
    $languageIds = $pdo->query("SELECT LanguageID FROM Languages LIMIT 3")->fetchAll(PDO::FETCH_COLUMN);

    // Insert sample news articles
    $articles = [
        [
            'Title' => 'Technology Revolution: AI Changes Everything',
            'Content' => 'Artificial intelligence is transforming industries across the globe. From healthcare to finance, AI is revolutionizing how we work and live. Machine learning algorithms are becoming more sophisticated, enabling computers to perform tasks that were once thought impossible. Companies are investing billions in AI research and development, creating new opportunities for innovation and growth.',
            'Summary' => 'AI is revolutionizing industries worldwide with advanced machine learning capabilities.',
            'SourceID' => $sourceIds[0],
            'LanguageID' => $languageIds[0],
            'Category' => 'Technology',
            'DifficultyLevel' => 'Intermediate',
            'ReadingTime' => 5,
            'WordCount' => 85,
            'IsActive' => 1
        ],
        [
            'Title' => 'Climate Change: Global Action Needed',
            'Content' => 'Climate change represents one of the greatest challenges of our time. Rising global temperatures, melting ice caps, and extreme weather events are clear indicators that immediate action is required. Governments, businesses, and individuals must work together to reduce carbon emissions and transition to renewable energy sources. The future of our planet depends on the decisions we make today.',
            'Summary' => 'Global cooperation is essential to address climate change and protect our planet.',
            'SourceID' => $sourceIds[1],
            'LanguageID' => $languageIds[1],
            'Category' => 'Environment',
            'DifficultyLevel' => 'Advanced',
            'ReadingTime' => 7,
            'WordCount' => 95,
            'IsActive' => 1
        ],
        [
            'Title' => 'Space Exploration: New Discoveries',
            'Content' => 'Recent space missions have revealed fascinating discoveries about our universe. Scientists have found evidence of water on distant planets, opening new possibilities for life beyond Earth. Advanced telescopes and space probes are providing unprecedented insights into the cosmos. These discoveries are expanding our understanding of the universe and inspiring future generations of explorers.',
            'Summary' => 'Space missions reveal new discoveries about water and life possibilities in the universe.',
            'SourceID' => $sourceIds[2],
            'LanguageID' => $languageIds[2],
            'Category' => 'Science',
            'DifficultyLevel' => 'Beginner',
            'ReadingTime' => 4,
            'WordCount' => 75,
            'IsActive' => 1
        ],
        [
            'Title' => 'Economic Growth: Global Markets Rise',
            'Content' => 'Global markets are showing signs of recovery as economies around the world begin to stabilize. Stock markets have reached new highs, and unemployment rates are declining. Consumer confidence is increasing, leading to higher spending and investment. However, challenges remain as countries navigate inflation and supply chain disruptions.',
            'Summary' => 'Global markets recover with rising stocks and declining unemployment rates.',
            'SourceID' => $sourceIds[3],
            'LanguageID' => $languageIds[0],
            'Category' => 'Business',
            'DifficultyLevel' => 'Intermediate',
            'ReadingTime' => 6,
            'WordCount' => 80,
            'IsActive' => 1
        ],
        [
            'Title' => 'Education Technology: Learning Revolution',
            'Content' => 'Educational technology is transforming how students learn and teachers teach. Online platforms, virtual reality, and artificial intelligence are creating new opportunities for personalized learning. Students can now access high-quality education from anywhere in the world. These innovations are making education more accessible and effective for learners of all ages.',
            'Summary' => 'EdTech revolutionizes learning with online platforms, VR, and AI for personalized education.',
            'SourceID' => $sourceIds[4],
            'LanguageID' => $languageIds[1],
            'Category' => 'Education',
            'DifficultyLevel' => 'Beginner',
            'ReadingTime' => 5,
            'WordCount' => 90,
            'IsActive' => 1
        ]
    ];

    $stmt = $pdo->prepare("
        INSERT INTO NewsArticles 
        (Title, Content, Summary, SourceID, LanguageID, Category, DifficultyLevel, ReadingTime, WordCount, IsActive) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    foreach ($articles as $article) {
        $stmt->execute([
            $article['Title'],
            $article['Content'],
            $article['Summary'],
            $article['SourceID'],
            $article['LanguageID'],
            $article['Category'],
            $article['DifficultyLevel'],
            $article['ReadingTime'],
            $article['WordCount'],
            $article['IsActive']
        ]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Sample news data inserted successfully',
        'sources_inserted' => count($sources),
        'articles_inserted' => count($articles)
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
