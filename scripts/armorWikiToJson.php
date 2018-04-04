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

$url = "{$host}/equipments";
$mainDom = parseHTML(getHTML($url));

$allEquiqs = [];
$genderMapping = [
    '女性専用' => 'female',
    '男性専用' => 'male',
    '男女共用' => 'general'
];

foreach ($mainDom->find('a.tip') as $item) {
    echo "{$item->plaintext}: {$item->href}\n";

    $url = "{$host}{$item->href}";
    $subDom = parseHTML(getHTML($url));
    $equips = [];

    $tableCount = count($subDom->find('.simple-table'));

    foreach ($subDom->find('.simple-table') as $tableIndex => $table) {
        if (0 === $tableIndex) {
            foreach ($table->find('tr') as $rowIndex => $row) {
                if (0 === $rowIndex) {
                    continue;
                }

                $rare = trim($row->find('td', 1)->plaintext);

                // 女性専用, 男性専用, 男女共用
                $gender = trim($row->find('td', 2)->plaintext);
                $gender = $genderMapping[$gender];
            }
        }

        if (1 === $tableIndex) {
            foreach ($table->find('tr') as $rowIndex => $row) {
                if (0 === $rowIndex) {
                    continue;
                }

                $name = trim($row->find('td', 0)->plaintext);
                $minDef = trim($row->find('td', 1)->plaintext);
                $maxDef = trim($row->find('td', 2)->plaintext);
                $fireResist = trim($row->find('td', 3)->plaintext);
                $waterResist = trim($row->find('td', 4)->plaintext);
                $thunderResist = trim($row->find('td', 5)->plaintext);
                $iceResist = trim($row->find('td', 6)->plaintext);
                $dragonResist = trim($row->find('td', 7)->plaintext);

                if ('總共' === $name) {
                    continue;
                }

                if (!isset($equiqs[$name])) {
                    $equiqs[$name] = [
                        'name' => null,
                        'rare' => 0,
                        'gender' => null,
                        'defense' => [
                            'min' => 0,
                            'min' => 0
                        ],
                        'resistence' => [
                            'fire' => 0,
                            'water' => 0,
                            'thunder' => 0,
                            'ice' => 0,
                            'dragon' => 0
                        ],
                        'slots' => [],
                        'skills' => [],
                        'price' => 0
                    ];
                }

                $equiqs[$name]['name'] = $name;
                $equiqs[$name]['rare'] = (int) $rare;
                $equiqs[$name]['gender'] = $gender;
                $equiqs[$name]['defense']['min'] = (int) $minDef;
                $equiqs[$name]['defense']['max'] = (int) $maxDef;
                $equiqs[$name]['resistence']['fire'] = (int) $fireResist;
                $equiqs[$name]['resistence']['water'] = (int) $waterResist;
                $equiqs[$name]['resistence']['thunder'] = (int) $thunderResist;
                $equiqs[$name]['resistence']['ice'] = (int) $iceResist;
                $equiqs[$name]['resistence']['dragon'] = (int) $dragonResist;
            }
        }

        if ((5 === $tableCount && 2 === $tableIndex)
            || (6 === $tableCount && 3 === $tableIndex)) {

            foreach ($table->find('tr') as $rowIndex => $row) {
                if (0 === $rowIndex) {
                    continue;
                }

                $name = trim($row->find('td', 0)->plaintext);
                $slots = trim($row->find('td', 1)->plaintext);
                $skills = trim($row->find('td', 2)->plaintext);

                if ('總共' === $name) {
                    continue;
                }

                foreach (explode(' ', $slots) as $slot) {
                    if ('-' === $slot) {
                        continue;
                    }

                    if ('①' === $slot) {
                        $equiqs[$name]['slots'][] = [
                            'size' => 1
                        ];
                    }

                    if ('②' === $slot) {
                        $equiqs[$name]['slots'][] = [
                            'size' => 2
                        ];
                    }

                    if ('③' === $slot) {
                        $equiqs[$name]['slots'][] = [
                            'size' => 3
                        ];
                    }
                }

                if (0 !== strlen($skills)) {
                    foreach (explode(' ', $skills) as $skill) {
                        list($skillKey, $skillLevel) = explode('+', $skill);

                        $equiqs[$name]['skills'][] = [
                            'key' => $skillKey,
                            'level' => (int) $skillLevel
                        ];
                    }
                }
            }
        }

        if ((5 === $tableCount && 3 === $tableIndex)
            || (6 === $tableCount && 4 === $tableIndex)) {

            foreach ($table->find('tr') as $rowIndex => $row) {
                if (0 === $rowIndex) {
                    continue;
                }

                $price = trim($row->find('td', 0)->plaintext);
            }
        }

        if ((5 === $tableCount && 4 === $tableIndex)
            || (6 === $tableCount && 5 === $tableIndex)) {

            foreach ($table->find('tr') as $rowIndex => $row) {
                if (0 === $rowIndex) {
                    continue;
                }

                $name = trim($row->find('td', 0)->plaintext);

                if ('總共' === $name) {
                    continue;
                }

                // pass
            }
        }
    }

    foreach ($equiqs as $key => $equip) {
        $equip['price'] = (int) trim($price, 'z');
        $allEquiqs[$key] = $equip;
    }
}

$json = json_encode($allEquiqs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents("{$root}/../src/assets/json/armor.json", $json);

echo $json;