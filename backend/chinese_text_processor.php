<?php
// Chinese Text Processor - Tách từ tiếng Trung và các ngôn ngữ khác
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Set UTF-8 encoding
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

function isChinese($char) {
    $code = mb_ord($char, 'UTF-8');
    return ($code >= 0x4E00 && $code <= 0x9FFF) || 
           ($code >= 0x3400 && $code <= 0x4DBF) ||
           ($code >= 0x20000 && $code <= 0x2A6DF);
}

function isJapanese($char) {
    $code = mb_ord($char, 'UTF-8');
    return ($code >= 0x3040 && $code <= 0x309F) || // Hiragana
           ($code >= 0x30A0 && $code <= 0x30FF) || // Katakana
           ($code >= 0x4E00 && $code <= 0x9FFF);   // Kanji
}

function isKorean($char) {
    $code = mb_ord($char, 'UTF-8');
    return ($code >= 0xAC00 && $code <= 0xD7AF) || // Hangul
           ($code >= 0x1100 && $code <= 0x11FF) ||   // Hangul Jamo
           ($code >= 0x3130 && $code <= 0x318F);     // Hangul Compatibility Jamo
}

function isThai($char) {
    $code = mb_ord($char, 'UTF-8');
    return $code >= 0x0E00 && $code <= 0x0E7F;
}

function detectLanguage($text) {
    $chineseCount = 0;
    $japaneseCount = 0;
    $koreanCount = 0;
    $thaiCount = 0;
    $total = 0;
    
    for ($i = 0; $i < mb_strlen($text, 'UTF-8'); $i++) {
        $char = mb_substr($text, $i, 1, 'UTF-8');
        if (isChinese($char)) $chineseCount++;
        if (isJapanese($char)) $japaneseCount++;
        if (isKorean($char)) $koreanCount++;
        if (isThai($char)) $thaiCount++;
        $total++;
    }
    
    if ($chineseCount > $total * 0.3) return 'zh';
    if ($japaneseCount > $total * 0.3) return 'ja';
    if ($koreanCount > $total * 0.3) return 'ko';
    if ($thaiCount > $total * 0.3) return 'th';
    return 'en';
}

function segmentChineseText($text) {
    // Segment Chinese text character by character for better word selection
    $segments = [];
    
    for ($i = 0; $i < mb_strlen($text, 'UTF-8'); $i++) {
        $char = mb_substr($text, $i, 1, 'UTF-8');
        
        if (isChinese($char)) {
            // Each Chinese character is a separate segment
            $segments[] = $char;
        } else {
            // Handle punctuation and spaces
            $segments[] = $char;
        }
    }
    
    return $segments;
}

function segmentJapaneseText($text) {
    // Simple Japanese segmentation
    $segments = [];
    $currentWord = '';
    
    for ($i = 0; $i < mb_strlen($text, 'UTF-8'); $i++) {
        $char = mb_substr($text, $i, 1, 'UTF-8');
        
        if (isJapanese($char)) {
            $currentWord .= $char;
            // Segment at punctuation or after 2-3 characters
            if (mb_strlen($currentWord, 'UTF-8') >= 2 && 
                (in_array($char, ['。', '、', '！', '？', '，', '；', '：']) || 
                 $i === mb_strlen($text, 'UTF-8') - 1)) {
                $segments[] = $currentWord;
                $currentWord = '';
            }
        } else {
            if ($currentWord) {
                $segments[] = $currentWord;
                $currentWord = '';
            }
            $segments[] = $char;
        }
    }
    
    if ($currentWord) {
        $segments[] = $currentWord;
    }
    
    return $segments;
}

function segmentKoreanText($text) {
    // Simple Korean segmentation
    $segments = [];
    $currentWord = '';
    
    for ($i = 0; $i < mb_strlen($text, 'UTF-8'); $i++) {
        $char = mb_substr($text, $i, 1, 'UTF-8');
        
        if (isKorean($char)) {
            $currentWord .= $char;
            // Segment at spaces or punctuation
            if (in_array($char, [' ', '。', '!', '?', ',', ';', ':']) || 
                $i === mb_strlen($text, 'UTF-8') - 1) {
                $segments[] = trim($currentWord);
                $currentWord = '';
            }
        } else {
            if ($currentWord) {
                $segments[] = trim($currentWord);
                $currentWord = '';
            }
            $segments[] = $char;
        }
    }
    
    if ($currentWord) {
        $segments[] = trim($currentWord);
    }
    
    return $segments;
}

function segmentEnglishText($text) {
    // English word segmentation (split by spaces and punctuation)
    return preg_split('/(\s+|[.,!?;:])/', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
}

function processText($text) {
    $language = detectLanguage($text);
    $segments = [];
    
    switch ($language) {
        case 'zh':
            $segments = segmentChineseText($text);
            break;
        case 'ja':
            $segments = segmentJapaneseText($text);
            break;
        case 'ko':
            $segments = segmentKoreanText($text);
            break;
        default:
            $segments = segmentEnglishText($text);
            break;
    }
    
    return [
        'language' => $language,
        'segments' => array_filter($segments, function($segment) {
            return trim($segment) !== '';
        })
    ];
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $text = $input['text'] ?? '';
    
    if (empty($text)) {
        echo json_encode([
            'success' => false,
            'error' => 'No text provided'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $result = processText($text);
    
    echo json_encode([
        'success' => true,
        'data' => $result
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
