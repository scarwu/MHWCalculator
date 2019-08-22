#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://mhw.poedb.tw';

$mainDom = getDOM("{$host}/zh/decorations");
$mainList = $mainDom->find('table', 0);

$jewels = [];

foreach ($mainList->find('tr') as $index => $row) {
    if (0 === $index) {
        continue;
    }

    $item = $row->find('a', 0);

    if (null === $item) {
        continue;
    }

    $name = trim($item->plaintext);
    $name = explode('【', $name)[0];

    $subUrl = "{$host}{$item->href}";

    echo "{$name}: {$subUrl}\n";

    $subDom = getDOM($subUrl);
    $subList = $subDom->find('table', 0);

    $jewel = [
        'name' => [
            'zhTW' => $name,
            'jaJP' => null,
            'enUS' => null,
        ],
        'rare' => null,
        'size' => null
    ];

    foreach ($subList->find('tr') as $row) {
        [$key, $value] = explode('<td>', $row->find('th', 0)->innertext);

        $key = parseHTML($key);
        $value = parseHTML($value);

        switch ($key->plaintext) {
        case 'rarity':
            $jewel['rare'] = (int) $value->plaintext;

            break;
        case 'slot':
            $jewel['size'] = (int) $value->plaintext;

            break;
        case 'name_en':
            $jewel['name']['enUS'] = $value->plaintext;

            break;
        case 'skills':
            // nothings

            break;

        // Skipped
        case 'item_id':
        case 'list_order':
        case 'IconID':
        case 'IconColorID':
            break;
        default:
            echo "{$key}\n";
            echo "{$value}\n";

            break;
        }
    }

    $jewels[] = $jewel;
}

saveJson('zh/poedb/jewels', $jewels);
