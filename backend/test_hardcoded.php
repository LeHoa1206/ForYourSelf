<?php
// Test with hardcoded data
header('Content-Type: application/json; charset=utf-8');

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

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
