#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://monsterhunterworld.wiki.fextralife.com';
$result = [];

$dom = getDOM("{$host}/Charms");

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

saveJson('en/monsterhunterworld/charms', $result);
