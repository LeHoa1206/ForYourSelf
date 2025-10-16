<?php
// Add Chinese article for testing
header('Content-Type: application/json; charset=utf-8');

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
    
    // Add Chinese article
    $chineseArticle = [
        'Title' => '人工智能的发展与应用',
        'Content' => '随着科技的迅速发展，人工智能（AI）已经成为我们日常生活中不可或缺的一部分。无论是在医疗、教育还是交通领域，AI 都在帮助人类提高效率、节省时间并创造新的可能性。例如，在医疗方面，AI 可以通过分析大量数据来辅助医生做出更准确的诊断；在教育中，智能教学系统能够根据学生的学习习惯提供个性化的学习建议；而在交通领域，无人驾驶技术正在逐步改变我们的出行方式。然而，AI 的发展也带来了新的挑战，例如隐私保护、就业问题以及道德风险。我们需要在发展技术的同时，建立合理的法律和伦理标准，以确保 AI 的应用真正造福人类社会。',
        'Summary' => '人工智能正在改变我们的生活，但也带来了新的挑战。',
        'SourceID' => 1,
        'LanguageID' => 1,
        'Category' => 'Technology',
        'DifficultyLevel' => 'Intermediate',
        'ReadingTime' => 8,
        'WordCount' => 200
    ];
    
    $stmt = $pdo->prepare("
        INSERT INTO NewsArticles 
        (Title, Content, Summary, SourceID, LanguageID, Category, DifficultyLevel, ReadingTime, WordCount, IsActive) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $chineseArticle['Title'],
        $chineseArticle['Content'],
        $chineseArticle['Summary'],
        $chineseArticle['SourceID'],
        $chineseArticle['LanguageID'],
        $chineseArticle['Category'],
        $chineseArticle['DifficultyLevel'],
        $chineseArticle['ReadingTime'],
        $chineseArticle['WordCount'],
        1
    ]);
    
    $articleId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Chinese article added successfully',
        'article_id' => $articleId,
        'title' => $chineseArticle['Title']
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
