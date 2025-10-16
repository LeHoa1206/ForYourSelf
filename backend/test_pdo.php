<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

echo "Testing PDO step by step...\n";

try {
    echo "Step 1: Basic PDO connection\n";
    $pdo = new PDO("mysql:host=mysql;dbname=vip_english_learning", "vip_user", "vip_password");
    echo "✅ PDO connection successful\n";
    
    echo "Step 2: Simple query\n";
    $result = $pdo->query("SELECT COUNT(*) as count FROM NewsArticles");
    $data = $result->fetch();
    echo "✅ Query successful, count: " . $data['count'] . "\n";
    
    echo "Step 3: Articles query\n";
    $stmt = $pdo->prepare("SELECT * FROM NewsArticles LIMIT 1");
    $stmt->execute();
    $article = $stmt->fetch();
    
    if ($article) {
        echo "✅ Article found: " . $article['Title'] . "\n";
        echo json_encode(['success' => true, 'data' => $article], JSON_UNESCAPED_UNICODE);
    } else {
        echo "❌ No article found\n";
        echo json_encode(['success' => false, 'error' => 'No article found'], JSON_UNESCAPED_UNICODE);
    }
    
} catch (PDOException $e) {
    echo "❌ PDO Error: " . $e->getMessage() . "\n";
    echo json_encode(['error' => 'PDO error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo "❌ General Error: " . $e->getMessage() . "\n";
    echo json_encode(['error' => 'General error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
