<?php
header('Content-Type: application/json; charset=utf-8');

// Database connection
$host = 'mysql';
$dbname = 'vip_english_learning';
$username = 'vip_user';
$password = 'vip_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    
    // Get articles
    $languageId = $_GET['language_id'] ?? 1;
    $limit = $_GET['limit'] ?? 10;
    
    $sql = "SELECT a.*, s.SourceName, s.SourceURL, l.LanguageName 
            FROM NewsArticles a 
            JOIN NewsSources s ON a.SourceID = s.SourceID 
            JOIN Languages l ON a.LanguageID = l.LanguageID 
            WHERE a.IsActive = 1 AND a.LanguageID = ?
            ORDER BY a.CreatedAt DESC 
            LIMIT ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$languageId, $limit]);
    $articles = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $articles,
        'total' => count($articles)
    ], JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
