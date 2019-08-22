#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://mhw.poedb.tw';

$mainDom = getDOM("{$host}/zh/skills");
$mainList = $mainDom->find('table', 0);

$skills = [];

foreach ($mainList->find('tr') as $index => $row) {
    if (0 === $index) {
        continue;
    }

    $item = $row->find('a', 0);

    if (null === $item) {
        continue;
    }

    $name = trim($item->plaintext);

    $subUrl = "{$host}{$item->href}";

    echo "{$name}: {$subUrl}\n";

    $subDom = getDOM($subUrl);
    $subList = $subDom->find('table', 0);

    $skill = [
        'name' => [
            'zhTW' => $name,
            'jaJP' => null,
            'enUS' => null,
        ]
    ];

    foreach ($subList->find('tr') as $row) {
        [$key, $value] = explode('<td>', $row->find('th', 0)->innertext);

        $key = parseHTML($key);
        $value = parseHTML($value);

        switch ($key->plaintext) {
        case 'name_en':
            $skill['name']['enUS'] = $value->plaintext;

            break;

        // Skipped
        case 'is_set_bonus':
        case 'skill_id':
            break;
        default:
            echo "{$key}\n";
            echo "{$value}\n";

            break;
        }
    }

    $skills[] = $skill;
}

saveJson('zh/poedb/skills', $skills);
