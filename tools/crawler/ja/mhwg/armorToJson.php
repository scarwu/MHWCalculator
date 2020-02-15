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
        $name = trim($item->find('.card-header a', 0)->plaintext);
        $name = rtrim($name, 'シリーズ');

        echo "{$name}\n";

        $armor = [
            'series' => [
                'id' => $name,
                'name' => [
                    'zhTW' => null,
                    'jaJP' => $name,
                    'enUS' => null
                ],
                'rare' => $rare,
                'gender' => 'general',
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
            'items' => []
        ];

        $subUrl = $item->find('.card-header a', 0)->attr['href'];
        $subDom = getDOM("{$host}{$subUrl}");

        foreach ($subDom->find('.t1', 1)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('合計' === trim($row->find('td', 0)->plaintext)) {
                continue;
            }

            if (1 === $index) {
                $armor['series']['defense'] = (int) trim($row->find('td', 1)->plaintext);
                $armor['series']['resistance']['fire'] = (int) trim($row->find('td', 2)->plaintext);
                $armor['series']['resistance']['water'] = (int) trim($row->find('td', 3)->plaintext);
                $armor['series']['resistance']['thunder'] = (int) trim($row->find('td', 4)->plaintext);
                $armor['series']['resistance']['ice'] = (int) trim($row->find('td', 5)->plaintext);
                $armor['series']['resistance']['dragon'] = (int) trim($row->find('td', 6)->plaintext);
            }

            $armor['items'][$index] = [
                'id' => trim($row->find('td', 0)->plaintext),
                'name' => [
                    'zhTW' => null,
                    'jaJP' => trim($row->find('td', 0)->plaintext),
                    'enUS' => null
                ],
                'type' => null,
                'slots' => null,
                'skills' => null
            ];
        }

        foreach ($subDom->find('.t1', 2)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('合計' === trim($row->find('td', 0)->plaintext)) {
                continue;
            }

            $armor['items'][$index]['type'] = [
                '頭' => 'helm',
                '胴' => 'chest',
                '腕' => 'arm',
                '腰' => 'waist',
                '脚' => 'leg'
            ][$row->find('td', 0)->plaintext];
        }

        foreach ($subDom->find('.t1', 4)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('合計' === trim($row->find('td', 0)->plaintext)) {
                continue;
            }

            $slots = trim($row->find('td', 1)->plaintext);

            if (0 < strlen($slots)) {
                $armor['items'][$index]['slots'] = array_map(function ($size) {
                    return [
                        'size' => (int) $size
                    ];
                }, explode(':', trim(str_replace([
                    '①', '②', '③', '④'
                ], [
                    '1:', '2:', '3:', '4:'
                ], $slots), ':')));
            }

            $skills = [];

            foreach (explode(' ', trim($row->find('td', 2)->plaintext)) as $value) {
                if ('' === $value) {
                    continue;
                }

                $skills[] = $value;
            }

            if (0 !== sizeof($skills)) {
                $armor['items'][$index]['skills'] = [];

                for ($i = 0; $i < sizeof($skills) / 2; $i++) {
                    $armor['items'][$index]['skills'][] = [
                        'id' => $skills[$i * 2],
                        'level' => (int) $skills[$i * 2 + 1]
                    ];
                }
            }
        }

        foreach ($subDom->find('.t1', 6)->find('tbody tr') as $index => $row) {
            if (0 === $index) {
                continue;
            }

            if ('無し' === trim($row->find('td', 0)->plaintext)) {
                continue;
            }

            $armor['series']['set'] = [
                'id' => trim($row->find('td', 0)->plaintext)
            ];
        }

        $path = "ja/mhwg/armor/rare{$rare}";

        if (!isset($result[$path])) {
            $result[$path] = [];
        }

        $armor['items'] = array_values($armor['items']);

        $result[$path][] = $armor;
    }
}

foreach ($result as $path => $list) {
    saveJson($path, $list);
}
