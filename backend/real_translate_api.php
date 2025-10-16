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
$sourceLanguage = $input['source_language'] ?? 'en';

if (!$word) {
    echo json_encode(['error' => 'Word required'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Function to translate using Google Translate (free method)
function translateWithGoogle($text, $targetLang, $sourceLang = 'auto') {
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={$sourceLang}&tl={$targetLang}&dt=t&q=" . urlencode($text);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200 || !$response) {
        return null;
    }
    
    $data = json_decode($response, true);
    if (isset($data[0][0][0])) {
        return $data[0][0][0];
    }
    
    return null;
}

// Function to get pronunciation using Google Translate
function getPronunciation($text, $lang) {
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={$lang}&tl={$lang}&dt=t&dt=rm&q=" . urlencode($text);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    if (!$response) return null;
    
    $data = json_decode($response, true);
    if (isset($data[0][0][2])) {
        return $data[0][0][2]; // Pronunciation
    }
    
    return null;
}

// Function to get part of speech using Google Translate
function getPartOfSpeech($text, $sourceLang, $targetLang) {
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={$sourceLang}&tl={$targetLang}&dt=t&dt=at&q=" . urlencode($text);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    if (!$response) return 'noun'; // Default
    
    $data = json_decode($response, true);
    if (isset($data[2])) {
        $pos = strtolower($data[2]);
        if (strpos($pos, 'verb') !== false) return 'verb';
        if (strpos($pos, 'adjective') !== false) return 'adjective';
        if (strpos($pos, 'adverb') !== false) return 'adverb';
        if (strpos($pos, 'noun') !== false) return 'noun';
    }
    
    return 'noun'; // Default
}

// Function to get example sentences using Google Translate
function getExampleSentence($word, $sourceLang, $targetLang) {
    // Create a simple example sentence
    $examples = [
        'climate' => 'Climate change affects the entire world.',
        'technology' => 'Technology is advancing rapidly.',
        'healthcare' => 'Healthcare is essential for society.',
        'sustainable' => 'Sustainable practices protect the environment.',
        'agriculture' => 'Agriculture provides food for everyone.',
        'environment' => 'Environment protection is crucial.',
        'development' => 'Development requires careful planning.',
        'innovation' => 'Innovation drives progress.',
        'research' => 'Research leads to new discoveries.',
        'artificial' => 'Artificial intelligence is evolving.',
        'intelligence' => 'Intelligence can be measured.',
        'global' => 'Global cooperation is necessary.',
        'economy' => 'Economy affects everyone.',
        'impact' => 'Impact of decisions is significant.',
        'change' => 'Change is inevitable.'
    ];
    
    $example = $examples[strtolower($word)] ?? "The word '{$word}' is important in this context.";
    
    // Translate the example to target language
    $translatedExample = translateWithGoogle($example, $targetLang, $sourceLang);
    
    return [
        'original' => $example,
        'translated' => $translatedExample ?: $example
    ];
}

try {
    // Translate the word
    $translation = translateWithGoogle($word, $targetLanguage, $sourceLanguage);
    
    if (!$translation) {
        echo json_encode([
            'success' => false,
            'error' => 'Translation failed. Please try again.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Get pronunciation
    $pronunciation = getPronunciation($word, $sourceLanguage);
    
    // Get part of speech
    $partOfSpeech = getPartOfSpeech($word, $sourceLanguage, $targetLanguage);
    
    // Get example sentence
    $example = getExampleSentence($word, $sourceLanguage, $targetLanguage);
    
    // Get additional translations (synonyms)
    $synonyms = [];
    $relatedWords = [
        'climate' => ['weather', 'atmosphere', 'environment'],
        'technology' => ['innovation', 'advancement', 'development'],
        'healthcare' => ['medical', 'health', 'treatment'],
        'sustainable' => ['eco-friendly', 'green', 'renewable'],
        'agriculture' => ['farming', 'cultivation', 'crops'],
        'environment' => ['surroundings', 'habitat', 'ecosystem'],
        'development' => ['growth', 'progress', 'advancement'],
        'innovation' => ['invention', 'creativity', 'breakthrough'],
        'research' => ['study', 'investigation', 'analysis'],
        'artificial' => ['synthetic', 'man-made', 'simulated'],
        'intelligence' => ['smartness', 'wisdom', 'understanding'],
        'global' => ['worldwide', 'international', 'universal'],
        'economy' => ['financial', 'economic', 'monetary'],
        'impact' => ['effect', 'influence', 'consequence'],
        'change' => ['modification', 'alteration', 'transformation']
    ];
    
    $wordKey = strtolower($word);
    if (isset($relatedWords[$wordKey])) {
        foreach ($relatedWords[$wordKey] as $relatedWord) {
            $relatedTranslation = translateWithGoogle($relatedWord, $targetLanguage, $sourceLanguage);
            if ($relatedTranslation) {
                $synonyms[] = [
                    'word' => $relatedWord,
                    'translation' => $relatedTranslation
                ];
            }
        }
    }
    
    // Save to database if user is logged in
    $userId = $input['user_id'] ?? null;
    $articleId = $input['article_id'] ?? null;
    
    if ($userId && $articleId) {
        try {
            $host = 'mysql';
            $dbname = 'vip_english_learning';
            $username = 'vip_user';
            $password = 'vip_password';
            
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            
            $stmt = $pdo->prepare("
                INSERT INTO UserLookupHistory (UserID, ArticleID, Word, Translation, LookupCount) 
                VALUES (?, ?, ?, ?, 1)
                ON DUPLICATE KEY UPDATE 
                LookupCount = LookupCount + 1,
                LastLookedAt = CURRENT_TIMESTAMP
            ");
            $stmt->execute([$userId, $articleId, $word, $translation]);
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
            'synonyms' => $synonyms,
            'targetLanguage' => $targetLanguage,
            'sourceLanguage' => $sourceLanguage,
            'found' => true
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Translation service error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
