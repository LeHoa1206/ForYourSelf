<?php
// Test Chinese text processing
header('Content-Type: application/json; charset=utf-8');

$testText = "随着科技的迅速发展，人工智能（AI）已经成为我们日常生活中不可或缺的一部分。";

try {
    $pdo = new PDO(
        "mysql:host=mysql;dbname=vip_english_learning;charset=utf8mb4", 
        "vip_user", 
        "vip_password",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    // Simple Chinese segmentation for testing - character by character
    $segments = [];
    
    for ($i = 0; $i < mb_strlen($testText, 'UTF-8'); $i++) {
        $char = mb_substr($testText, $i, 1, 'UTF-8');
        $segments[] = $char;
    }
    
    echo json_encode([
        'success' => true,
        'original_text' => $testText,
        'segments' => $segments,
        'segment_count' => count($segments)
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
