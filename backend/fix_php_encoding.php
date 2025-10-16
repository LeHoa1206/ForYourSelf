<?php
// Fix PHP encoding
header('Content-Type: application/json; charset=utf-8');

// Set mbstring encoding
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');

// Test data
$data = [
    'success' => true,
    'data' => [
        [
            'TopicID' => 1,
            'Title' => 'Gia đình',
            'Description' => 'Gia đình và các mối quan hệ'
        ],
        [
            'TopicID' => 2,
            'Title' => 'Thức ăn',
            'Description' => 'Thức ăn và đồ uống'
        ],
        [
            'TopicID' => 3,
            'Title' => 'Nhà cửa',
            'Description' => 'Nhà cửa và đồ đạc'
        ]
    ]
];

// Force UTF-8 output
ob_start('mb_output_handler');
echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
ob_end_flush();
?>
