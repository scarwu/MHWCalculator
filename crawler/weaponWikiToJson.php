#!/usr/bin/env php
<?php

error_reporting(E_ALL);

$root = __DIR__;

// Composer Auto Loader
include "{$root}/vendor/autoload.php";

function getHTML($url)
{
    $client = curl_init();

    curl_setopt($client, CURLOPT_URL, $url);
    curl_setopt($client, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($client, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($client, CURLOPT_SSL_VERIFYPEER, false);

    $html = curl_exec($client);

    curl_close($client);

    return $html;
}

function parseHTML($str)
{
    $dom = new \Sunra\PhpSimple\HtmlDomParser();

    $lowercase = true;
    $forceTagsClosed = true;
    $targetCharset = DEFAULT_TARGET_CHARSET;
    $stripRN = true;
    $defaultBRText = DEFAULT_BR_TEXT;
    $defaultSpanText = DEFAULT_SPAN_TEXT;

    $dom= new \simplehtmldom_1_5\simple_html_dom(
        null,
        $lowercase,
        $forceTagsClosed,
        $targetCharset,
        $stripRN,
        $defaultBRText,
        $defaultSpanText
    );

    if (empty($str)) {
        $dom->clear();

        return false;
    }

    $dom->load($str, $lowercase, $stripRN);

    return $dom;
}

$host = 'https://www.mhchinese.wiki';

$urlMapping = [
    "greatSword" => "{$host}/weapons/final/great_swords",
    "longSword" => "{$host}/weapons/final/long_sword",
    "swordAndShield" => "{$host}/weapons/final/sword_shield",
    "dualSlades" => "{$host}/weapons/final/dual_blades",
    "hammer" => "{$host}/weapons/final/hammer",
    "huntingHorn" => "{$host}/weapons/final/hunting_horn",
    "lance" => "{$host}/weapons/final/lances",
    "gunlance" => "{$host}/weapons/final/gunlance",
    "switchAxe" => "{$host}/weapons/final/switch_ace",
    "chargeBlade" => "{$host}/weapons/final/charge_blade",
    "insectGlaive" => "{$host}/weapons/final/insect_glaive",
    "lightBowgun" => "{$host}/weapons/final/light_bowgun",
    "heavyBowgun" => "{$host}/weapons/final/heavy_bowgun",
    "bow" => "{$host}/weapons/final/bow"
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

$allEquips = [];

foreach ($urlMapping as $weaponType => $url) {
    echo "{$typeMapping[$weaponType]}: {$url}\n";

    $dom = parseHTML(getHTML($url));

    foreach ($dom->find('.content-filter-weapon-target') as $index => $row) {
        if (in_array($weaponType, [
            'greatSword',
            'longSword',
            'swordAndShield',
            'dualSlades',
            'hammer',
            'lance'
        ])) {
            $series = trim($row->find('td', 0)->plaintext);
            $name = trim($row->find('td', 1)->plaintext);
            $attack = trim($row->find('td', 2)->plaintext);
            $criticalRate = trim($row->find('td', 3)->plaintext);
            $sharpnessBlock = $row->find('td', 4);
            $property = trim($row->find('td', 5)->plaintext);
            $slots = trim($row->find('td', 6)->plaintext);
        }

        if (in_array($weaponType, [
            'huntingHorn'
        ])) {
            $series = trim($row->find('td', 0)->plaintext);
            $name = trim($row->find('td', 1)->plaintext);
            $attack = trim($row->find('td', 2)->plaintext);
            $criticalRate = trim($row->find('td', 3)->plaintext);
            // pass
            $sharpnessBlock = $row->find('td', 5);
            $property = trim($row->find('td', 6)->plaintext);
            $slots = trim($row->find('td', 7)->plaintext);
        }

        if (in_array($weaponType, [
            'chargeBlade'
        ])) {
            $series = trim($row->find('td', 0)->plaintext);
            $name = trim($row->find('td', 1)->plaintext);
            $attack = trim($row->find('td', 2)->plaintext);
            $criticalRate = trim($row->find('td', 3)->plaintext);
            $sharpnessBlock = $row->find('td', 4);
            // pass
            $property = trim($row->find('td', 6)->plaintext);
            $slots = trim($row->find('td', 7)->plaintext);
        }

        if (in_array($weaponType, [
            'switchAxe',
            'gunlance',
            'insectGlaive'
        ])) {
            $series = trim($row->find('td', 0)->plaintext);
            $name = trim($row->find('td', 1)->plaintext);
            $attack = trim($row->find('td', 2)->plaintext);
            $criticalRate = trim($row->find('td', 3)->plaintext);
            $sharpnessBlock = $row->find('td', 4);
            $property = trim($row->find('td', 5)->plaintext);
            // pass
            $slots = trim($row->find('td', 7)->plaintext);
        }

        if (in_array($weaponType, [
            'lightBowgun'
        ])) {
            $series = trim($row->find('td', 0)->plaintext);
            $name = trim($row->find('td', 1)->plaintext);
            $attack = trim($row->find('td', 2)->plaintext);
            $criticalRate = trim($row->find('td', 3)->plaintext);
            $sharpnessBlock = null;
            $element = null;
            // pass
            // pass
            $slots = trim($row->find('td', 6)->plaintext);
        }

        if (in_array($weaponType, [
            'heavyBowgun'
        ])) {
            $series = trim($row->find('td', 0)->plaintext);
            $name = trim($row->find('td', 1)->plaintext);
            $attack = trim($row->find('td', 2)->plaintext);
            $criticalRate = trim($row->find('td', 3)->plaintext);
            $sharpnessBlock = null;
            $element = null;
            // pass
            // pass
            // pass
            $slots = trim($row->find('td', 7)->plaintext);
        }

        if (in_array($weaponType, [
            'bow'
        ])) {
            $series = trim($row->find('td', 0)->plaintext);
            $name = trim($row->find('td', 1)->plaintext);
            $attack = trim($row->find('td', 2)->plaintext);
            $criticalRate = trim($row->find('td', 3)->plaintext);
            $sharpnessBlock = null;
            // pass
            $property = trim($row->find('td', 5)->plaintext);
            $slots = trim($row->find('td', 6)->plaintext);
        }

        $name = str_replace(' ', '', $name);
        $name = str_replace('III', 'Ⅲ', $name);
        $name = str_replace('II', 'Ⅱ', $name);
        $name = str_replace('I', 'Ⅰ', $name);
        $name = str_replace('Ⅲ', ' III', $name);
        $name = str_replace('Ⅱ', ' II', $name);
        $name = str_replace('Ⅰ', ' I', $name);

        $equip = [
            'name' => $name,
            'type' => $typeMapping[$weaponType],
            'series' => $series,
            'attack' => (int) $attack,
            'criticalRate' => (int) trim($criticalRate, '%'),
            'defense' => 0,
            'sharpness' => null,
            'element' => null,
            'elderseal' => null,
            'slots' => []
        ];

        if (null !== $sharpnessBlock) {
            $equip['sharpness'] = [
                'value' => 0,
                'steps' => [
                    'red' => 0,
                    'orange' => 0,
                    'yellow' => 0,
                    'green' => 0,
                    'blue' => 0,
                    'white' => 0
                ]
            ];

            foreach ($sharpnessBlock->find('.sharpness', 0)->find('div') as $index => $div) {
                if (!preg_match('/^width: (\d+)px;$/', $div->style, $matches)) {
                    continue;
                }

                $equip['sharpness']['value'] += ((int) $matches[1]) * 2;
            }

            foreach ($sharpnessBlock->find('.sharpness', 1)->find('div') as $index => $div) {
                if (!preg_match('/^width: (\d+)px;$/', $div->style, $matches)) {
                    continue;
                }

                if (!isset($sharpnessList[$index])) {
                    continue;
                }

                $equip['sharpness']['steps'][$sharpnessList[$index]] = ((int) $matches[1]) * 2;
            }
        }

        foreach (explode(' ', $property) as $text) {
            if (preg_match('/^\((.+?)(\d+)\)$/', trim($text), $matches)) {
                $equip['element'] = [
                    'type' => $matches[1],
                    'value' => (int) $matches[2],
                    'isHidden' => true
                ];
            }

            if (preg_match('/^(.+?)(\d+)$/', trim($text), $matches)) {
                $equip['element'] = [
                    'type' => $matches[1],
                    'value' => (int) $matches[2],
                    'isHidden' => false
                ];
            }

            if (preg_match('/^.+?\[(.+)\]$/', trim($text), $matches)) {
                $equip['elderseal'] = [
                    'affinity' => $matches[1]
                ];
            }
        }

        foreach (explode(' ', $slots) as $slot) {
            if ('-' === $slot) {
                continue;
            }

            if ('①' === $slot) {
                $equip['slots'][] = [
                    'size' => 1
                ];
            }

            if ('②' === $slot) {
                $equip['slots'][] = [
                    'size' => 2
                ];
            }

            if ('③' === $slot) {
                $equip['slots'][] = [
                    'size' => 3
                ];
            }
        }

        $allEquips[$name] = $equip;
    }
}

if (!file_exists("{$root}/../temp")) {
    mkdir("{$root}/../temp");
}

$json = json_encode($allEquips, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents("{$root}/../temp/weapon.json", $json);
