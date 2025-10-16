<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);
$word = $input['word'] ?? '';
$targetLanguage = $input['target_language'] ?? 'vi'; // Default to Vietnamese

if (!$word) {
    echo json_encode(['error' => 'Word required'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Translation dictionary
$translations = [
    'climate' => [
        'vi' => 'khí hậu',
        'fr' => 'climat',
        'es' => 'clima',
        'ja' => '気候',
        'zh' => '气候'
    ],
    'change' => [
        'vi' => 'thay đổi',
        'fr' => 'changement',
        'es' => 'cambio',
        'ja' => '変化',
        'zh' => '变化'
    ],
    'impact' => [
        'vi' => 'tác động',
        'fr' => 'impact',
        'es' => 'impacto',
        'ja' => '影響',
        'zh' => '影响'
    ],
    'economy' => [
        'vi' => 'kinh tế',
        'fr' => 'économie',
        'es' => 'economía',
        'ja' => '経済',
        'zh' => '经济'
    ],
    'global' => [
        'vi' => 'toàn cầu',
        'fr' => 'mondial',
        'es' => 'global',
        'ja' => 'グローバル',
        'zh' => '全球'
    ],
    'technology' => [
        'vi' => 'công nghệ',
        'fr' => 'technologie',
        'es' => 'tecnología',
        'ja' => '技術',
        'zh' => '技术'
    ],
    'healthcare' => [
        'vi' => 'chăm sóc sức khỏe',
        'fr' => 'soins de santé',
        'es' => 'atención médica',
        'ja' => '医療',
        'zh' => '医疗'
    ],
    'artificial' => [
        'vi' => 'nhân tạo',
        'fr' => 'artificiel',
        'es' => 'artificial',
        'ja' => '人工',
        'zh' => '人工'
    ],
    'intelligence' => [
        'vi' => 'trí tuệ',
        'fr' => 'intelligence',
        'es' => 'inteligencia',
        'ja' => '知能',
        'zh' => '智能'
    ],
    'sustainable' => [
        'vi' => 'bền vững',
        'fr' => 'durable',
        'es' => 'sostenible',
        'ja' => '持続可能',
        'zh' => '可持续'
    ],
    'agriculture' => [
        'vi' => 'nông nghiệp',
        'fr' => 'agriculture',
        'es' => 'agricultura',
        'ja' => '農業',
        'zh' => '农业'
    ],
    'environment' => [
        'vi' => 'môi trường',
        'fr' => 'environnement',
        'es' => 'medio ambiente',
        'ja' => '環境',
        'zh' => '环境'
    ],
    'development' => [
        'vi' => 'phát triển',
        'fr' => 'développement',
        'es' => 'desarrollo',
        'ja' => '開発',
        'zh' => '发展'
    ],
    'innovation' => [
        'vi' => 'đổi mới',
        'fr' => 'innovation',
        'es' => 'innovación',
        'ja' => '革新',
        'zh' => '创新'
    ],
    'research' => [
        'vi' => 'nghiên cứu',
        'fr' => 'recherche',
        'es' => 'investigación',
        'ja' => '研究',
        'zh' => '研究'
    ]
];

// Clean word (remove punctuation, convert to lowercase)
$cleanWord = strtolower(preg_replace('/[^a-zA-Z]/', '', $word));

// Find translation
$translation = null;
$pronunciation = null;
$partOfSpeech = null;
$example = null;

if (isset($translations[$cleanWord])) {
    $translation = $translations[$cleanWord][$targetLanguage] ?? $translations[$cleanWord]['vi'];
    
    // Add pronunciation based on language
    switch ($targetLanguage) {
        case 'vi':
            $pronunciation = $translation;
            break;
        case 'fr':
            $pronunciation = $translation;
            break;
        case 'es':
            $pronunciation = $translation;
            break;
        case 'ja':
            $pronunciation = $translation;
            break;
        case 'zh':
            $pronunciation = $translation;
            break;
        default:
            $pronunciation = $translation;
    }
    
    // Determine part of speech
    $partOfSpeech = 'noun'; // Default
    if (in_array($cleanWord, ['change', 'impact', 'development', 'innovation'])) {
        $partOfSpeech = 'noun';
    } elseif (in_array($cleanWord, ['sustainable', 'artificial', 'global'])) {
        $partOfSpeech = 'adjective';
    }
    
    // Create example sentence
    $examples = [
        'climate' => 'Climate change is a global issue.',
        'technology' => 'Technology is advancing rapidly.',
        'healthcare' => 'Healthcare systems need improvement.',
        'sustainable' => 'Sustainable practices are important.',
        'agriculture' => 'Agriculture feeds the world.'
    ];
    
    $example = $examples[$cleanWord] ?? "The word '{$word}' is important in this context.";
}

// If no translation found, try to find similar words
$similarWords = [];
if (!$translation) {
    foreach ($translations as $dictWord => $langs) {
        if (strpos($dictWord, $cleanWord) !== false || strpos($cleanWord, $dictWord) !== false) {
            $similarWords[] = [
                'word' => $dictWord,
                'translation' => $langs[$targetLanguage] ?? $langs['vi']
            ];
        }
    }
}

// Save lookup to database (if user is logged in)
$userId = $input['user_id'] ?? null;
$articleId = $input['article_id'] ?? null;

if ($userId && $articleId) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO UserLookupHistory (UserID, ArticleID, Word, Translation, LookupCount) 
            VALUES (?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE 
            LookupCount = LookupCount + 1,
            LastLookedAt = CURRENT_TIMESTAMP
        ");
        $stmt->execute([$userId, $articleId, $word, $translation ?: 'Not found']);
    } catch (PDOException $e) {
        // Log error but don't fail the request
        error_log('Failed to save lookup history: ' . $e->getMessage());
    }
}

// Return response
echo json_encode([
    'success' => true,
    'data' => [
        'word' => $word,
        'translation' => $translation,
        'pronunciation' => $pronunciation,
        'partOfSpeech' => $partOfSpeech,
        'example' => $example,
        'targetLanguage' => $targetLanguage,
        'similarWords' => $similarWords,
        'found' => $translation !== null
    ]
], JSON_UNESCAPED_UNICODE);
?>
