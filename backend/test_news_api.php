<?php
// Test News API
header('Content-Type: application/json; charset=utf-8');

try {
    $host = 'mysql';
    $dbname = 'vip_english_learning';
    $username = 'vip_user';
    $password = 'vip_password';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    
    echo "✅ Database connection successful\n";
    
    // Test query
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM NewsArticles");
    $stmt->execute();
    $result = $stmt->fetch();
    
    echo "📊 Articles count: " . $result['count'] . "\n";
    
    // Test articles query
    $stmt = $pdo->prepare("
        SELECT a.*, s.SourceName, s.SourceURL, l.LanguageName 
        FROM NewsArticles a 
        JOIN NewsSources s ON a.SourceID = s.SourceID 
        JOIN Languages l ON a.LanguageID = l.LanguageID 
        WHERE a.IsActive = 1 AND a.LanguageID = ?
        LIMIT 5
    ");
    $stmt->execute([1]);
    $articles = $stmt->fetchAll();
    
    echo "📰 Found " . count($articles) . " articles\n";
    
    if (!empty($articles)) {
        echo "✅ First article: " . $articles[0]['Title'] . "\n";
    }
    
    echo json_encode([
        'success' => true,
        'data' => $articles,
        'total' => count($articles)
    ], JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo "❌ General error: " . $e->getMessage() . "\n";
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
