<?php
// Set UTF-8 encoding
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Test endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], 'test') !== false) {
    sendResponse(['message' => 'Test endpoint working!', 'method' => $_SERVER['REQUEST_METHOD'], 'uri' => $_SERVER['REQUEST_URI']]);
}

// NEW IMPORT ENDPOINT - Different approach
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], 'upload') !== false) {
    error_log("NEW UPLOAD ENDPOINT HIT!");
    try {
        if (!isset($_FILES['file'])) {
            sendResponse(['error' => 'No file uploaded'], 400);
        }
        
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            sendResponse(['error' => 'File upload error: ' . $file['error']], 400);
        }
        
        // Simple CSV processing
        $handle = fopen($file['tmp_name'], 'r');
        $imported = 0;
        
        // Skip header
        fgetcsv($handle, 1000, ',');
        
        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
            if (count($data) >= 4) {
                try {
                    $stmt = $pdo->prepare("INSERT INTO Vocabulary (Word, Meaning, TopicID, LanguageID, created_at) VALUES (?, ?, ?, ?, NOW())");
                    $stmt->execute([$data[0], $data[1], $data[3], $data[4]]);
                    $imported++;
                } catch (Exception $e) {
                    error_log("Insert error: " . $e->getMessage());
                }
            }
        }
        
        fclose($handle);
        sendResponse(['message' => "Imported $imported items successfully"]);
        
    } catch (Exception $e) {
        sendResponse(['error' => 'Upload failed: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
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
    
    // Force UTF-8 encoding for all connections
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("SET CHARACTER SET utf8mb4");
    $pdo->exec("SET character_set_client = utf8mb4");
    $pdo->exec("SET character_set_connection = utf8mb4");
    $pdo->exec("SET character_set_results = utf8mb4");
    $pdo->exec("SET collation_connection = utf8mb4_unicode_ci");
    $pdo->exec("SET collation_database = utf8mb4_unicode_ci");
    $pdo->exec("SET collation_server = utf8mb4_unicode_ci");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Helper function to get user from token (simplified)
function getCurrentUser($pdo) {
    // In a real app, you'd validate JWT token here
    // For now, return user ID 2 (John Student) as default
    return 2;
}

// Helper function to send JSON response
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
    exit;
}

// Helper function to get request body
function getRequestBody() {
    return json_decode(file_get_contents('php://input'), true);
}

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Test endpoint for debugging
if ($path === '/api/test') {
    sendResponse([
        'success' => true,
        'message' => 'API is working',
        'data' => [
            'vietnamese' => 'Tiếng Việt',
            'chinese' => '中文',
            'korean' => '한국어',
            'japanese' => '日本語'
        ]
    ]);
}

// Languages endpoint
if ($path === '/api/languages') {
    try {
        $stmt = $pdo->prepare("SELECT LanguageID, LanguageName as Name, NativeName, Flag, LanguageCode as Code FROM Languages WHERE IsActive = 1 ORDER BY SortOrder");
        $stmt->execute();
        $languages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse(['success' => true, 'data' => $languages]);
    } catch (PDOException $e) {
        sendResponse(['success' => false, 'message' => 'Failed to fetch languages: ' . $e->getMessage()], 500);
    }
}

// Topics endpoint with language filter
if ($path === '/api/topics') {
    try {
        $languageId = $_GET['languageId'] ?? null;
        
        if ($languageId) {
            $stmt = $pdo->prepare("SELECT TopicID, Title, Description, Level, Icon, Color, SortOrder, LanguageID FROM Topics WHERE LanguageID = ? ORDER BY SortOrder");
            $stmt->execute([$languageId]);
        } else {
            $stmt = $pdo->prepare("SELECT TopicID, Title, Description, Level, Icon, Color, SortOrder, LanguageID FROM Topics ORDER BY SortOrder");
            $stmt->execute();
        }
        
        $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Count vocabulary for each topic
        foreach ($topics as &$topic) {
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM Vocabulary WHERE TopicID = ? AND LanguageID = ?");
            $stmt->execute([$topic['TopicID'], $topic['LanguageID']]);
            $count = $stmt->fetch(PDO::FETCH_ASSOC);
            $topic['VocabularyCount'] = $count['count'];
        }
        
        sendResponse(['success' => true, 'data' => $topics]);
    } catch (PDOException $e) {
        sendResponse(['success' => false, 'message' => 'Failed to fetch topics: ' . $e->getMessage()], 500);
    }
}

// Study Methods endpoint
if ($path === '/api/study-methods') {
    try {
        $stmt = $pdo->prepare("SELECT MethodID, MethodCode, MethodName, Description, Icon FROM StudyMethods ORDER BY MethodID");
        $stmt->execute();
        $methods = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse(['success' => true, 'data' => $methods]);
    } catch (PDOException $e) {
        sendResponse(['success' => false, 'message' => 'Failed to fetch study methods: ' . $e->getMessage()], 500);
    }
}

// Study Sessions Detailed endpoint
if ($path === '/api/study-sessions-detailed') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("INSERT INTO StudySessionsDetailed (UserID, LanguageID, TopicID, MethodID, StartTime, WordsStudied, CorrectAnswers, TotalAnswers, Score) VALUES (?, ?, ?, ?, ?, 0, 0, 0, 0)");
            $stmt->execute([
                $data['UserID'],
                $data['LanguageID'],
                $data['TopicID'],
                $data['MethodID'],
                $data['StartTime']
            ]);
            
            $sessionId = $pdo->lastInsertId();
            
            $stmt = $pdo->prepare("SELECT * FROM StudySessionsDetailed WHERE SessionID = ?");
            $stmt->execute([$sessionId]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse(['success' => true, 'data' => $session]);
        } catch (PDOException $e) {
            sendResponse(['success' => false, 'message' => 'Failed to create study session: ' . $e->getMessage()], 500);
        }
    }
}

switch ($path) {
    // User endpoints
    case '/api/users/profile':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            $stmt = $pdo->prepare("SELECT UserID, FullName, Email, Role, Avatar, Level, JoinDate, Streak, TotalXP FROM users WHERE UserID = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $user]);
        }
        break;
        
    case '/api/users/statistics':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            $stmt = $pdo->prepare("SELECT * FROM statistics WHERE UserID = ?");
            $stmt->execute([$userId]);
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $stats]);
        }
        break;


    // Vocabulary endpoints
    case '/api/vocabulary':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $topicId = $_GET['topicId'] ?? $_GET['topic_id'] ?? null;
            $languageId = $_GET['languageId'] ?? null;
            $level = $_GET['level'] ?? null;
            
            $query = "SELECT v.*, t.Title as TopicTitle, l.LanguageName as LanguageName FROM Vocabulary v 
                     LEFT JOIN Topics t ON v.TopicID = t.TopicID 
                     LEFT JOIN Languages l ON v.LanguageID = l.LanguageID
                     WHERE 1=1";
            $params = [];
            
            if ($topicId) {
                $query .= " AND v.TopicID = ?";
                $params[] = $topicId;
            }
            
            if ($languageId) {
                $query .= " AND v.LanguageID = ?";
                $params[] = $languageId;
            }
            
            if ($level) {
                $query .= " AND t.Level = ?";
                $params[] = $level;
            }
            
            $query .= " ORDER BY v.Word";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $vocabulary = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $vocabulary]);
        }
        break;

    // Lessons endpoints
    case '/api/lessons':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $type = $_GET['type'] ?? null;
            $level = $_GET['level'] ?? null;
            $topicId = $_GET['topic_id'] ?? null;
            
            $query = "SELECT l.*, t.Title as TopicTitle FROM lessons l 
                     LEFT JOIN topics t ON l.TopicID = t.TopicID 
                     WHERE l.IsActive = 1";
            $params = [];
            
            if ($type) {
                $query .= " AND l.Type = ?";
                $params[] = $type;
            }
            
            if ($level) {
                $query .= " AND l.Level = ?";
                $params[] = $level;
            }
            
            if ($topicId) {
                $query .= " AND l.TopicID = ?";
                $params[] = $topicId;
            }
            
            $query .= " ORDER BY l.Level, l.Title";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $lessons = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $lessons]);
        }
        break;

    case '/api/lessons/detail':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $lessonId = $_GET['lesson_id'] ?? null;
            if (!$lessonId) {
                sendResponse(['success' => false, 'error' => 'Lesson ID required'], 400);
            }
            
            $stmt = $pdo->prepare("SELECT l.*, t.Title as TopicTitle FROM lessons l 
                                 LEFT JOIN topics t ON l.TopicID = t.TopicID 
                                 WHERE l.LessonID = ? AND l.IsActive = 1");
            $stmt->execute([$lessonId]);
            $lesson = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$lesson) {
                sendResponse(['success' => false, 'error' => 'Lesson not found'], 404);
            }
            
            sendResponse(['success' => true, 'data' => $lesson]);
        }
        break;

    // Quizzes endpoints
    case '/api/quizzes':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $type = $_GET['type'] ?? null;
            $level = $_GET['level'] ?? null;
            
            $query = "SELECT * FROM quizzes WHERE IsActive = 1";
            $params = [];
            
            if ($type) {
                $query .= " AND Type = ?";
                $params[] = $type;
            }
            
            if ($level) {
                $query .= " AND Level = ?";
                $params[] = $level;
            }
            
            $query .= " ORDER BY Level, Title";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $quizzes]);
        }
        break;

    case '/api/quizzes/questions':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $quizId = $_GET['quiz_id'] ?? null;
            if (!$quizId) {
                sendResponse(['success' => false, 'error' => 'Quiz ID required'], 400);
            }
            
            $stmt = $pdo->prepare("SELECT * FROM questions WHERE QuizID = ? AND IsActive = 1 ORDER BY QuestionID");
            $stmt->execute([$quizId]);
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $questions]);
        }
        break;

    // Grammar endpoints
    case '/api/grammar':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $level = $_GET['level'] ?? null;
            
            $query = "SELECT * FROM grammarrules WHERE IsActive = 1";
            $params = [];
            
            if ($level) {
                $query .= " AND Level = ?";
                $params[] = $level;
            }
            
            $query .= " ORDER BY Level, Title";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $grammar = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $grammar]);
        }
        break;

    // Conversations endpoints
    case '/api/conversations':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $level = $_GET['level'] ?? null;
            $topicId = $_GET['topic_id'] ?? null;
            
            $query = "SELECT c.*, t.Title as TopicTitle FROM conversations c 
                     LEFT JOIN topics t ON c.TopicID = t.TopicID 
                     WHERE c.IsActive = 1";
            $params = [];
            
            if ($level) {
                $query .= " AND c.Level = ?";
                $params[] = $level;
            }
            
            if ($topicId) {
                $query .= " AND c.TopicID = ?";
                $params[] = $topicId;
            }
            
            $query .= " ORDER BY c.Level, c.Title";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $conversations]);
        }
        break;

    // Flashcards endpoints
    case '/api/flashcards':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            $due = $_GET['due'] ?? false;
            $examType = $_GET['examType'] ?? null;
            $level = $_GET['level'] ?? null;
            $difficulty = $_GET['difficulty'] ?? null;
            
            $query = "SELECT f.*, v.Word, v.Phonetic, v.Type, v.Meaning, v.Example, v.Audio, v.AudioURL, v.Image, 
                            v.ExamType, v.Difficulty, t.Title as TopicTitle 
                     FROM Flashcards f 
                     JOIN Vocabulary v ON f.WordID = v.WordID 
                     LEFT JOIN Topics t ON v.TopicID = t.TopicID 
                     WHERE f.UserID = ?";
            $params = [$userId];
            
            if ($due) {
                $query .= " AND f.NextReview <= NOW()";
            }
            
            if ($examType && $examType !== 'General') {
                $query .= " AND v.ExamType = ?";
                $params[] = $examType;
            }
            
            if ($level) {
                $query .= " AND t.Level = ?";
                $params[] = $level;
            }
            
            if ($difficulty && $difficulty !== 'All') {
                $query .= " AND v.Difficulty = ?";
                $params[] = $difficulty;
            }
            
            $query .= " ORDER BY f.NextReview ASC";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $flashcards = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $flashcards]);
        }
        break;

    // Update flashcard with SM-2 algorithm
    case (preg_match('/^\/api\/flashcards\/(\d+)$/', $path, $matches) ? true : false):
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $flashcardId = $matches[1];
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("UPDATE flashcards SET 
                CorrectCount = ?, 
                WrongCount = ?, 
                NextReview = ?, 
                Interval = ?, 
                Repetitions = ?, 
                EaseFactor = ? 
                WHERE FlashcardID = ? AND UserID = ?");
            
            $userId = getCurrentUser($pdo);
            $stmt->execute([
                $data['CorrectCount'],
                $data['WrongCount'],
                $data['NextReview'],
                $data['Interval'],
                $data['Repetitions'],
                $data['EaseFactor'],
                $flashcardId,
                $userId
            ]);
            
            sendResponse(['success' => true, 'message' => 'Flashcard updated successfully']);
        }
        break;

    // Progress endpoints
    case '/api/progress':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            $type = $_GET['type'] ?? null; // 'lesson' or 'quiz'
            
            $query = "SELECT p.*, l.Title as LessonTitle, q.Title as QuizTitle 
                     FROM userprogress p 
                     LEFT JOIN lessons l ON p.LessonID = l.LessonID 
                     LEFT JOIN quizzes q ON p.QuizID = q.QuizID 
                     WHERE p.UserID = ?";
            $params = [$userId];
            
            if ($type === 'lesson') {
                $query .= " AND p.LessonID IS NOT NULL";
            } elseif ($type === 'quiz') {
                $query .= " AND p.QuizID IS NOT NULL";
            }
            
            $query .= " ORDER BY p.CompletionDate DESC";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $progress = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $progress]);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = getCurrentUser($pdo);
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("INSERT INTO userprogress 
                (UserID, LessonID, QuizID, Score, Completed, CompletionDate, TimeSpent, Attempts) 
                VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)");
            
            $stmt->execute([
                $userId,
                $data['LessonID'] ?? null,
                $data['QuizID'] ?? null,
                $data['Score'],
                $data['Completed'],
                $data['TimeSpent'],
                $data['Attempts'] ?? 1
            ]);
            
            // Update user statistics
            updateUserStatistics($pdo, $userId, $data);
            
            sendResponse(['success' => true, 'message' => 'Progress saved successfully']);
        }
        break;

    // Recommendations endpoints
    case '/api/recommendations':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            $priority = $_GET['priority'] ?? null;
            
            $query = "SELECT * FROM recommendations WHERE UserID = ? AND IsCompleted = 0";
            $params = [$userId];
            
            if ($priority) {
                $query .= " AND Priority = ?";
                $params[] = $priority;
            }
            
            $query .= " ORDER BY Priority DESC, CreatedAt DESC";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $recommendations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $recommendations]);
        }
        break;

    // AI Chat endpoints
    case '/api/ai-chat':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = getCurrentUser($pdo);
            $data = getRequestBody();
            
            // Simulate AI response (in real app, call AI API)
            $aiResponse = generateAIResponse($data['userMessage']);
            
            $stmt = $pdo->prepare("INSERT INTO aichat 
                (UserID, UserMessage, AIResponse, PronunciationScore, GrammarScore, FluencyScore, OverallScore, Feedback, SessionID) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $userId,
                $data['userMessage'],
                $aiResponse['response'],
                $aiResponse['pronunciationScore'],
                $aiResponse['grammarScore'],
                $aiResponse['fluencyScore'],
                $aiResponse['overallScore'],
                $aiResponse['feedback'],
                $data['sessionId'] ?? null
            ]);
            
            sendResponse(['success' => true, 'data' => $aiResponse]);
        }
        break;

    // Dashboard data
    case '/api/dashboard':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            
            // Get user stats
            $stmt = $pdo->prepare("SELECT * FROM statistics WHERE UserID = ?");
            $stmt->execute([$userId]);
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Get recent progress
            $stmt = $pdo->prepare("SELECT p.*, l.Title as LessonTitle, q.Title as QuizTitle 
                                 FROM userprogress p 
                                 LEFT JOIN lessons l ON p.LessonID = l.LessonID 
                                 LEFT JOIN quizzes q ON p.QuizID = q.QuizID 
                                 WHERE p.UserID = ? 
                                 ORDER BY p.CompletionDate DESC 
                                 LIMIT 5");
            $stmt->execute([$userId]);
            $recentProgress = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get due flashcards
            $stmt = $pdo->prepare("SELECT COUNT(*) as due_count FROM flashcards WHERE UserID = ? AND NextReview <= NOW()");
            $stmt->execute([$userId]);
            $dueFlashcards = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Get recommendations
            $stmt = $pdo->prepare("SELECT COUNT(*) as rec_count FROM recommendations WHERE UserID = ? AND IsCompleted = 0");
            $stmt->execute([$userId]);
            $recommendations = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse([
                'success' => true, 
                'data' => [
                    'stats' => $stats,
                    'recentProgress' => $recentProgress,
                    'dueFlashcards' => $dueFlashcards['due_count'],
                    'recommendations' => $recommendations['rec_count']
                ]
            ]);
        }
        break;

    // Legacy video endpoints (for backward compatibility)
    case '/api/videos':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Convert lessons to video format for compatibility
            $stmt = $pdo->query("SELECT LessonID as id, Title as title, Description as description, 
                               VideoLink as youtube_id, VideoLink as thumbnail_url, Duration as duration, 
                               Level as difficulty, Type as category, 0 as view_count 
                               FROM lessons WHERE IsActive = 1 AND VideoLink IS NOT NULL");
            $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $videos]);
        }
        break;
        
    case '/api/videos/subtitles':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $videoId = $_GET['video_id'] ?? null;
            if ($videoId) {
                // For now, return empty subtitles (can be implemented later)
                sendResponse(['success' => true, 'data' => []]);
            } else {
                sendResponse(['success' => false, 'error' => 'Video ID required'], 400);
            }
        }
        break;
        
    case '/api/videos/vocabulary':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $videoId = $_GET['video_id'] ?? null;
            if ($videoId) {
                // Get vocabulary related to the lesson topic
                $stmt = $pdo->prepare("SELECT v.WordID as id, v.Word as word, v.Meaning as definition, 
                                     v.Example as example, v.Difficulty as difficulty 
                                     FROM vocabulary v 
                                     JOIN lessons l ON v.TopicID = l.TopicID 
                                     WHERE l.LessonID = ? AND v.IsActive = 1");
                $stmt->execute([$videoId]);
                $vocabulary = $stmt->fetchAll(PDO::FETCH_ASSOC);
                sendResponse(['success' => true, 'data' => $vocabulary]);
            } else {
                sendResponse(['success' => false, 'error' => 'Video ID required'], 400);
            }
        }
        break;
        
    // Study Sessions endpoints
    case '/api/study-sessions':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = getCurrentUser($pdo);
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("INSERT INTO StudySessions (UserID, SessionType, ExamType, Level) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $userId,
                $data['SessionType'] ?? 'Mixed',
                $data['ExamType'] ?? 'General',
                $data['Level'] ?? 'A1'
            ]);
            
            $sessionId = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT * FROM StudySessions WHERE SessionID = ?");
            $stmt->execute([$sessionId]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse(['success' => true, 'data' => $session]);
        }
        break;
        
    case (preg_match('/^\/api\/study-sessions\/(\d+)$/', $path, $matches) ? true : false):
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $sessionId = $matches[1];
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("UPDATE StudySessions SET 
                EndTime = ?, CardsStudied = ?, CardsCorrect = ?, WritingAttempts = ?, 
                WritingCorrect = ?, AudioPlayed = ?, TotalTime = ?, Score = ?
                WHERE SessionID = ?");
            $stmt->execute([
                $data['EndTime'],
                $data['CardsStudied'] ?? 0,
                $data['CardsCorrect'] ?? 0,
                $data['WritingAttempts'] ?? 0,
                $data['WritingCorrect'] ?? 0,
                $data['AudioPlayed'] ?? 0,
                $data['TotalTime'] ?? 0,
                $data['Score'] ?? 0,
                $sessionId
            ]);
            
            sendResponse(['success' => true, 'message' => 'Session updated']);
        }
        break;

    // Study Goals endpoints
    case '/api/study-goals':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            
            $stmt = $pdo->prepare("SELECT * FROM StudyGoals WHERE UserID = ? AND IsActive = 1 ORDER BY StartDate DESC");
            $stmt->execute([$userId]);
            $goals = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse(['success' => true, 'data' => $goals]);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = getCurrentUser($pdo);
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("INSERT INTO StudyGoals (UserID, GoalType, TargetCards, TargetWriting, TargetTime, ExamType, Level) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $userId,
                $data['GoalType'] ?? 'Daily',
                $data['TargetCards'] ?? 20,
                $data['TargetWriting'] ?? 10,
                $data['TargetTime'] ?? 1800,
                $data['ExamType'] ?? 'General',
                $data['Level'] ?? 'A1'
            ]);
            
            sendResponse(['success' => true, 'message' => 'Goal created']);
        }
        break;

    // Study Statistics endpoints
    case '/api/study-statistics':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $userId = getCurrentUser($pdo);
            $date = $_GET['date'] ?? date('Y-m-d');
            
            $stmt = $pdo->prepare("SELECT * FROM StudyStatistics WHERE UserID = ? AND Date = ?");
            $stmt->execute([$userId, $date]);
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$stats) {
                // Create default stats for today
                $stmt = $pdo->prepare("INSERT INTO StudyStatistics (UserID, Date) VALUES (?, ?)");
                $stmt->execute([$userId, $date]);
                
                $stmt = $pdo->prepare("SELECT * FROM StudyStatistics WHERE UserID = ? AND Date = ?");
                $stmt->execute([$userId, $date]);
                $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            sendResponse(['success' => true, 'data' => $stats]);
        }
        break;

    // Enhanced flashcard review with SM-2 algorithm
    case (preg_match('/^\/api\/flashcards\/(\d+)\/review$/', $path, $matches) ? true : false):
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $flashcardId = $matches[1];
            $data = getRequestBody();
            $quality = $data['quality'] ?? 3;
            $studyMode = $data['studyMode'] ?? 'flashcard';
            $writingAttempt = $data['writingAttempt'] ?? null;
            
            // Get current flashcard data
            $stmt = $pdo->prepare("SELECT * FROM Flashcards WHERE FlashcardID = ?");
            $stmt->execute([$flashcardId]);
            $flashcard = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$flashcard) {
                sendResponse(['success' => false, 'error' => 'Flashcard not found'], 404);
            }
            
            // SM-2 Algorithm implementation
            $easeFactor = $flashcard['EaseFactor'] ?? 2.50;
            $interval = $flashcard['ReviewInterval'] ?? 1;
            $repetitions = $flashcard['Repetitions'] ?? 0;
            
            if ($quality >= 3) {
                if ($repetitions === 0) {
                    $interval = 1;
                } elseif ($repetitions === 1) {
                    $interval = 6;
                } else {
                    $interval = round($interval * $easeFactor);
                }
                $repetitions++;
            } else {
                $repetitions = 0;
                $interval = 1;
            }
            
            $easeFactor = max(1.3, $easeFactor + (0.1 - (5 - $quality) * (0.08 + (5 - $quality) * 0.02)));
            
            $nextReview = date('Y-m-d H:i:s', strtotime("+{$interval} days"));
            
            // Update flashcard
            $updateFields = [
                'CorrectCount' => $quality >= 3 ? $flashcard['CorrectCount'] + 1 : $flashcard['CorrectCount'],
                'WrongCount' => $quality < 3 ? $flashcard['WrongCount'] + 1 : $flashcard['WrongCount'],
                'ReviewDate' => date('Y-m-d H:i:s'),
                'NextReview' => $nextReview,
                'ReviewInterval' => $interval,
                'EaseFactor' => $easeFactor,
                'Repetitions' => $repetitions,
                'LastReviewScore' => $quality
            ];
            
            // Update writing stats if applicable
            if ($studyMode === 'writing' && $writingAttempt) {
                $updateFields['WritingAttempts'] = ($flashcard['WritingAttempts'] ?? 0) + 1;
                // Check if writing is correct (simplified check)
                $isCorrect = strtolower(trim($writingAttempt)) === strtolower(trim($flashcard['Word'] ?? ''));
                if ($isCorrect) {
                    $updateFields['WritingSuccess'] = ($flashcard['WritingSuccess'] ?? 0) + 1;
                }
            }
            
            $setClause = implode(', ', array_map(fn($key) => "$key = ?", array_keys($updateFields)));
            $values = array_values($updateFields);
            $values[] = $flashcardId;
            
            $stmt = $pdo->prepare("UPDATE Flashcards SET $setClause WHERE FlashcardID = ?");
            $stmt->execute($values);
            
            // Get updated flashcard
            $stmt = $pdo->prepare("SELECT * FROM Flashcards WHERE FlashcardID = ?");
            $stmt->execute([$flashcardId]);
            $updatedFlashcard = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse(['success' => true, 'data' => $updatedFlashcard]);
        }
        break;
        
    // Languages endpoints
    case '/api/languages':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $stmt = $pdo->prepare("SELECT * FROM Languages WHERE IsActive = 1 ORDER BY SortOrder ASC");
            $stmt->execute();
            $languages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $languages]);
        }
        break;

    // Study Methods endpoints
    case '/api/study-methods':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $stmt = $pdo->prepare("SELECT * FROM StudyMethods WHERE IsActive = 1 ORDER BY SortOrder ASC");
            $stmt->execute();
            $methods = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $methods]);
        }
        break;

    // Enhanced Topics endpoints with language support
    case '/api/topics':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $languageId = $_GET['languageId'] ?? null;
            $level = $_GET['level'] ?? null;
            
            $query = "SELECT t.*, l.LanguageName, l.NativeName, l.Flag,
                            (SELECT COUNT(*) FROM Vocabulary v WHERE v.TopicID = t.TopicID AND v.IsActive = 1) as WordCount
                     FROM Topics t 
                     LEFT JOIN Languages l ON t.LanguageID = l.LanguageID 
                     WHERE t.IsActive = 1";
            $params = [];
            
            if ($languageId) {
                $query .= " AND t.LanguageID = ?";
                $params[] = $languageId;
            }
            
            if ($level) {
                $query .= " AND t.Level = ?";
                $params[] = $level;
            }
            
            $query .= " ORDER BY t.SortOrder ASC, t.Title ASC";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $topics]);
        }
        break;

    // Enhanced Vocabulary endpoints with language support
    case '/api/vocabulary':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $topicId = $_GET['topicId'] ?? null;
            $languageId = $_GET['languageId'] ?? null;
            $level = $_GET['level'] ?? null;
            $difficulty = $_GET['difficulty'] ?? null;
            $examType = $_GET['examType'] ?? null;
            
            $query = "SELECT v.*, t.Title as TopicTitle, t.Icon as TopicIcon, t.Color as TopicColor,
                            l.LanguageName, l.NativeName, l.Flag
                     FROM Vocabulary v 
                     LEFT JOIN Topics t ON v.TopicID = t.TopicID 
                     LEFT JOIN Languages l ON v.LanguageID = l.LanguageID
                     WHERE v.IsActive = 1";
            $params = [];
            
            if ($topicId) {
                $query .= " AND v.TopicID = ?";
                $params[] = $topicId;
            }
            
            if ($languageId) {
                $query .= " AND v.LanguageID = ?";
                $params[] = $languageId;
            }
            
            if ($level) {
                $query .= " AND t.Level = ?";
                $params[] = $level;
            }
            
            if ($difficulty && $difficulty !== 'All') {
                $query .= " AND v.Difficulty = ?";
                $params[] = $difficulty;
            }
            
            if ($examType && $examType !== 'General') {
                $query .= " AND v.ExamType = ?";
                $params[] = $examType;
            }
            
            $query .= " ORDER BY v.Word";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $vocabulary = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(['success' => true, 'data' => $vocabulary]);
        }
        break;

    // Study Sessions Detailed endpoints
    case '/api/study-sessions-detailed':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = getCurrentUser($pdo);
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("INSERT INTO StudySessionsDetailed (UserID, TopicID, LanguageID, MethodID, SessionType, TotalWords) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $userId,
                $data['TopicID'],
                $data['LanguageID'] ?? 1,
                $data['MethodID'],
                $data['SessionType'],
                $data['TotalWords'] ?? 0
            ]);
            
            $sessionId = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT * FROM StudySessionsDetailed WHERE SessionID = ?");
            $stmt->execute([$sessionId]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse(['success' => true, 'data' => $session]);
        }
        break;
        
    case (preg_match('/^\/api\/study-sessions-detailed\/(\d+)$/', $path, $matches) ? true : false):
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $sessionId = $matches[1];
            $data = getRequestBody();
            
            $stmt = $pdo->prepare("UPDATE StudySessionsDetailed SET 
                EndTime = ?, WordsStudied = ?, WordsCorrect = ?, WritingAttempts = ?, 
                WritingCorrect = ?, AudioPlayed = ?, TotalTime = ?, Score = ?
                WHERE SessionID = ?");
            $stmt->execute([
                $data['EndTime'],
                $data['WordsStudied'] ?? 0,
                $data['WordsCorrect'] ?? 0,
                $data['WritingAttempts'] ?? 0,
                $data['WritingCorrect'] ?? 0,
                $data['AudioPlayed'] ?? 0,
                $data['TotalTime'] ?? 0,
                $data['Score'] ?? 0,
                $sessionId
            ]);
            
            sendResponse(['success' => true, 'message' => 'Session updated']);
        }
        break;

    // Enhanced vocabulary review with multi-language support
    case (preg_match('/^\/api\/vocabulary\/(\d+)\/review$/', $path, $matches) ? true : false):
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $wordId = $matches[1];
            $data = getRequestBody();
            $quality = $data['quality'] ?? 3;
            $studyMethod = $data['studyMethod'] ?? 'flashcard';
            $writingAttempt = $data['writingAttempt'] ?? null;
            
            // Get current word data
            $stmt = $pdo->prepare("SELECT * FROM Vocabulary WHERE WordID = ?");
            $stmt->execute([$wordId]);
            $word = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$word) {
                sendResponse(['success' => false, 'error' => 'Word not found'], 404);
            }
            
            // Update word statistics (simplified for demo)
            $updateFields = [
                'DifficultyScore' => $quality >= 3 ? min(100, $word['DifficultyScore'] + 5) : max(0, $word['DifficultyScore'] - 5),
                'FrequencyScore' => $quality >= 3 ? min(100, $word['FrequencyScore'] + 2) : max(0, $word['FrequencyScore'] - 2)
            ];
            
            $setClause = implode(', ', array_map(fn($key) => "$key = ?", array_keys($updateFields)));
            $values = array_values($updateFields);
            $values[] = $wordId;
            
            $stmt = $pdo->prepare("UPDATE Vocabulary SET $setClause WHERE WordID = ?");
            $stmt->execute($values);
            
            // Get updated word
            $stmt = $pdo->prepare("SELECT * FROM Vocabulary WHERE WordID = ?");
            $stmt->execute([$wordId]);
            $updatedWord = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendResponse(['success' => true, 'data' => $updatedWord]);
        }
        break;
        
    default:
        sendResponse(['error' => 'Not found'], 404);
        break;
}

// Helper functions
function updateUserStatistics($pdo, $userId, $data) {
    $stmt = $pdo->prepare("SELECT * FROM statistics WHERE UserID = ?");
    $stmt->execute([$userId]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($stats) {
        // Update existing stats
        $newWordsLearned = $stats['WordsLearned'];
        $newLessonsCompleted = $stats['LessonsCompleted'];
        $newQuizzesCompleted = $stats['QuizzesCompleted'];
        $newHoursSpent = $stats['HoursSpent'];
        
        if ($data['LessonID']) {
            $newLessonsCompleted++;
            $newHoursSpent += ($data['TimeSpent'] / 3600); // Convert seconds to hours
        }
        
        if ($data['QuizID']) {
            $newQuizzesCompleted++;
        }
        
        // Calculate new average score
        $totalScore = $stats['AvgScore'] * ($stats['LessonsCompleted'] + $stats['QuizzesCompleted']);
        $totalScore += $data['Score'];
        $totalActivities = $newLessonsCompleted + $newQuizzesCompleted;
        $newAvgScore = $totalActivities > 0 ? $totalScore / $totalActivities : 0;
        
        $stmt = $pdo->prepare("UPDATE statistics SET 
            LessonsCompleted = ?, 
            QuizzesCompleted = ?, 
            HoursSpent = ?, 
            AvgScore = ? 
            WHERE UserID = ?");
        
        $stmt->execute([
            $newLessonsCompleted,
            $newQuizzesCompleted,
            $newHoursSpent,
            $newAvgScore,
            $userId
        ]);
    } else {
        // Create new stats
        $stmt = $pdo->prepare("INSERT INTO statistics 
            (UserID, WordsLearned, LessonsCompleted, QuizzesCompleted, HoursSpent, AvgScore, StreakDays, TotalXP) 
            VALUES (?, 0, ?, ?, ?, ?, 0, 0)");
        
        $lessonsCompleted = $data['LessonID'] ? 1 : 0;
        $quizzesCompleted = $data['QuizID'] ? 1 : 0;
        $hoursSpent = $data['TimeSpent'] / 3600;
        
        $stmt->execute([
            $userId,
            $lessonsCompleted,
            $quizzesCompleted,
            $hoursSpent,
            $data['Score']
        ]);
    }
}

function generateAIResponse($userMessage) {
    // Simulate AI analysis and response
    $pronunciationScore = rand(70, 95);
    $grammarScore = rand(75, 90);
    $fluencyScore = rand(80, 95);
    $overallScore = round(($pronunciationScore + $grammarScore + $fluencyScore) / 3);
    
    $responses = [
        "Great job! I understood your message clearly.",
        "Excellent! Your English is improving.",
        "Good work! Try to use more complex sentences next time.",
        "Well done! Your pronunciation was clear.",
        "Nice! Keep practicing to improve your fluency."
    ];
    
    $feedback = [
        "Try using more varied vocabulary.",
        "Practice using different sentence structures.",
        "Work on your pronunciation of difficult words.",
        "Focus on speaking more fluently.",
        "Great progress! Keep it up!"
    ];
    
    return [
        'response' => $responses[array_rand($responses)],
        'pronunciationScore' => $pronunciationScore,
        'grammarScore' => $grammarScore,
        'fluencyScore' => $fluencyScore,
        'overallScore' => $overallScore,
        'feedback' => $feedback[array_rand($feedback)]
    ];
}

// Admin endpoints
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/api/topics') {
    try {
        $stmt = $pdo->prepare("
            SELECT t.*, l.LanguageName, l.Flag, l.LanguageCode as Code,
                   (SELECT COUNT(*) FROM Vocabulary v WHERE v.TopicID = t.TopicID) as VocabularyCount
            FROM Topics t 
            LEFT JOIN Languages l ON t.LanguageID = l.LanguageID 
            ORDER BY l.LanguageName, t.Title ASC
        ");
        $stmt->execute();
        $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(['success' => true, 'data' => $topics]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to fetch topics: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/api/vocabulary') {
    try {
        $stmt = $pdo->prepare("
            SELECT v.*, t.Title as TopicTitle, t.Icon as TopicIcon, l.LanguageName
            FROM Vocabulary v 
            LEFT JOIN Topics t ON v.TopicID = t.TopicID 
            LEFT JOIN Languages l ON v.LanguageID = l.LanguageID
            ORDER BY l.LanguageName, t.Title, v.Word ASC
        ");
        $stmt->execute();
        $vocabulary = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(['success' => true, 'data' => $vocabulary]);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to fetch vocabulary: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/topics') {
    try {
        $data = getRequestBody();
        
        $stmt = $pdo->prepare("
            INSERT INTO Topics (Title, Description, Level, Icon, LanguageID, CreatedAt) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $data['Title'],
            $data['Description'],
            $data['Level'],
            $data['Icon'],
            $data['LanguageID']
        ]);
        
        $topicId = $pdo->lastInsertId();
        sendResponse(['message' => 'Topic created successfully', 'id' => $topicId], 201);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to create topic: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/vocabulary') {
    try {
        $data = getRequestBody();
        
        $stmt = $pdo->prepare("
            INSERT INTO Vocabulary (Word, Meaning, Pronunciation, Example, TopicID, Difficulty, CreatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $data['Word'],
            $data['Meaning'],
            $data['Pronunciation'],
            $data['Example'],
            $data['TopicID'],
            $data['Difficulty']
        ]);
        
        $vocabularyId = $pdo->lastInsertId();
        sendResponse(['message' => 'Vocabulary created successfully', 'id' => $vocabularyId], 201);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to create vocabulary: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/\/api\/topics\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    try {
        $topicId = $matches[1];
        $data = getRequestBody();
        
        $stmt = $pdo->prepare("
            UPDATE Topics 
            SET Title = ?, Description = ?, Level = ?, Icon = ?, LanguageID = ?
            WHERE TopicID = ?
        ");
        $stmt->execute([
            $data['Title'],
            $data['Description'],
            $data['Level'],
            $data['Icon'],
            $data['LanguageID'],
            $topicId
        ]);
        
        sendResponse(['message' => 'Topic updated successfully']);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to update topic: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/\/api\/vocabulary\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    try {
        $vocabularyId = $matches[1];
        $data = getRequestBody();
        
        $stmt = $pdo->prepare("
            UPDATE Vocabulary 
            SET Word = ?, Meaning = ?, Pronunciation = ?, Example = ?, TopicID = ?, Difficulty = ?
            WHERE VocabularyID = ?
        ");
        $stmt->execute([
            $data['Word'],
            $data['Meaning'],
            $data['Pronunciation'],
            $data['Example'],
            $data['TopicID'],
            $data['Difficulty'],
            $vocabularyId
        ]);
        
        sendResponse(['message' => 'Vocabulary updated successfully']);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to update vocabulary: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/\/api\/topics\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    try {
        $topicId = $matches[1];
        
        // First delete related vocabulary
        $stmt = $pdo->prepare("DELETE FROM Vocabulary WHERE TopicID = ?");
        $stmt->execute([$topicId]);
        
        // Then delete the topic
        $stmt = $pdo->prepare("DELETE FROM Topics WHERE TopicID = ?");
        $stmt->execute([$topicId]);
        
        sendResponse(['message' => 'Topic deleted successfully']);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to delete topic: ' . $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/\/api\/vocabulary\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    try {
        $vocabularyId = $matches[1];
        
        $stmt = $pdo->prepare("DELETE FROM Vocabulary WHERE VocabularyID = ?");
        $stmt->execute([$vocabularyId]);
        
        sendResponse(['message' => 'Vocabulary deleted successfully']);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to delete vocabulary: ' . $e->getMessage()], 500);
    }
}

// Debug routing
error_log("DEBUG: REQUEST_METHOD = " . $_SERVER['REQUEST_METHOD']);
error_log("DEBUG: REQUEST_URI = " . $_SERVER['REQUEST_URI']);
error_log("DEBUG: Checking import-vocabulary...");

// Import endpoint - Dedicated route for /api/import-vocabulary
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $path === '/api/import-vocabulary') {
    error_log("DEBUG: POST request received! URI: " . $_SERVER['REQUEST_URI']);
    error_log("DEBUG: FILES: " . print_r($_FILES, true));
    try {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            sendResponse(['error' => 'No file uploaded'], 400);
        }
        
        $file = $_FILES['file'];
        $filePath = $file['tmp_name'];
        
        // Simple CSV parsing (can be extended for Excel with PhpSpreadsheet)
        $handle = fopen($filePath, 'r');
        $imported = 0;
        $errors = [];
        
        // Read header row to map columns
        $headers = fgetcsv($handle, 1000, ',');
        if (!$headers) {
            sendResponse(['error' => 'Invalid file format'], 400);
        }
        
        // Map column indices
        $columnMap = [];
        foreach ($headers as $index => $header) {
            $columnMap[strtolower(trim($header))] = $index;
        }
        
        // Required fields
        $requiredFields = ['word', 'meaning', 'topicid', 'languageid'];
        foreach ($requiredFields as $field) {
            if (!isset($columnMap[$field])) {
                sendResponse(['error' => "Missing required column: $field"], 400);
            }
        }
        
        // Process data rows
        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
            if (count($data) >= 4) { // At least 4 required fields
                try {
                    $word = trim($data[$columnMap['word']] ?? '');
                    $meaning = trim($data[$columnMap['meaning']] ?? '');
                    $topicId = (int)($data[$columnMap['topicid']] ?? 0);
                    $languageId = (int)($data[$columnMap['languageid']] ?? 0);
                    
                    // Optional fields
                    $phonetic = trim($data[$columnMap['phonetic']] ?? '');
                    $type = trim($data[$columnMap['type']] ?? '');
                    $example = trim($data[$columnMap['example']] ?? '');
                    $audio = trim($data[$columnMap['audio']] ?? '');
                    $difficulty = trim($data[$columnMap['difficulty']] ?? 'Easy');
                    $isActive = isset($columnMap['isactive']) ? (int)($data[$columnMap['isactive']] ?? 1) : 1;
                    
                    // Validate required fields
                    if (empty($word) || empty($meaning) || $topicId <= 0 || $languageId <= 0) {
                        $errors[] = "Row " . ($imported + 1) . ": Missing required fields";
                        continue;
                    }
                    
                    // Validate difficulty
                    if (!in_array($difficulty, ['Easy', 'Medium', 'Hard'])) {
                        $difficulty = 'Easy';
                    }
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO Vocabulary 
                        (Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty, IsActive, created_at) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                    ");
                    $stmt->execute([
                        $word, $phonetic, $type, $meaning, $example, $audio, 
                        $topicId, $languageId, $difficulty, $isActive
                    ]);
                    $imported++;
                    
                } catch (Exception $e) {
                    $errors[] = "Row " . ($imported + 1) . ": " . $e->getMessage();
                }
            }
        }
        
        fclose($handle);
        
        $response = [
            'message' => "Imported $imported vocabulary items successfully",
            'imported' => $imported,
            'errors' => $errors
        ];
        
        if (!empty($errors)) {
            $response['warning'] = count($errors) . " rows had errors";
        }
        
        sendResponse($response);
        
    } catch (Exception $e) {
        sendResponse(['error' => 'Import failed: ' . $e->getMessage()], 500);
    }
}

// Simple import endpoint - just check for file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    error_log("DEBUG: Simple import endpoint matched!");
    try {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            sendResponse(['error' => 'No file uploaded'], 400);
        }
        
        $file = $_FILES['file'];
        $filePath = $file['tmp_name'];
        
        // Simple CSV parsing (can be extended for Excel with PhpSpreadsheet)
        $handle = fopen($filePath, 'r');
        $imported = 0;
        $errors = [];
        
        // Read header row to map columns
        $headers = fgetcsv($handle, 1000, ',');
        if (!$headers) {
            sendResponse(['error' => 'Invalid file format'], 400);
        }
        
        // Map column indices
        $columnMap = [];
        foreach ($headers as $index => $header) {
            $columnMap[strtolower(trim($header))] = $index;
        }
        
        // Required fields
        $requiredFields = ['word', 'meaning', 'topicid', 'languageid'];
        foreach ($requiredFields as $field) {
            if (!isset($columnMap[$field])) {
                sendResponse(['error' => "Missing required column: $field"], 400);
            }
        }
        
        // Process data rows
        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
            if (count($data) >= 4) { // At least 4 required fields
                try {
                    $word = trim($data[$columnMap['word']] ?? '');
                    $meaning = trim($data[$columnMap['meaning']] ?? '');
                    $topicId = (int)($data[$columnMap['topicid']] ?? 0);
                    $languageId = (int)($data[$columnMap['languageid']] ?? 0);
                    
                    // Optional fields
                    $phonetic = trim($data[$columnMap['phonetic']] ?? '');
                    $type = trim($data[$columnMap['type']] ?? '');
                    $example = trim($data[$columnMap['example']] ?? '');
                    $audio = trim($data[$columnMap['audio']] ?? '');
                    $difficulty = trim($data[$columnMap['difficulty']] ?? 'Easy');
                    $isActive = isset($columnMap['isactive']) ? (int)($data[$columnMap['isactive']] ?? 1) : 1;
                    
                    // Validate required fields
                    if (empty($word) || empty($meaning) || $topicId <= 0 || $languageId <= 0) {
                        $errors[] = "Row " . ($imported + 1) . ": Missing required fields";
                        continue;
                    }
                    
                    // Validate difficulty
                    if (!in_array($difficulty, ['Easy', 'Medium', 'Hard'])) {
                        $difficulty = 'Easy';
                    }
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO Vocabulary 
                        (Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty, IsActive, created_at) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                    ");
                    $stmt->execute([
                        $word, $phonetic, $type, $meaning, $example, $audio, 
                        $topicId, $languageId, $difficulty, $isActive
                    ]);
                    $imported++;
                    
                } catch (Exception $e) {
                    $errors[] = "Row " . ($imported + 1) . ": " . $e->getMessage();
                }
            }
        }
        
        fclose($handle);
        
        $response = [
            'message' => "Imported $imported vocabulary items successfully",
            'imported' => $imported,
            'errors' => $errors
        ];
        
        if (!empty($errors)) {
            $response['warning'] = count($errors) . " rows had errors";
        }
        
        sendResponse($response);
        
    } catch (Exception $e) {
        sendResponse(['error' => 'Import failed: ' . $e->getMessage()], 500);
    }
}
?>