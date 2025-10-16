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

// Helper function to send JSON response
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
$path = str_replace('/news_api.php', '', $path);

// Route handling
switch ($path) {
    case '/api/news/articles':
        if ($method === 'GET') {
            handleGetArticles($pdo);
        } elseif ($method === 'POST') {
            handleCreateArticle($pdo);
        }
        break;
        
    case '/api/news/articles/':
        if ($method === 'GET') {
            handleGetArticles($pdo);
        } elseif ($method === 'POST') {
            handleCreateArticle($pdo);
        }
        break;
        
    case '/api/news/articles/{id}':
        if ($method === 'GET') {
            handleGetArticle($pdo);
        } elseif ($method === 'PUT') {
            handleUpdateArticle($pdo);
        } elseif ($method === 'DELETE') {
            handleDeleteArticle($pdo);
        }
        break;
        
    case '/api/news/translate':
        if ($method === 'POST') {
            handleTranslateWord($pdo);
        }
        break;
        
    case '/api/news/lookup':
        if ($method === 'POST') {
            handleWordLookup($pdo);
        }
        break;
        
    case '/api/news/history':
        if ($method === 'GET') {
            handleGetReadingHistory($pdo);
        } elseif ($method === 'POST') {
            handleSaveReadingHistory($pdo);
        }
        break;
        
    case '/api/news/bookmarks':
        if ($method === 'GET') {
            handleGetBookmarks($pdo);
        } elseif ($method === 'POST') {
            handleAddBookmark($pdo);
        } elseif ($method === 'DELETE') {
            handleRemoveBookmark($pdo);
        }
        break;
        
    case '/api/news/favorites':
        if ($method === 'GET') {
            handleGetFavorites($pdo);
        } elseif ($method === 'POST') {
            handleAddFavorite($pdo);
        } elseif ($method === 'DELETE') {
            handleRemoveFavorite($pdo);
        }
        break;
        
    default:
        sendResponse(['error' => 'Endpoint not found'], 404);
}

// Get articles with filters
function handleGetArticles($pdo) {
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

// Get single article with vocabulary
function handleGetArticle($pdo) {
    $articleId = $_GET['id'] ?? null;
    if (!$articleId) {
        sendResponse(['error' => 'Article ID required'], 400);
    }
    
    try {
        // Get article details
        $stmt = $pdo->prepare("
            SELECT a.*, s.SourceName, s.SourceURL, l.LanguageName 
            FROM NewsArticles a 
            JOIN NewsSources s ON a.SourceID = s.SourceID 
            JOIN Languages l ON a.LanguageID = l.LanguageID 
            WHERE a.ArticleID = ? AND a.IsActive = 1
        ");
        $stmt->execute([$articleId]);
        $article = $stmt->fetch();
        
        if (!$article) {
            sendResponse(['error' => 'Article not found'], 404);
        }
        
        // Get vocabulary for this article
        $stmt = $pdo->prepare("
            SELECT av.*, vt.Translation, vt.Pronunciation, vt.PartOfSpeech, vt.ExampleSentence,
                   lt.LanguageName as TargetLanguageName
            FROM ArticleVocabulary av
            LEFT JOIN VocabularyTranslations vt ON av.ArticleVocabID = vt.ArticleVocabID
            LEFT JOIN Languages lt ON vt.TargetLanguageID = lt.LanguageID
            WHERE av.ArticleID = ?
            ORDER BY av.Position
        ");
        $stmt->execute([$articleId]);
        $vocabulary = $stmt->fetchAll();
        
        sendResponse([
            'success' => true,
            'data' => [
                'article' => $article,
                'vocabulary' => $vocabulary
            ]
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to fetch article: ' . $e->getMessage()], 500);
    }
}

// Translate word
function handleTranslateWord($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $word = $input['word'] ?? '';
    $targetLanguageId = $input['target_language_id'] ?? 2;
    $articleId = $input['article_id'] ?? null;
    
    if (!$word) {
        sendResponse(['error' => 'Word required'], 400);
    }
    
    try {
        // First check if translation exists
        $sql = "SELECT vt.*, lt.LanguageName as TargetLanguageName
                FROM VocabularyTranslations vt
                JOIN Languages lt ON vt.TargetLanguageID = lt.LanguageID
                WHERE vt.Translation LIKE ? AND vt.TargetLanguageID = ?";
        
        if ($articleId) {
            $sql .= " AND vt.ArticleVocabID IN (SELECT ArticleVocabID FROM ArticleVocabulary WHERE ArticleID = ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(["%$word%", $targetLanguageId, $articleId]);
        } else {
            $stmt = $pdo->prepare($sql);
            $stmt->execute(["%$word%", $targetLanguageId]);
        }
        
        $translations = $stmt->fetchAll();
        
        if (empty($translations)) {
            // If no translation found, try to find similar words
            $sql = "SELECT av.Word, vt.Translation, vt.Pronunciation, vt.PartOfSpeech, vt.ExampleSentence
                    FROM ArticleVocabulary av
                    JOIN VocabularyTranslations vt ON av.ArticleVocabID = vt.ArticleVocabID
                    WHERE av.Word LIKE ? AND vt.TargetLanguageID = ?";
            
            if ($articleId) {
                $sql .= " AND av.ArticleID = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute(["%$word%", $targetLanguageId, $articleId]);
            } else {
                $stmt = $pdo->prepare($sql);
                $stmt->execute(["%$word%", $targetLanguageId]);
            }
            
            $similar = $stmt->fetchAll();
            
            sendResponse([
                'success' => true,
                'data' => [
                    'word' => $word,
                    'translations' => [],
                    'similar_words' => $similar,
                    'message' => 'No direct translation found'
                ]
            ]);
        } else {
            sendResponse([
                'success' => true,
                'data' => [
                    'word' => $word,
                    'translations' => $translations
                ]
            ]);
        }
    } catch (PDOException $e) {
        sendResponse(['error' => 'Translation failed: ' . $e->getMessage()], 500);
    }
}

// Word lookup with context
function handleWordLookup($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $word = $input['word'] ?? '';
    $articleId = $input['article_id'] ?? null;
    $userId = $input['user_id'] ?? null;
    
    if (!$word) {
        sendResponse(['error' => 'Word required'], 400);
    }
    
    try {
        // Get word context from article
        $sql = "SELECT av.*, vt.Translation, vt.Pronunciation, vt.PartOfSpeech, vt.ExampleSentence,
                       lt.LanguageName as TargetLanguageName
                FROM ArticleVocabulary av
                LEFT JOIN VocabularyTranslations vt ON av.ArticleVocabID = vt.ArticleVocabID
                LEFT JOIN Languages lt ON vt.TargetLanguageID = lt.LanguageID
                WHERE av.Word = ?";
        
        if ($articleId) {
            $sql .= " AND av.ArticleID = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$word, $articleId]);
        } else {
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$word]);
        }
        
        $results = $stmt->fetchAll();
        
        // Save lookup history
        if ($userId && $articleId) {
            $stmt = $pdo->prepare("
                INSERT INTO UserLookupHistory (UserID, ArticleID, Word, Translation, LookupCount) 
                VALUES (?, ?, ?, ?, 1)
                ON DUPLICATE KEY UPDATE 
                LookupCount = LookupCount + 1,
                LastLookedAt = CURRENT_TIMESTAMP
            ");
            
            foreach ($results as $result) {
                $stmt->execute([
                    $userId, 
                    $articleId, 
                    $word, 
                    $result['Translation'] ?? ''
                ]);
            }
        }
        
        sendResponse([
            'success' => true,
            'data' => [
                'word' => $word,
                'results' => $results
            ]
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Lookup failed: ' . $e->getMessage()], 500);
    }
}

// Get reading history
function handleGetReadingHistory($pdo) {
    $userId = $_GET['user_id'] ?? null;
    $languageId = $_GET['language_id'] ?? 1;
    $limit = $_GET['limit'] ?? 10;
    
    $sql = "SELECT rh.*, a.Title, a.Summary, s.SourceName, l.LanguageName
            FROM ReadingHistory rh
            JOIN NewsArticles a ON rh.ArticleID = a.ArticleID
            JOIN NewsSources s ON a.SourceID = s.SourceID
            JOIN Languages l ON rh.LanguageID = l.LanguageID
            WHERE rh.LanguageID = ?";
    
    $params = [$languageId];
    
    if ($userId) {
        $sql .= " AND rh.UserID = ?";
        $params[] = $userId;
    }
    
    $sql .= " ORDER BY rh.CreatedAt DESC LIMIT ?";
    $params[] = $limit;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $history = $stmt->fetchAll();
        
        sendResponse([
            'success' => true,
            'data' => $history
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to fetch reading history: ' . $e->getMessage()], 500);
    }
}

// Save reading history
function handleSaveReadingHistory($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['user_id'] ?? null;
    $articleId = $input['article_id'] ?? null;
    $languageId = $input['language_id'] ?? 1;
    $progress = $input['progress'] ?? 0;
    $timeSpent = $input['time_spent'] ?? 0;
    $wordsLookedUp = $input['words_looked_up'] ?? 0;
    $completed = $input['completed'] ?? false;
    
    if (!$articleId) {
        sendResponse(['error' => 'Article ID required'], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO ReadingHistory (UserID, ArticleID, LanguageID, ReadingProgress, TimeSpent, WordsLookedUp, CompletedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            ReadingProgress = VALUES(ReadingProgress),
            TimeSpent = VALUES(TimeSpent),
            WordsLookedUp = VALUES(WordsLookedUp),
            CompletedAt = VALUES(CompletedAt)
        ");
        
        $completedAt = $completed ? date('Y-m-d H:i:s') : null;
        $stmt->execute([$userId, $articleId, $languageId, $progress, $timeSpent, $wordsLookedUp, $completedAt]);
        
        sendResponse([
            'success' => true,
            'message' => 'Reading history saved'
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to save reading history: ' . $e->getMessage()], 500);
    }
}

// Get bookmarks
function handleGetBookmarks($pdo) {
    $userId = $_GET['user_id'] ?? null;
    $languageId = $_GET['language_id'] ?? 1;
    
    $sql = "SELECT b.*, a.Title, a.Summary, a.Category, a.DifficultyLevel, s.SourceName, l.LanguageName
            FROM ArticleBookmarks b
            JOIN NewsArticles a ON b.ArticleID = a.ArticleID
            JOIN NewsSources s ON a.SourceID = s.SourceID
            JOIN Languages l ON a.LanguageID = l.LanguageID
            WHERE a.LanguageID = ?";
    
    $params = [$languageId];
    
    if ($userId) {
        $sql .= " AND b.UserID = ?";
        $params[] = $userId;
    }
    
    $sql .= " ORDER BY b.CreatedAt DESC";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $bookmarks = $stmt->fetchAll();
        
        sendResponse([
            'success' => true,
            'data' => $bookmarks
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to fetch bookmarks: ' . $e->getMessage()], 500);
    }
}

// Add bookmark
function handleAddBookmark($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['user_id'] ?? null;
    $articleId = $input['article_id'] ?? null;
    $notes = $input['notes'] ?? '';
    
    if (!$articleId) {
        sendResponse(['error' => 'Article ID required'], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO ArticleBookmarks (UserID, ArticleID, Notes)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE Notes = VALUES(Notes)
        ");
        $stmt->execute([$userId, $articleId, $notes]);
        
        sendResponse([
            'success' => true,
            'message' => 'Bookmark added'
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to add bookmark: ' . $e->getMessage()], 500);
    }
}

// Remove bookmark
function handleRemoveBookmark($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['user_id'] ?? null;
    $articleId = $input['article_id'] ?? null;
    
    if (!$articleId) {
        sendResponse(['error' => 'Article ID required'], 400);
    }
    
    try {
        $sql = "DELETE FROM ArticleBookmarks WHERE ArticleID = ?";
        $params = [$articleId];
        
        if ($userId) {
            $sql .= " AND UserID = ?";
            $params[] = $userId;
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        sendResponse([
            'success' => true,
            'message' => 'Bookmark removed'
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to remove bookmark: ' . $e->getMessage()], 500);
    }
}

// Get favorite words
function handleGetFavorites($pdo) {
    $userId = $_GET['user_id'] ?? null;
    $languageId = $_GET['language_id'] ?? 1;
    
    $sql = "SELECT f.*, l.LanguageName
            FROM FavoriteWords f
            JOIN Languages l ON f.LanguageID = l.LanguageID
            WHERE f.LanguageID = ?";
    
    $params = [$languageId];
    
    if ($userId) {
        $sql .= " AND f.UserID = ?";
        $params[] = $userId;
    }
    
    $sql .= " ORDER BY f.CreatedAt DESC";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $favorites = $stmt->fetchAll();
        
        sendResponse([
            'success' => true,
            'data' => $favorites
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to fetch favorites: ' . $e->getMessage()], 500);
    }
}

// Add favorite word
function handleAddFavorite($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['user_id'] ?? null;
    $word = $input['word'] ?? '';
    $translation = $input['translation'] ?? '';
    $languageId = $input['language_id'] ?? 1;
    $notes = $input['notes'] ?? '';
    
    if (!$word || !$translation) {
        sendResponse(['error' => 'Word and translation required'], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO FavoriteWords (UserID, Word, Translation, LanguageID, Notes)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            Translation = VALUES(Translation),
            Notes = VALUES(Notes)
        ");
        $stmt->execute([$userId, $word, $translation, $languageId, $notes]);
        
        sendResponse([
            'success' => true,
            'message' => 'Word added to favorites'
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to add favorite: ' . $e->getMessage()], 500);
    }
}

// Remove favorite word
function handleRemoveFavorite($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['user_id'] ?? null;
    $favoriteId = $input['favorite_id'] ?? null;
    
    if (!$favoriteId) {
        sendResponse(['error' => 'Favorite ID required'], 400);
    }
    
    try {
        $sql = "DELETE FROM FavoriteWords WHERE FavoriteID = ?";
        $params = [$favoriteId];
        
        if ($userId) {
            $sql .= " AND UserID = ?";
            $params[] = $userId;
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        sendResponse([
            'success' => true,
            'message' => 'Favorite removed'
        ]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to remove favorite: ' . $e->getMessage()], 500);
    }
}
?>
