<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$host = 'vip-mysql';
$dbname = 'vip_english_learning';
$username = 'root';
$password = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("IMPORT.PHP: POST request received!");
    error_log("IMPORT.PHP: FILES: " . print_r($_FILES, true));
    
    try {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('No file uploaded or upload error');
        }
        
        $file = $_FILES['file'];
        $filePath = $file['tmp_name'];
        
        // Process CSV
        $handle = fopen($filePath, 'r');
        $imported = 0;
        $errors = [];
        
        // Skip header
        $headers = fgetcsv($handle, 1000, ',');
        error_log("IMPORT.PHP: Headers: " . print_r($headers, true));
        
        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
            if (count($data) >= 4) {
                try {
                    $word = trim($data[0]);
                    $meaning = trim($data[1]);
                    $topicId = (int)trim($data[3]);
                    $languageId = (int)trim($data[4]);
                    
                    if (empty($word) || empty($meaning) || $topicId <= 0 || $languageId <= 0) {
                        $errors[] = "Row " . ($imported + 1) . ": Missing required fields";
                        continue;
                    }
                    
                    $stmt = $pdo->prepare("INSERT INTO Vocabulary (Word, Meaning, TopicID, LanguageID, created_at) VALUES (?, ?, ?, ?, NOW())");
                    $stmt->execute([$word, $meaning, $topicId, $languageId]);
                    $imported++;
                    
                } catch (Exception $e) {
                    $errors[] = "Row " . ($imported + 1) . ": " . $e->getMessage();
                }
            }
        }
        
        fclose($handle);
        
        $response = [
            'success' => true,
            'message' => "Imported $imported vocabulary items successfully",
            'imported' => $imported,
            'errors' => $errors
        ];
        
        if (!empty($errors)) {
            $response['warning'] = count($errors) . " rows had errors";
        }
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        error_log("IMPORT.PHP: Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Import failed: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
