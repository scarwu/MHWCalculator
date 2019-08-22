#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://mhw.poedb.tw';

$urlMapping = [
    1 => "{$host}/zh/armors/1",
    2 => "{$host}/zh/armors/2",
    3 => "{$host}/zh/armors/3",
    4 => "{$host}/zh/armors/4",
    5 => "{$host}/zh/armors/5",
    6 => "{$host}/zh/armors/6",
    7 => "{$host}/zh/armors/7",
    8 => "{$host}/zh/armors/8"
];

$genderMapping = [
    '女性専用' => 'female',
    '男性専用' => 'male',
    '男女共用' => 'general'
];

$allEquiqs = [];

foreach ($urlMapping as $rare => $url) {
    echo "{$url}\n";

    $mainDom = getDOM($url);
    $mainList = $mainDom->find('table', 0);

    $equips = [];

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

        continue;

        $subDom = getDOM($subUrl);
        $subList = $subDom->find('table', 0);

        $equip = [
            'common' => [
                'rare' => $rare,
                'gender' => 'general',
                'series' => [
                    'zhTW' => $name,
                    'jaJP' => null,
                    'enUS' => null
                ],
                'defense' => null,
                'resistance' => [
                    'fire' => null,
                    'water' => null,
                    'thunder' => null,
                    'ice' => null,
                    'dragon' => null
                ],
                'set' => null
            ],

            // {
            //     "id": "合金護腿α",
            //     "type": "leg",
            //     "name": {
            //         "zhTW": "合金護腿α",
            //         "jaJP": null,
            //         "enUS": null
            //     },
            //     "slots": null,
            //     "skills": [
            //         {
            //             "id": "砥石使用高速化",
            //             "level": 2
            //         }
            //     ]
            // }
            'list' => []
        ];

        // foreach ($subList->find('tr') as $row) {
        //     [$key, $value] = explode('<td>', $row->find('th', 0)->innertext);

        //     $key = parseHTML($key);
        //     $value = parseHTML($value);

        //     switch ($key->plaintext) {
        //     case 'rarity':
        //         $rare = (int) $value->plaintext;

        //         break;

        //     // Skipped
        //     case 'id':
        //         break;
        //     default:
        //         echo "{$key}\n";
        //         echo "{$value}\n";

        //         break;
        //     }
        // }

        // if (!isset($equips[$rare])) {
        //     $equips[$rare] = [];
        // }

        // $equips[$rare][] = $equip;
    }
}

saveJson("zh/poedb/armor/rare{$rare}", $equips);
