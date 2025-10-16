<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);
$word = $input['word'] ?? '';
$targetLanguage = $input['target_language'] ?? 'vi';

// Debug
error_log('Input data: ' . print_r($input, true));
error_log('Word: ' . $word);

if (!$word) {
    echo json_encode(['error' => 'Word required', 'input' => $input], JSON_UNESCAPED_UNICODE);
    exit;
}

// Simple translation dictionary
$translations = [
    'climate' => [
        'vi' => 'khí hậu',
        'fr' => 'climat',
        'es' => 'clima',
        'ja' => '気候',
        'zh' => '气候',
        'ko' => '기후',
        'de' => 'Klima'
    ],
    'change' => [
        'vi' => 'thay đổi',
        'fr' => 'changement',
        'es' => 'cambio',
        'ja' => '変化',
        'zh' => '变化',
        'ko' => '변화',
        'de' => 'Änderung'
    ],
    'impact' => [
        'vi' => 'tác động',
        'fr' => 'impact',
        'es' => 'impacto',
        'ja' => '影響',
        'zh' => '影响',
        'ko' => '영향',
        'de' => 'Auswirkung'
    ],
    'economy' => [
        'vi' => 'kinh tế',
        'fr' => 'économie',
        'es' => 'economía',
        'ja' => '経済',
        'zh' => '经济',
        'ko' => '경제',
        'de' => 'Wirtschaft'
    ],
    'global' => [
        'vi' => 'toàn cầu',
        'fr' => 'mondial',
        'es' => 'global',
        'ja' => 'グローバル',
        'zh' => '全球',
        'ko' => '글로벌',
        'de' => 'global'
    ],
    'technology' => [
        'vi' => 'công nghệ',
        'fr' => 'technologie',
        'es' => 'tecnología',
        'ja' => '技術',
        'zh' => '技术',
        'ko' => '기술',
        'de' => 'Technologie'
    ],
    'healthcare' => [
        'vi' => 'chăm sóc sức khỏe',
        'fr' => 'soins de santé',
        'es' => 'atención médica',
        'ja' => '医療',
        'zh' => '医疗',
        'ko' => '의료',
        'de' => 'Gesundheitswesen'
    ],
    'sustainable' => [
        'vi' => 'bền vững',
        'fr' => 'durable',
        'es' => 'sostenible',
        'ja' => '持続可能',
        'zh' => '可持续',
        'ko' => '지속 가능한',
        'de' => 'nachhaltig'
    ],
    'agriculture' => [
        'vi' => 'nông nghiệp',
        'fr' => 'agriculture',
        'es' => 'agricultura',
        'ja' => '農業',
        'zh' => '农业',
        'ko' => '농업',
        'de' => 'Landwirtschaft'
    ],
    'environment' => [
        'vi' => 'môi trường',
        'fr' => 'environnement',
        'es' => 'medio ambiente',
        'ja' => '環境',
        'zh' => '环境',
        'ko' => '환경',
        'de' => 'Umwelt'
    ]
];

// Clean word (remove punctuation, convert to lowercase)
$cleanWord = strtolower(preg_replace('/[^a-zA-Z]/', '', $word));

// Find translation
$translation = null;
$pronunciation = null;
$partOfSpeech = 'noun';
$example = null;

if (isset($translations[$cleanWord])) {
    $translation = $translations[$cleanWord][$targetLanguage] ?? $translations[$cleanWord]['vi'];
    $pronunciation = $translation;
    
    // Create example sentence
    $examples = [
        'climate' => 'Climate change is a global issue.',
        'technology' => 'Technology is advancing rapidly.',
        'healthcare' => 'Healthcare systems need improvement.',
        'sustainable' => 'Sustainable practices are important.',
        'agriculture' => 'Agriculture feeds the world.',
        'environment' => 'Environment protection is crucial.',
        'economy' => 'Economy affects everyone.',
        'global' => 'Global cooperation is necessary.',
        'impact' => 'Impact of decisions is significant.',
        'change' => 'Change is inevitable.'
    ];
    
    $example = $examples[$cleanWord] ?? "The word '{$word}' is important in this context.";
}

// Return response
echo json_encode([
    'success' => true,
    'data' => [
        'word' => $word,
        'translation' => $translation,
        'pronunciation' => $pronunciation,
        'partOfSpeech' => $partOfSpeech,
        'example' => [
            'original' => $example,
            'translated' => $example // Simplified for now
        ],
        'targetLanguage' => $targetLanguage,
        'found' => $translation !== null
    ]
], JSON_UNESCAPED_UNICODE);
?>
