<?php
// Script to create Excel-compatible CSV templates with proper UTF-8 encoding

// Topics template
$topicsData = [
    ['LanguageID', 'Title', 'Description', 'Level', 'Icon', 'Color', 'SortOrder'],
    [1, 'Gia đình', 'Chủ đề về gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1],
    [1, 'Thức ăn', 'Đồ ăn và thức uống', 'A1', '🍕', '#10B981', 2],
    [1, 'Nhà cửa', 'Nhà và đồ nội thất', 'A1', '🏠', '#3B82F6', 3],
    [1, 'Màu sắc', 'Màu sắc và hình dạng', 'A1', '🎨', '#8B5CF6', 4],
    [1, 'Số đếm', 'Số và thời gian', 'A1', '🔢', '#F59E0B', 5],
    [2, 'Family', 'Family and relationships', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1],
    [2, 'Food', 'Food and drinks', 'A1', '🍕', '#10B981', 2],
    [2, 'Home', 'Home and furniture', 'A1', '🏠', '#3B82F6', 3],
    [2, 'Colors', 'Colors and shapes', 'A1', '🎨', '#8B5CF6', 4],
    [2, 'Numbers', 'Numbers and time', 'A1', '🔢', '#F59E0B', 5]
];

// Vocabulary template
$vocabularyData = [
    ['Word', 'Phonetic', 'Type', 'Meaning', 'Example', 'Audio', 'TopicID', 'LanguageID', 'Difficulty'],
    ['gia đình', 'gia đình', 'noun', 'family', 'Tôi yêu gia đình tôi', 'family.mp3', 1, 1, 'Easy'],
    ['bố', 'bố', 'noun', 'father', 'Bố tôi là bác sĩ', 'father.mp3', 1, 1, 'Easy'],
    ['mẹ', 'mẹ', 'noun', 'mother', 'Mẹ tôi nấu ăn rất ngon', 'mother.mp3', 1, 1, 'Easy'],
    ['anh trai', 'anh trai', 'noun', 'older brother', 'Anh trai tôi học đại học', 'brother.mp3', 1, 1, 'Easy'],
    ['chị gái', 'chị gái', 'noun', 'older sister', 'Chị gái tôi rất xinh', 'sister.mp3', 1, 1, 'Easy'],
    ['family', 'fam-uh-lee', 'noun', 'gia đình', 'I love my family', 'family.mp3', 1, 2, 'Easy'],
    ['father', 'fa-ther', 'noun', 'bố', 'My father is a doctor', 'father.mp3', 1, 2, 'Easy'],
    ['mother', 'moth-er', 'noun', 'mẹ', 'My mother cooks well', 'mother.mp3', 1, 2, 'Easy'],
    ['brother', 'broth-er', 'noun', 'anh trai', 'My brother studies at university', 'brother.mp3', 1, 2, 'Easy'],
    ['sister', 'sis-ter', 'noun', 'chị gái', 'My sister is beautiful', 'sister.mp3', 1, 2, 'Easy']
];

// Function to create CSV with UTF-8 BOM
function createCSV($filename, $data) {
    $file = fopen($filename, 'w');
    
    // Add UTF-8 BOM for Excel compatibility
    fwrite($file, "\xEF\xBB\xBF");
    
    foreach ($data as $row) {
        fputcsv($file, $row);
    }
    
    fclose($file);
    echo "Created: $filename\n";
}

// Create templates
createCSV('templates/topics_import_template_utf8.csv', $topicsData);
createCSV('templates/vocabulary_import_template_utf8.csv', $vocabularyData);

echo "✅ Excel-compatible CSV templates created successfully!\n";
echo "Files created:\n";
echo "- templates/topics_import_template_utf8.csv\n";
echo "- templates/vocabulary_import_template_utf8.csv\n";
echo "\nThese files will open correctly in Excel with proper Vietnamese encoding.\n";
?>
