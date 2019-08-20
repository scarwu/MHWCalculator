#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://monsterhunterworld.wiki.fextralife.com';
$result = [];

$dom = getDOM("{$host}/Decorations");

foreach ($dom->find('.wiki_table', 0)->find('tr') as $index => $item) {
    if (0 === $index) {
        continue;
    }

    list($name, $skill) = explode("\r\n", trim($item->find('td', 0)->plaintext));
    $rare = (int) trim($item->find('td', 2)->plaintext);

    echo "Jewel: {$name}\n";

    $result[] = [
        'name' => $name,
        'rare' => $rare,
        'skill' => html_entity_decode($skill)
    ];
}

saveJson('en/monsterhunterworld/jewels', $result);
