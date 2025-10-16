<?php
header('Content-Type: application/json; charset=utf-8');

echo "Testing simple API...\n";

// Test database connection
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
    
    echo "✅ Database connected\n";
    
    // Simple query
    $stmt = $pdo->prepare("SELECT * FROM NewsArticles LIMIT 1");
    $stmt->execute();
    $article = $stmt->fetch();
    
    if ($article) {
        echo "✅ Found article: " . $article['Title'] . "\n";
        echo json_encode(['success' => true, 'data' => $article], JSON_UNESCAPED_UNICODE);
    } else {
        echo "❌ No articles found\n";
        echo json_encode(['success' => false, 'error' => 'No articles found'], JSON_UNESCAPED_UNICODE);
    }
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo "❌ General error: " . $e->getMessage() . "\n";
    echo json_encode(['error' => 'General error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>