<?php
// Test script to check articles count and encoding
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $pdo = new PDO(
        "mysql:host=mysql;dbname=vip_english_learning;charset=utf8mb4", 
        "vip_user", 
        "vip_password",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    // Count total articles
    $countStmt = $pdo->query("SELECT COUNT(*) as total FROM NewsArticles");
    $totalCount = $countStmt->fetch()['total'];
    
    // Get all articles with basic info
    $stmt = $pdo->query("
        SELECT 
            ArticleID,
            Title,
            SourceID,
            LanguageID,
            CreatedAt
        FROM NewsArticles 
        ORDER BY CreatedAt DESC
    ");
    $articles = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'total_count' => $totalCount,
        'articles_returned' => count($articles),
        'articles' => $articles
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
