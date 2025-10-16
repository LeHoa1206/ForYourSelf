<?php
// News Admin API - Quản lý bài báo
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set UTF-8 encoding
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

// Database connection
try {
    $pdo = new PDO(
        'mysql:host=mysql;dbname=vip_english_learning;charset=utf8mb4',
        'vip_user',
        'vip_password',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit();
}

// Helper function to send response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/news_admin_api.php', '', $path);

// Route handling
switch ($path) {
    case '/api/news/articles':
        if ($method === 'GET') {
            // Get all articles with source and language info
            try {
                $stmt = $pdo->prepare("
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
                        na.PublishedAt,
                        na.CreatedAt,
                        na.UpdatedAt,
                        ns.SourceName,
                        l.LanguageName,
                        l.LanguageCode
                    FROM NewsArticles na
                    LEFT JOIN NewsSources ns ON na.SourceID = ns.SourceID
                    LEFT JOIN Languages l ON na.LanguageID = l.LanguageID
                    ORDER BY na.CreatedAt DESC
                ");
                $stmt->execute();
                $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                sendResponse([
                    'success' => true,
                    'data' => $articles
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to fetch articles: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/sources':
        if ($method === 'GET') {
            // Get all news sources
            try {
                $stmt = $pdo->prepare("SELECT * FROM NewsSources ORDER BY SourceName");
                $stmt->execute();
                $sources = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                sendResponse([
                    'success' => true,
                    'data' => $sources
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to fetch sources: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/languages':
        if ($method === 'GET') {
            // Get all languages
            try {
                $stmt = $pdo->prepare("SELECT * FROM Languages WHERE IsActive = 1 ORDER BY LanguageName");
                $stmt->execute();
                $languages = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                sendResponse([
                    'success' => true,
                    'data' => $languages
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to fetch languages: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/articles/create':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO NewsArticles 
                    (Title, Content, Summary, SourceID, LanguageID, Category, DifficultyLevel, ReadingTime, WordCount, IsActive, PublishedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $input['Title'],
                    $input['Content'],
                    $input['Summary'] ?? null,
                    $input['SourceID'],
                    $input['LanguageID'],
                    $input['Category'] ?? null,
                    $input['DifficultyLevel'] ?? 'Intermediate',
                    $input['ReadingTime'] ?? null,
                    $input['WordCount'] ?? null,
                    $input['IsActive'] ?? 1,
                    $input['PublishedAt'] ?? null
                ]);
                
                $articleId = $pdo->lastInsertId();
                
                sendResponse([
                    'success' => true,
                    'message' => 'Article created successfully',
                    'data' => ['ArticleID' => $articleId]
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to create article: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/articles/update':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $pdo->prepare("
                    UPDATE NewsArticles SET
                    Title = ?, Content = ?, Summary = ?, SourceID = ?, LanguageID = ?, 
                    Category = ?, DifficultyLevel = ?, ReadingTime = ?, WordCount = ?, 
                    IsActive = ?, PublishedAt = ?
                    WHERE ArticleID = ?
                ");
                
                $stmt->execute([
                    $input['Title'],
                    $input['Content'],
                    $input['Summary'] ?? null,
                    $input['SourceID'],
                    $input['LanguageID'],
                    $input['Category'] ?? null,
                    $input['DifficultyLevel'] ?? 'Intermediate',
                    $input['ReadingTime'] ?? null,
                    $input['WordCount'] ?? null,
                    $input['IsActive'] ?? 1,
                    $input['PublishedAt'] ?? null,
                    $input['ArticleID']
                ]);
                
                sendResponse([
                    'success' => true,
                    'message' => 'Article updated successfully'
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to update article: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/articles/delete':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $pdo->prepare("DELETE FROM NewsArticles WHERE ArticleID = ?");
                $stmt->execute([$input['ArticleID']]);
                
                sendResponse([
                    'success' => true,
                    'message' => 'Article deleted successfully'
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to delete article: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/sources/create':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO NewsSources (SourceName, SourceURL, LanguageID, Category, IsActive)
                    VALUES (?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $input['SourceName'],
                    $input['SourceURL'] ?? null,
                    $input['LanguageID'] ?? 1,
                    $input['Category'] ?? null,
                    $input['IsActive'] ?? 1
                ]);
                
                $sourceId = $pdo->lastInsertId();
                
                sendResponse([
                    'success' => true,
                    'message' => 'Source created successfully',
                    'data' => ['SourceID' => $sourceId]
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to create source: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/sources/update':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $pdo->prepare("
                    UPDATE NewsSources SET
                    SourceName = ?, SourceURL = ?, LanguageID = ?, Category = ?, IsActive = ?
                    WHERE SourceID = ?
                ");
                
                $stmt->execute([
                    $input['SourceName'],
                    $input['SourceURL'] ?? null,
                    $input['LanguageID'] ?? 1,
                    $input['Category'] ?? null,
                    $input['IsActive'] ?? 1,
                    $input['SourceID']
                ]);
                
                sendResponse([
                    'success' => true,
                    'message' => 'Source updated successfully'
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to update source: ' . $e->getMessage()], 500);
            }
        }
        break;

    case '/api/news/sources/delete':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $pdo->prepare("DELETE FROM NewsSources WHERE SourceID = ?");
                $stmt->execute([$input['SourceID']]);
                
                sendResponse([
                    'success' => true,
                    'message' => 'Source deleted successfully'
                ]);
            } catch (PDOException $e) {
                sendResponse(['success' => false, 'error' => 'Failed to delete source: ' . $e->getMessage()], 500);
            }
        }
        break;

    default:
        sendResponse(['success' => false, 'error' => 'Endpoint not found'], 404);
        break;
}
?>
