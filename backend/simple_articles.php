<?php
// Set UTF-8 encoding
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Get database credentials from environment variables
    $host = $_ENV['DB_HOST'] ?? 'localhost';
    $dbname = $_ENV['DB_NAME'] ?? 'vip_english_learning';
    $username = $_ENV['DB_USER'] ?? 'vip_user';
    $password = $_ENV['DB_PASSWORD'] ?? 'vip_password';
    
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4", 
        $username, 
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    $stmt = $pdo->query("
        SELECT 
            na.ArticleID,
            na.Title,
            na.Content,
            na.Summary,
            na.Category,
            na.DifficultyLevel,
            na.ReadingTime,
            na.WordCount,
            na.IsActive,
            na.CreatedAt,
            ns.SourceName,
            l.LanguageName
        FROM NewsArticles na
        LEFT JOIN NewsSources ns ON na.SourceID = ns.SourceID
        LEFT JOIN Languages l ON na.LanguageID = l.LanguageID
        ORDER BY na.CreatedAt DESC
    ");
    $articles = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $articles,
        'total' => count($articles)
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
