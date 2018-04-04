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
    echo "{$item->plaintext}: {$host}{$item->href}\n";

    $url = "{$host}{$item->href}";
    $subDom = parseHTML(getHTML($url));
    $tableCount = count($subDom->find('.simple-table'));

    $equips = [];
    $set = null;

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

                if (!isset($equips[$name])) {
                    $equips[$name] = [
                        'name' => null,
                        'type' => null,
                        'rare' => 0,
                        'gender' => null,
                        'defense' => [
                            'min' => 0,
                            'max' => 0
                        ],
                        'resistance' => [
                            'fire' => 0,
                            'water' => 0,
                            'thunder' => 0,
                            'ice' => 0,
                            'dragon' => 0
                        ],
                        'slots' => [],
                        'skills' => [],
                        'set' => [
                            'name' => null,
                            'skills' => []
                        ],
                        'price' => 0
                    ];
                }

                $equips[$name]['name'] = $name;
                $equips[$name]['rare'] = (int) $rare;
                $equips[$name]['gender'] = $gender;
                $equips[$name]['defense']['min'] = (int) $minDef;
                $equips[$name]['defense']['max'] = (int) $maxDef;
                $equips[$name]['resistance']['fire'] = (int) $fireResist;
                $equips[$name]['resistance']['water'] = (int) $waterResist;
                $equips[$name]['resistance']['thunder'] = (int) $thunderResist;
                $equips[$name]['resistance']['ice'] = (int) $iceResist;
                $equips[$name]['resistance']['dragon'] = (int) $dragonResist;

                if (false !== strpos($name, '頭')
                    || false !== strpos($name, '頭飾')
                    || false !== strpos($name, '頭套')
                    || false !== strpos($name, '頭盔')
                    || false !== strpos($name, '護目鏡')
                    || false !== strpos($name, '護頭')
                    || false !== strpos($name, '墨鏡')
                    || false !== strpos($name, '面罩')
                    || false !== strpos($name, '耳環')
                    || false !== strpos($name, '眼帶')
                    || false !== strpos($name, '突擊龍角')
                    || false !== strpos($name, '麒麟角')
                    || false !== strpos($name, '爆碎的羽飾')
                    || false !== strpos($name, '龍王的獨眼')
                    || false !== strpos($name, '知性眼鏡')) {

                    $equips[$name]['type'] = '頭';
                } elseif (false !== strpos($name, '身')
                    || false !== strpos($name, '皮')
                    || false !== strpos($name, '上身')
                    || false !== strpos($name, '斗篷')
                    || false !== strpos($name, '服飾')
                    || false !== strpos($name, '鎧甲')) {

                    $equips[$name]['type'] = '身';
                } elseif (false !== strpos($name, '手')
                    || false !== strpos($name, '護袖')
                    || false !== strpos($name, '鋼爪')
                    || false !== strpos($name, '護手')
                    || false !== strpos($name, '腕甲')) {

                    $equips[$name]['type'] = '手';
                } elseif (false !== strpos($name, '腰')
                    || false !== strpos($name, '護腰')
                    || false !== strpos($name, '脊椎')
                    || false !== strpos($name, '腰甲')
                    || false !== strpos($name, '腰環')) {

                    $equips[$name]['type'] = '腰';
                } elseif (false !== strpos($name, '腿')
                    || false !== strpos($name, '腳')
                    || false !== strpos($name, '靴')
                    || false !== strpos($name, '護腿')
                    || false !== strpos($name, '護脛')) {

                    $equips[$name]['type'] = '腿';
                } else {
                    echo "{$name}\n";
                }
            }
        }

        if (6 === $tableCount && 2 === $tableIndex) {
            $set = [
                'name' => null,
                'skills' => []
            ];

            foreach ($table->find('tr') as $rowIndex => $row) {
                if (0 === $rowIndex) {
                    continue;
                }

                if (1 === $rowIndex) {
                    $name = trim($row->find('td', 0)->plaintext);

                    $set['name'] = $name;

                    continue;
                } else {
                    $skillKey = trim($row->find('td', 0)->plaintext);
                    $require = trim($row->find('td', 1)->plaintext);

                    $set['skills'][] = [
                        'key' => $skillKey,
                        'require' => (int) $require
                    ];
                }
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
                        $equips[$name]['slots'][] = [
                            'size' => 1
                        ];
                    }

                    if ('②' === $slot) {
                        $equips[$name]['slots'][] = [
                            'size' => 2
                        ];
                    }

                    if ('③' === $slot) {
                        $equips[$name]['slots'][] = [
                            'size' => 3
                        ];
                    }
                }

                if (0 !== strlen($skills)) {
                    foreach (explode(' ', $skills) as $skill) {
                        list($skillKey, $skillLevel) = explode('+', $skill);

                        $equips[$name]['skills'][] = [
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

    foreach ($equips as $key => $equip) {
        if (null !== $set) {
            $equip['set'] = $set;
        }

        $equip['price'] = (int) trim($price, 'z');
        $allEquiqs[$key] = $equip;
    }
}

if (!file_exists("{$root}/../temp")) {
    mkdir("{$root}/../temp");
}

$json = json_encode($allEquiqs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents("{$root}/../temp/armor.json", $json);
