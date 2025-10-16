<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

echo "Starting debug...\n";

try {
    echo "1. Testing PDO connection...\n";
    
    $host = 'mysql';
    $dbname = 'vip_english_learning';
    $username = 'vip_user';
    $password = 'vip_password';
    
    echo "2. Creating PDO connection...\n";
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    
    echo "3. Setting PDO attributes...\n";
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    echo "4. Testing simple query...\n";
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM NewsArticles");
    $result = $stmt->fetch();
    
    echo "5. Articles count: " . $result['count'] . "\n";
    
    echo "6. Testing articles query...\n";
    $stmt = $pdo->prepare("SELECT * FROM NewsArticles LIMIT 1");
    $stmt->execute();
    $article = $stmt->fetch();
    
    if ($article) {
        echo "7. Found article: " . $article['Title'] . "\n";
        echo json_encode(['success' => true, 'data' => $article], JSON_UNESCAPED_UNICODE);
    } else {
        echo "7. No articles found\n";
        echo json_encode(['success' => false, 'error' => 'No articles found'], JSON_UNESCAPED_UNICODE);
    }
    
} catch (PDOException $e) {
    echo "PDO Error: " . $e->getMessage() . "\n";
    echo json_encode(['error' => 'PDO error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo "General Error: " . $e->getMessage() . "\n";
    echo json_encode(['error' => 'General error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
