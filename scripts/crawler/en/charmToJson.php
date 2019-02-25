#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../common.php";

$host = 'https://monsterhunterworld.wiki.fextralife.com';
$result = [];

$dom = parseHTML(getHTML("{$host}/Charms"));

foreach ($dom->find('.wiki_table tr') as $index => $item) {
    if (0 === $index) {
        continue;
    }

    $name = trim($item->find('td', 1)->plaintext);
    $desciption = trim(html_entity_decode($item->find('td', 2)->plaintext));

    echo "Charm: {$name}\n";

    $result[] = [
        'name' => $name,
        'desciption' => $desciption
    ];
}

if (!file_exists("{$root}/../../../temp")) {
    mkdir("{$root}/../../../temp");
}

file_put_contents(
    "{$root}/../../../temp/en-charms.json",
    json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);
