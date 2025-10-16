<?php
// Import News Reading System Database
// Tạo hệ thống đọc báo với dịch thuật

$host = 'mysql';
$dbname = 'vip_english_learning';
$username = 'vip_user';
$password = 'vip_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    
    echo "✅ Connected to database successfully\n";
    
    // Read and execute the SQL file
    $sql = file_get_contents('/var/www/html/news_reading_system.sql');
    
    // Split by semicolon and execute each statement
    $statements = explode(';', $sql);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement) && !preg_match('/^--/', $statement)) {
            try {
                $pdo->exec($statement);
                echo "✅ Executed: " . substr($statement, 0, 50) . "...\n";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'already exists') === false) {
                    echo "⚠️ Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    
    echo "\n🎉 News Reading System database created successfully!\n";
    echo "📰 Features available:\n";
    echo "   - News articles with multiple languages\n";
    echo "   - Vocabulary extraction and translation\n";
    echo "   - Reading progress tracking\n";
    echo "   - Bookmarks and favorites\n";
    echo "   - Word lookup history\n";
    echo "   - Interactive reading with clickable words\n";
    
    // Test the API
    echo "\n🧪 Testing API endpoints...\n";
    
    // Test articles endpoint
    $response = file_get_contents('http://localhost:8000/news_api.php/api/news/articles?language_id=1&limit=5');
    $data = json_decode($response, true);
    
    if ($data && $data['success']) {
        echo "✅ Articles API working - Found " . count($data['data']) . " articles\n";
    } else {
        echo "❌ Articles API failed\n";
    }
    
    echo "\n🚀 Ready to use News Reading System!\n";
    echo "   Access at: http://localhost:3000/vocabulary-learning\n";
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "Make sure Docker containers are running:\n";
    echo "   docker-compose up -d\n";
}
?>
