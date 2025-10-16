<?php
// Test encoding
header('Content-Type: text/html; charset=utf-8');

$host = 'mysql';
$dbname = 'vip_english_learning';
$username = 'vip_user';
$password = 'vip_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Force UTF-8 encoding
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("SET CHARACTER SET utf8mb4");
    $pdo->exec("SET character_set_client = utf8mb4");
    $pdo->exec("SET character_set_connection = utf8mb4");
    $pdo->exec("SET character_set_results = utf8mb4");
    
    $stmt = $pdo->prepare("SELECT TopicID, Title, Description FROM Topics WHERE LanguageID = 1 ORDER BY TopicID LIMIT 3");
    $stmt->execute();
    $results = $stmt->fetchAll();
    
    echo "<h2>Raw Database Results:</h2>\n";
    foreach ($results as $row) {
        echo "ID: {$row['TopicID']} | Title: " . htmlspecialchars($row['Title']) . " | Description: " . htmlspecialchars($row['Description']) . "<br>\n";
    }
    
    echo "<h2>JSON Response:</h2>\n";
    echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>