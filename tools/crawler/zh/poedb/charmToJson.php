#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://mhw.poedb.tw';

$mainDom = getDOM("{$host}/zh/charms");
$mainList = $mainDom->find('table', 0);

$charms = [];

foreach ($mainList->find('tr') as $index => $row) {
    if (0 === $index) {
        continue;
    }

    $item = $row->find('a', 0);

    if (null === $item) {
        continue;
    }

    $name = trim($item->plaintext);
    $name = str_replace(' ', '', $name);
    $name = str_replace('III', 'Ⅲ', $name);
    $name = str_replace('II', 'Ⅱ', $name);
    $name = str_replace('I', 'Ⅰ', $name);
    $name = str_replace('Ⅲ', ' III', $name);
    $name = str_replace('Ⅱ', ' II', $name);
    $name = str_replace('Ⅰ', ' I', $name);
    $name = str_replace('‧', '．', $name);

    $subUrl = "{$host}{$item->href}";

    echo "{$name}: {$subUrl}\n";

    $subDom = getDOM($subUrl);
    $subList = $subDom->find('table', 0);

    $charm = [
        'id' => $name,
        'name' => [
            'zhTW' => $name,
            'jaJP' => null,
            'enUS' => null,
        ],
        'rare' => null
    ];

    foreach ($subList->find('tr') as $row) {
        [$key, $value] = explode('<td>', $row->find('th', 0)->innertext);

        $key = parseHTML($key);
        $value = parseHTML($value);

        switch ($key->plaintext) {
        case 'name_en':
            $charm['name']['enUS'] = $value->plaintext;

            break;
        case 'rarity':
            $charm['rare'] = (int) $value->plaintext;

            break;
        case 'skills':
            // nothing

            break;

        // Skipped
        case 'equip_id':
        case 'charm_id':
            break;
        default:
            echo "{$key}\n";
            echo "{$value}\n";

            break;
        }
    }

    $charms[] = $charm;
}

saveJson('zh/poedb/charms', $charms);
