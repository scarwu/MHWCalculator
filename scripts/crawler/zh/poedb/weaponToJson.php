#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://mhw.poedb.tw';

$urlMapping = [
    "greatSword" => "{$host}/zh/weapons/l_sword",
    "longSword" => "{$host}/zh/weapons/tachi",
    "swordAndShield" => "{$host}/zh/weapons/sword",
    "dualSlades" => "{$host}/zh/weapons/w_sword",
    "hammer" => "{$host}/zh/weapons/hammer",
    "huntingHorn" => "{$host}/zh/weapons/whistle",
    "lance" => "{$host}/zh/weapons/lance",
    "gunlance" => "{$host}/zh/weapons/g_lance",
    "switchAxe" => "{$host}/zh/weapons/s_axe",
    "chargeBlade" => "{$host}/zh/weapons/c_axe",
    "insectGlaive" => "{$host}/zh/weapons/rod",
    "lightBowgun" => "{$host}/zh/weapons/lbg",
    "heavyBowgun" => "{$host}/zh/weapons/hbg",
    "bow" => "{$host}/zh/weapons/bow"
];

$typeMapping = [
    "greatSword" => '大劍',
    "longSword" => '太刀',
    "swordAndShield" => '片手劍',
    "dualSlades" => '雙劍',
    "hammer" => '大鎚',
    "huntingHorn" => '狩獵笛',
    "lance" => '長槍',
    "gunlance" => '銃槍',
    "switchAxe" => '斬擊斧',
    "chargeBlade" => '充能斧',
    "insectGlaive" => '操蟲棍',
    "lightBowgun" => '輕弩',
    "heavyBowgun" => '重弩',
    "bow" => '弓'
];

$sharpnessList = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'white'
];

foreach ($urlMapping as $weaponType => $url) {
    echo "{$typeMapping[$weaponType]}: {$url}\n";

    $mainDom = getDOM($url);
    $mainList = getDOM($url)->find('table', 0);

    $equips = [];

    foreach ($mainList->find('tr') as $index => $row) {
        if (0 === $index) {
            continue;
        }

        if (null === $row->find('a', 0)) {
            continue;
        }

        $item = $row->find('a', 0);

        $name = trim($item->plaintext);
        $name = str_replace(' ', '', $name);
        $name = str_replace('III', 'Ⅲ', $name);
        $name = str_replace('II', 'Ⅱ', $name);
        $name = str_replace('I', 'Ⅰ', $name);
        $name = str_replace('Ⅲ', ' III', $name);
        $name = str_replace('Ⅱ', ' II', $name);
        $name = str_replace('Ⅰ', ' I', $name);

        $subUrl = "{$host}{$item->href}";

        echo "{$name}: {$subUrl}\n";

        $subDom = getDOM($subUrl);
        $subList = $subDom->find('table', 0);

        $equip = [
            'id' => $name,
            'rare' => null,
            'type' => $typeMapping[$weaponType],
            'series' => [
                'zhTW' => null,
                'jaJP' => null,
                'enUS' => null
            ],
            'name' => [
                'zhTW' => $name,
                'jaJP' => null,
                'enUS' => null
            ],
            'attack' => 0,
            'criticalRate' => 0,
            'defense' => 0,
            'sharpness' => null,
            'element' => null,
            'elderseal' => null,
            'slots' => null,
            'skills' => null
        ];

        foreach ($subList->find('tr') as $row) {
            [$key, $value] = explode('<td>', $row->find('th', 0)->innertext);

            $key = parseHTML($key);
            $value = parseHTML($value);

            switch ($key->plaintext) {
            case 'rarity':
                $equip['rare'] = (int) $value->plaintext;

                break;
            case 'tree_en':
                $equip['series']['zhTW'] = $value->plaintext;

                break;
            case 'name_en':
                $equip['name']['enUS'] = $value->plaintext;

                break;
            case '攻擊力':
                $equip['attack'] = (int) $value->plaintext;

                break;
            case '防禦力':
                $equip['defense'] = (int) $value->plaintext;

                break;
            case '會心率':
                $text = $value->plaintext;

                if (preg_match('/^(\+|-)(\d+)%$/', $text, $matches)) {
                    if ('+' === $matches[1]) {
                        $equip['criticalRate'] = (int) $matches[2];
                    } else {
                        $equip['criticalRate'] = -((int) $matches[2]);
                    }
                }

                break;
            case '銳利度':
                $steps = $value->find('.kbox-in', 4);
                $red = (null !== $steps->find('span', 0))
                    ? (int) $steps->find('span', 0)->attr['title'] : 0;
                $orange = (null !== $steps->find('span', 1))
                    ? (int) $steps->find('span', 1)->attr['title'] : 0;
                $yellow = (null !== $steps->find('span', 2))
                    ? (int) $steps->find('span', 2)->attr['title'] : 0;
                $green = (null !== $steps->find('span', 3))
                    ? (int) $steps->find('span', 3)->attr['title'] : 0;
                $blue = (null !== $steps->find('span', 4))
                    ? (int) $steps->find('span', 4)->attr['title'] : 0;
                $white = (null !== $steps->find('span', 5))
                    ? (int) $steps->find('span', 5)->attr['title'] : 0;

                $equip['sharpness'] = [
                    'value' => ($red + $orange + $yellow + $green + $blue + $white) - 50,
                    'steps' => [
                        'red' => $red,
                        'orange' => $orange,
                        'yellow' => $yellow,
                        'green' => $green,
                        'blue' => $blue,
                        'white' => $white
                    ]
                ];

                break;
            case '屬性值':
                $text = trim($value->plaintext);
                $type = $value->find('img', 0)->attr['title'];

                $equip['element'] = [
                    'attack' => null,
                    'status' => null
                ];

                if (preg_match('/^\((\d+)\)$/', $text, $matches)) {
                    $equip['element'][in_array($type, [
                        'fire', 'ice', 'water', 'thunder', 'dragon'
                    ]) ? 'attack' : 'status'] = [
                        'type' => $type,
                        'minValue' => (int) $matches[1],
                        'maxValue' => null,
                        'isHidden' => true
                    ];
                }

                if (preg_match('/^(\d+)$/', $text, $matches)) {
                    $equip['element'][in_array($type, [
                        'fire', 'ice', 'water', 'thunder', 'dragon'
                    ]) ? 'attack' : 'status'] = [
                        'type' => $type,
                        'minValue' => (int) $matches[1],
                        'maxValue' => null,
                        'isHidden' => false
                    ];
                }

                break;
            case '鑲嵌槽':
                $equip['slots'] = [];

                foreach ($value->find('img') as $slot) {
                    if (strpos($slot->attr['style'], '066') !== false) {
                        $equip['slots'][] = [
                            'size' => 1
                        ];
                    } elseif (strpos($slot->attr['style'], '067') !== false) {
                        $equip['slots'][] = [
                            'size' => 2
                        ];
                    } elseif (strpos($slot->attr['style'], '068') !== false) {
                        $equip['slots'][] = [
                            'size' => 3
                        ];
                    }
                }

                break;
            case '龍封力':
                if (preg_match('/^龍封力\[(.)\]$/', $text, $matches)) {
                    $equip['elderseal'] = [
                        'affinity' => [
                            '大' => 'high',
                            '中' => 'medium',
                            '小' => 'low'
                        ][$matches[1]]
                    ];
                }

                break;
            case 'skill_id':
                $equip['skills'] = [
                    [
                        'id' => $value->plaintext,
                        'level' => 1
                    ]
                ];

                break;

            // Skipped
            case 'id':
            case 'color':
            case 'wep_ids':
            case 'weapon_type':
            case 'base_model_id':
            case 'music':
            case '客製強化':
            case '特殊彈藥':
            case '偏移':
            case '強化零件':
                break;
            default:
                echo "{$key}\n";
                echo "{$value}\n";

                break;
            }
        }

        if (!isset($equips[$equip['rare']])) {
            $equips[$equip['rare']] = [];
        }

        $equips[$equip['rare']][] = $equip;
    }

    foreach ($equips as $rare => $equip) {
        saveJson("zh/poedb/weapons/{$weaponType}/rare{$rare}", $equip);
    }
}
