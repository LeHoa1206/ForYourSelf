<?php
// Add more articles with proper encoding
header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO(
        "mysql:host=mysql;dbname=vip_english_learning;charset=utf8mb4", 
        "vip_user", 
        "vip_password",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    // Add more sample articles
    $newArticles = [
        [
            'Title' => 'Artificial Intelligence in Healthcare',
            'Content' => 'Artificial intelligence is revolutionizing healthcare by improving diagnosis accuracy, personalizing treatment plans, and accelerating drug discovery. Machine learning algorithms can analyze medical images faster than human doctors, while AI-powered chatbots provide 24/7 patient support.',
            'Summary' => 'AI is transforming healthcare through improved diagnosis and personalized treatment.',
            'SourceID' => 1,
            'LanguageID' => 1,
            'Category' => 'Technology',
            'DifficultyLevel' => 'Intermediate',
            'ReadingTime' => 6,
            'WordCount' => 95
        ],
        [
            'Title' => 'Renewable Energy Revolution',
            'Content' => 'The world is experiencing a renewable energy revolution as solar and wind power become increasingly cost-effective. Countries are setting ambitious targets to achieve net-zero emissions, investing billions in clean energy infrastructure.',
            'Summary' => 'Solar and wind power are becoming more affordable and widespread globally.',
            'SourceID' => 2,
            'LanguageID' => 1,
            'Category' => 'Environment',
            'DifficultyLevel' => 'Beginner',
            'ReadingTime' => 4,
            'WordCount' => 65
        ],
        [
            'Title' => 'Space Tourism Takes Off',
            'Content' => 'Commercial space tourism is becoming a reality as private companies like SpaceX and Blue Origin make space travel accessible to civilians. Tickets cost hundreds of thousands of dollars, but prices are expected to decrease as technology improves.',
            'Summary' => 'Private companies are making space travel available to civilians.',
            'SourceID' => 3,
            'LanguageID' => 1,
            'Category' => 'Science',
            'DifficultyLevel' => 'Advanced',
            'ReadingTime' => 5,
            'WordCount' => 75
        ],
        [
            'Title' => 'Digital Currency Adoption',
            'Content' => 'Central banks worldwide are exploring digital currencies as cash usage declines. China has already launched a digital yuan, while the European Central Bank is developing a digital euro. These digital currencies could transform how we make payments.',
            'Summary' => 'Central banks are developing digital currencies to replace traditional cash.',
            'SourceID' => 4,
            'LanguageID' => 1,
            'Category' => 'Finance',
            'DifficultyLevel' => 'Intermediate',
            'ReadingTime' => 5,
            'WordCount' => 70
        ]
    ];
    
    $stmt = $pdo->prepare("
        INSERT INTO NewsArticles 
        (Title, Content, Summary, SourceID, LanguageID, Category, DifficultyLevel, ReadingTime, WordCount, IsActive) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $inserted = 0;
    foreach ($newArticles as $article) {
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
            1
        ]);
        $inserted++;
    }
    
    // Get total count
    $countStmt = $pdo->query("SELECT COUNT(*) as total FROM NewsArticles");
    $totalCount = $countStmt->fetch()['total'];
    
    echo json_encode([
        'success' => true,
        'message' => 'New articles added successfully',
        'articles_added' => $inserted,
        'total_articles' => $totalCount
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
