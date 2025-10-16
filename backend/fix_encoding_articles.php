<?php
// Fix encoding issues in NewsArticles
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
    
    // Update articles with proper encoding
    $articles = [
        [
            'id' => 1,
            'title' => 'Lễ Hội',
            'content' => 'Lễ hội là một sự kiện văn hóa quan trọng trong cộng đồng. Nó mang lại niềm vui và sự gắn kết giữa mọi người.',
            'summary' => 'Lễ hội mang lại niềm vui và sự gắn kết cộng đồng.'
        ],
        [
            'id' => 9,
            'title' => 'Thể thao bóng đá',
            'content' => 'Bóng đá là môn thể thao phổ biến nhất thế giới. Nó thu hút hàng triệu người hâm mộ trên toàn cầu.',
            'summary' => 'Bóng đá là môn thể thao phổ biến nhất thế giới.'
        ]
    ];
    
    $stmt = $pdo->prepare("UPDATE NewsArticles SET Title = ?, Content = ?, Summary = ? WHERE ArticleID = ?");
    
    foreach ($articles as $article) {
        $stmt->execute([
            $article['title'],
            $article['content'],
            $article['summary'],
            $article['id']
        ]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Encoding fixed for articles',
        'updated_articles' => count($articles)
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
