#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'http://mhwg.org';
$list = [
    9 => '/data/3216.html',
    10 => '/data/3217.html',
    11 => '/data/3218.html',
    12 => '/data/3219.html'
];

function removeBOM($str = '')
{
    if (substr($str, 0,3) == pack("CCC",0xef,0xbb,0xbf))
        $str = substr($str, 3);

    return $str;
}

$result = [];

foreach ($list as $rare => $mainUrl) {
    echo "{$rare}: {$mainUrl}\n";

    $mainDom = getDOM("{$host}{$mainUrl}");

    foreach ($mainDom->find('.card-success3') as $item) {
        $name = $item->find('.card-header a', 0)->plaintext;

        echo "{$name}\n";

        $armor = [
            'common' => [
                'rare' => $rare,
                'gender' => 'general',
                'series' => [
                    'zhTW' => null,
                    'jaJP' => $name,
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
            'list' => []
        ];

        $subUrl = $item->find('.card-header a', 0)->attr['href'];
        $subDom = getDOM("{$host}{$subUrl}");

        foreach ($subDom->find('.t1', 1)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('合計' === $row->find('td', 0)->plaintext) {
                continue;
            }

            if (1 === $index) {
                $armor['common']['defense'] = (int) $row->find('td', 1)->plaintext;
                $armor['common']['resistance']['fire'] = (int) $row->find('td', 2)->plaintext;
                $armor['common']['resistance']['water'] = (int) $row->find('td', 3)->plaintext;
                $armor['common']['resistance']['thunder'] = (int) $row->find('td', 4)->plaintext;
                $armor['common']['resistance']['ice'] = (int) $row->find('td', 5)->plaintext;
                $armor['common']['resistance']['dragon'] = (int) $row->find('td', 6)->plaintext;
            }

            $armor['list'][$index] = [
                'id' => $row->find('td', 0)->plaintext,
                'type' => null,
                'name' => [
                    'zhTW' => null,
                    'jaJP' => $row->find('td', 0)->plaintext,
                    'enUS' => null
                ],
                'slots' => null,
                'skills' => null
            ];
        }

        foreach ($subDom->find('.t1', 2)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('合計' === $row->find('td', 0)->plaintext) {
                continue;
            }

            $armor['list'][$index]['type'] = [
                '頭' => 'helm',
                '胴' => 'chest',
                '腕' => 'arm',
                '腰' => 'waist',
                '脚' => 'leg'
            ][$row->find('td', 0)->plaintext];
        }

        foreach ($subDom->find('.t1', 3)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('合計' === $row->find('td', 0)->plaintext) {
                continue;
            }

            $slots = str_split($row->find('td', 1)->plaintext);

            if (0 === sizeof($slots)) {
                $armor['list'][$index]['slots'] = [];

                foreach (str_split($row->find('td', 1)->plaintext) as $size) {
                    $armor['list'][$index]['slots'][] = [
                        'size' => [
                            '④' => 4,
                            '③' => 3,
                            '②' => 2,
                            '①' => 1
                        ][$size]
                    ];
                }
            }

            $skills = explode(' ', $row->find('td', 1)->plaintext);

            if (0 === sizeof($skills)) {
                $armor['list'][$index]['skills'] = [];

                for ($i = 0; $i < size($skills) / 2; $i++) {
                    $armor['list'][$index]['skills'] = [
                        'id' => $skills[$i * 2],
                        'level' => (int) $skills[$i * 2 + 1]
                    ];
                }
            }
        }

        foreach ($subDom->find('.t1', 5)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('無し' === $row->find('td', 0)->plaintext) {
                continue;
            }

            $armor['common']['set'] = $row->find('td', 0)->plaintext;
        }

        $path = "ja/mhwg/armor/rare{$rare}";

        if (!isset($result[$path])) {
            $result[$path] = [];
        }

        $armor['list'] = array_values($armor['list']);

        $result[$path][] = $armor;
    }
}

foreach ($result as $path => $list) {
    saveJson($path, $list);
}
