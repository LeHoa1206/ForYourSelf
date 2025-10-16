<?php
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

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
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
$path = str_replace('/simple_news_api.php', '', $path);

// Helper function to send JSON response
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Route handling
if ($path === '/api/news/articles' || $path === '/api/news/articles/') {
    if ($method === 'GET') {
        // Get articles with filters
        $languageId = $_GET['language_id'] ?? 1;
        $category = $_GET['category'] ?? '';
        $difficulty = $_GET['difficulty'] ?? '';
        $limit = $_GET['limit'] ?? 10;
        $offset = $_GET['offset'] ?? 0;
        
        $sql = "SELECT a.*, s.SourceName, s.SourceURL, l.LanguageName 
                FROM NewsArticles a 
                JOIN NewsSources s ON a.SourceID = s.SourceID 
                JOIN Languages l ON a.LanguageID = l.LanguageID 
                WHERE a.IsActive = 1 AND a.LanguageID = ?";
        
        $params = [$languageId];
        
        if ($category) {
            $sql .= " AND a.Category = ?";
            $params[] = $category;
        }
        
        if ($difficulty) {
            $sql .= " AND a.DifficultyLevel = ?";
            $params[] = $difficulty;
        }
        
        $sql .= " ORDER BY a.CreatedAt DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $articles = $stmt->fetchAll();
            
            sendResponse([
                'success' => true,
                'data' => $articles,
                'total' => count($articles)
            ]);
        } catch (PDOException $e) {
            sendResponse(['error' => 'Failed to fetch articles: ' . $e->getMessage()], 500);
        }
    }
} else {
    sendResponse(['error' => 'Endpoint not found'], 404);
}
?>
