<?php
// Complete API with full CRUD and Excel import
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
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
    
    // Force UTF-8 encoding
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("SET CHARACTER SET utf8mb4");
    $pdo->exec("SET character_set_client = utf8mb4");
    $pdo->exec("SET character_set_connection = utf8mb4");
    $pdo->exec("SET character_set_results = utf8mb4");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Remove query string
$path = strtok($path, '?');

// Handle direct file access
if (strpos($path, '/complete_api.php') !== false) {
    $path = str_replace('/complete_api.php', '', $path);
}

// Route handling
switch ($path) {
    // =====================================================
    // LANGUAGES ENDPOINTS
    // =====================================================
    case '/api/languages':
        if ($method === 'GET') {
            $stmt = $pdo->prepare("SELECT * FROM Languages WHERE IsActive = 1 ORDER BY SortOrder");
            $stmt->execute();
            $languages = $stmt->fetchAll();
            sendResponse(['success' => true, 'data' => $languages]);
        }
        break;

    // =====================================================
    // TOPICS ENDPOINTS
    // =====================================================
    case '/api/topics':
        if ($method === 'GET') {
            $stmt = $pdo->prepare("
                SELECT t.*, l.LanguageName, l.LanguageCode 
                FROM Topics t 
                LEFT JOIN Languages l ON t.LanguageID = l.LanguageID 
                WHERE t.IsActive = 1 
                ORDER BY t.LanguageID, t.SortOrder
            ");
            $stmt->execute();
            $topics = $stmt->fetchAll();
            sendResponse(['success' => true, 'data' => $topics]);
        }
        break;

    case (preg_match('/^\/api\/topics\/(\d+)$/', $path, $matches) ? true : false):
        $topicId = $matches[1];
        
        if ($method === 'GET') {
            $stmt = $pdo->prepare("
                SELECT t.*, l.LanguageName, l.LanguageCode 
                FROM Topics t 
                LEFT JOIN Languages l ON t.LanguageID = l.LanguageID 
                WHERE t.TopicID = ? AND t.IsActive = 1
            ");
            $stmt->execute([$topicId]);
            $topic = $stmt->fetch();
            
            if ($topic) {
                sendResponse(['success' => true, 'data' => $topic]);
            } else {
                sendResponse(['error' => 'Topic not found'], 404);
            }
        }
        break;

    // =====================================================
    // VOCABULARY ENDPOINTS
    // =====================================================
    case '/api/vocabulary':
        if ($method === 'GET') {
            $stmt = $pdo->prepare("
                SELECT v.*, t.Title as TopicTitle, l.LanguageName, l.LanguageCode 
                FROM Vocabulary v 
                LEFT JOIN Topics t ON v.TopicID = t.TopicID 
                LEFT JOIN Languages l ON v.LanguageID = l.LanguageID 
                WHERE v.IsActive = 1 
                ORDER BY v.TopicID, v.Word
            ");
            $stmt->execute();
            $vocabulary = $stmt->fetchAll();
            sendResponse(['success' => true, 'data' => $vocabulary]);
        }
        break;

    case (preg_match('/^\/api\/vocabulary\/(\d+)$/', $path, $matches) ? true : false):
        $wordId = $matches[1];
        
        if ($method === 'GET') {
            $stmt = $pdo->prepare("
                SELECT v.*, t.Title as TopicTitle, l.LanguageName, l.LanguageCode 
                FROM Vocabulary v 
                LEFT JOIN Topics t ON v.TopicID = t.TopicID 
                LEFT JOIN Languages l ON v.LanguageID = l.LanguageID 
                WHERE v.WordID = ? AND v.IsActive = 1
            ");
            $stmt->execute([$wordId]);
            $word = $stmt->fetch();
            
            if ($word) {
                sendResponse(['success' => true, 'data' => $word]);
            } else {
                sendResponse(['error' => 'Word not found'], 404);
            }
        }
        break;

    // =====================================================
    // CRUD OPERATIONS
    // =====================================================
    case '/api/topics/create':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $required = ['LanguageID', 'Title'];
            foreach ($required as $field) {
                if (!isset($input[$field]) || empty($input[$field])) {
                    sendResponse(['error' => "Field $field is required"], 400);
                }
            }
            
            $stmt = $pdo->prepare("
                INSERT INTO Topics (LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $result = $stmt->execute([
                $input['LanguageID'],
                $input['Title'],
                $input['Description'] ?? '',
                $input['Level'] ?? 'A1',
                $input['Icon'] ?? '📚',
                $input['Color'] ?? '#3B82F6',
                $input['IsActive'] ?? 1,
                $input['SortOrder'] ?? 0
            ]);
            
            if ($result) {
                $topicId = $pdo->lastInsertId();
                sendResponse(['success' => true, 'message' => 'Topic created successfully', 'id' => $topicId]);
            } else {
                sendResponse(['error' => 'Failed to create topic'], 500);
            }
        }
        break;

    case '/api/topics/update':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['TopicID'])) {
                sendResponse(['error' => 'TopicID is required'], 400);
            }
            
            $stmt = $pdo->prepare("
                UPDATE Topics 
                SET LanguageID = ?, Title = ?, Description = ?, Level = ?, Icon = ?, Color = ?, IsActive = ?, SortOrder = ?
                WHERE TopicID = ?
            ");
            
            $result = $stmt->execute([
                $input['LanguageID'],
                $input['Title'],
                $input['Description'] ?? '',
                $input['Level'] ?? 'A1',
                $input['Icon'] ?? '📚',
                $input['Color'] ?? '#3B82F6',
                $input['IsActive'] ?? 1,
                $input['SortOrder'] ?? 0,
                $input['TopicID']
            ]);
            
            if ($result) {
                sendResponse(['success' => true, 'message' => 'Topic updated successfully']);
            } else {
                sendResponse(['error' => 'Failed to update topic'], 500);
            }
        }
        break;

    case '/api/topics/delete':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['TopicID'])) {
                sendResponse(['error' => 'TopicID is required'], 400);
            }
            
            // Soft delete - set IsActive to 0
            $stmt = $pdo->prepare("UPDATE Topics SET IsActive = 0 WHERE TopicID = ?");
            $result = $stmt->execute([$input['TopicID']]);
            
            if ($result) {
                sendResponse(['success' => true, 'message' => 'Topic deleted successfully']);
            } else {
                sendResponse(['error' => 'Failed to delete topic'], 500);
            }
        }
        break;

    case '/api/vocabulary/create':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $required = ['Word', 'Meaning', 'TopicID', 'LanguageID'];
            foreach ($required as $field) {
                if (!isset($input[$field]) || empty($input[$field])) {
                    sendResponse(['error' => "Field $field is required"], 400);
                }
            }
            
            $stmt = $pdo->prepare("
                INSERT INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty, IsActive) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $result = $stmt->execute([
                $input['Word'],
                $input['Phonetic'] ?? '',
                $input['Type'] ?? '',
                $input['Meaning'],
                $input['Example'] ?? '',
                $input['Audio'] ?? '',
                $input['TopicID'],
                $input['LanguageID'],
                $input['Difficulty'] ?? 'Easy',
                $input['IsActive'] ?? 1
            ]);
            
            if ($result) {
                $wordId = $pdo->lastInsertId();
                sendResponse(['success' => true, 'message' => 'Vocabulary created successfully', 'id' => $wordId]);
            } else {
                sendResponse(['error' => 'Failed to create vocabulary'], 500);
            }
        }
        break;

    case '/api/vocabulary/update':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['WordID'])) {
                sendResponse(['error' => 'WordID is required'], 400);
            }
            
            $stmt = $pdo->prepare("
                UPDATE Vocabulary 
                SET Word = ?, Phonetic = ?, Type = ?, Meaning = ?, Example = ?, Audio = ?, TopicID = ?, LanguageID = ?, Difficulty = ?, IsActive = ?
                WHERE WordID = ?
            ");
            
            $result = $stmt->execute([
                $input['Word'],
                $input['Phonetic'] ?? '',
                $input['Type'] ?? '',
                $input['Meaning'],
                $input['Example'] ?? '',
                $input['Audio'] ?? '',
                $input['TopicID'],
                $input['LanguageID'],
                $input['Difficulty'] ?? 'Easy',
                $input['IsActive'] ?? 1,
                $input['WordID']
            ]);
            
            if ($result) {
                sendResponse(['success' => true, 'message' => 'Vocabulary updated successfully']);
            } else {
                sendResponse(['error' => 'Failed to update vocabulary'], 500);
            }
        }
        break;

    case '/api/vocabulary/delete':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['WordID'])) {
                sendResponse(['error' => 'WordID is required'], 400);
            }
            
            // Soft delete - set IsActive to 0
            $stmt = $pdo->prepare("UPDATE Vocabulary SET IsActive = 0 WHERE WordID = ?");
            $result = $stmt->execute([$input['WordID']]);
            
            if ($result) {
                sendResponse(['success' => true, 'message' => 'Vocabulary deleted successfully']);
            } else {
                sendResponse(['error' => 'Failed to delete vocabulary'], 500);
            }
        }
        break;

    // =====================================================
    // EXCEL IMPORT ENDPOINTS
    // =====================================================
    case '/api/import/topics':
        if ($method === 'POST') {
            error_log("Import topics endpoint hit");
            
            if (!isset($_FILES['file'])) {
                error_log("No file uploaded");
                sendResponse(['error' => 'No file uploaded'], 400);
            }
            
            $file = $_FILES['file'];
            error_log("File info: " . print_r($file, true));
            
            if ($file['error'] !== UPLOAD_ERR_OK) {
                error_log("File upload error: " . $file['error']);
                sendResponse(['error' => 'File upload error: ' . $file['error']], 400);
            }
            
            $imported = 0;
            $errors = [];
            
            // Process CSV file
            $handle = fopen($file['tmp_name'], 'r');
            if (!$handle) {
                sendResponse(['error' => 'Cannot open file'], 400);
            }
            
            $headers = fgetcsv($handle, 1000, ','); // Get headers
            error_log("Headers: " . print_r($headers, true));
            
            while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                if (count($data) >= 2) { // At least LanguageID and Title
                    try {
                        $stmt = $pdo->prepare("
                            INSERT INTO Topics (LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) 
                            VALUES (?, ?, ?, ?, ?, ?, 1, ?)
                        ");
                        
                        $stmt->execute([
                            $data[0], // LanguageID
                            $data[1], // Title
                            $data[2] ?? '', // Description
                            $data[3] ?? 'A1', // Level
                            $data[4] ?? '📚', // Icon
                            $data[5] ?? '#3B82F6', // Color
                            $data[6] ?? 0 // SortOrder
                        ]);
                        
                        $imported++;
                        error_log("Imported topic: " . $data[1]);
                    } catch (Exception $e) {
                        $errorMsg = "Row " . ($imported + 1) . ": " . $e->getMessage();
                        $errors[] = $errorMsg;
                        error_log($errorMsg);
                    }
                }
            }
            
            fclose($handle);
            
            // Update vocabulary count
            $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
            
            error_log("Import completed: $imported topics, " . count($errors) . " errors");
            
            sendResponse([
                'success' => true,
                'message' => "Imported $imported topics successfully",
                'imported' => $imported,
                'errors' => $errors
            ]);
        }
        break;

    case '/api/import/vocabulary':
        if ($method === 'POST') {
            error_log("Import vocabulary endpoint hit");
            
            if (!isset($_FILES['file'])) {
                error_log("No file uploaded");
                sendResponse(['error' => 'No file uploaded'], 400);
            }
            
            $file = $_FILES['file'];
            error_log("File info: " . print_r($file, true));
            
            if ($file['error'] !== UPLOAD_ERR_OK) {
                error_log("File upload error: " . $file['error']);
                sendResponse(['error' => 'File upload error: ' . $file['error']], 400);
            }
            
            $imported = 0;
            $errors = [];
            
            // Process CSV file
            $handle = fopen($file['tmp_name'], 'r');
            if (!$handle) {
                sendResponse(['error' => 'Cannot open file'], 400);
            }
            
            $headers = fgetcsv($handle, 1000, ','); // Get headers
            error_log("Headers: " . print_r($headers, true));
            
            while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                if (count($data) >= 4) { // At least Word, Meaning, TopicID, LanguageID
                    try {
                        $stmt = $pdo->prepare("
                            INSERT INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty, IsActive) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                        ");
                        
                        $stmt->execute([
                            $data[0], // Word
                            $data[1] ?? '', // Phonetic
                            $data[2] ?? '', // Type
                            $data[3], // Meaning
                            $data[4] ?? '', // Example
                            $data[5] ?? '', // Audio
                            $data[6], // TopicID
                            $data[7], // LanguageID
                            $data[8] ?? 'Easy' // Difficulty
                        ]);
                        
                        $imported++;
                        error_log("Imported vocabulary: " . $data[0]);
                    } catch (Exception $e) {
                        $errorMsg = "Row " . ($imported + 1) . ": " . $e->getMessage();
                        $errors[] = $errorMsg;
                        error_log($errorMsg);
                    }
                }
            }
            
            fclose($handle);
            
            // Update vocabulary count
            $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
            
            error_log("Import completed: $imported vocabulary, " . count($errors) . " errors");
            
            sendResponse([
                'success' => true,
                'message' => "Imported $imported vocabulary items successfully",
                'imported' => $imported,
                'errors' => $errors
            ]);
        }
        break;

    // =====================================================
    // DEFAULT ROUTE
    // =====================================================
    default:
        sendResponse(['error' => 'Endpoint not found: ' . $path], 404);
        break;
}
?>
