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

$path = "ja/mhwg/jewel";

if (!isset($result[$path])) {
    $result[$path] = [];
}

$mainDom = getDOM("{$host}/data/4412.html");

foreach ($mainDom->find('.t1') as $index => $item) {
    $name = trim($item->find('tr', 0)->find('td', 0)->plaintext);
    $name = trim(explode("\r\n", $name)[0]);
    $name = str_replace('Ⅱ', 'II', $name);
    $name = str_replace('Ⅲ', 'III', $name);
    $name = str_replace('Ⅳ', 'IV', $name);

    $size = 0;

    if (false !== strrpos($name, '【4】')) {
        $name = str_replace('【4】', '', $name);
        $size = 4;
    } elseif (false !== strrpos($name, '【3】')) {
        $name = str_replace('【3】', '', $name);
        $size = 3;
    } elseif (false !== strrpos($name, '【2】')) {
        $name = str_replace('【2】', '', $name);
        $size = 2;
    } elseif (false !== strrpos($name, '【1】')) {
        $name = str_replace('【1】', '', $name);
        $size = 1;
    }

    echo "{$name}\n";

    $jewel = [
        'id' => $name,
        'name' => [
            'zhTW' => null,
            'jaJP' => $name,
            'enUS' => null
        ],
        'rare' => null,
        'size' => $size,
        'skills' => []
    ];

    $skillA = trim($item->find('tr', 0)->find('td', 1)->plaintext);
    $skill = [];

    foreach (explode(' ', $skillA) as $value) {
        if ('' === $value) {
            continue;
        }

        $skill[] = $value;
    }

    $jewel['skills'][] = [
        'id' => $skill[0],
        'level' => isset($skill[1]) ? (int) $skill[1] : 1
    ];

    $skillB = trim($item->find('tr', 1)->find('td', 0)->plaintext);

    if ('-' !== $skillB) {
        $skill = [];

        foreach (explode(' ', $skillB) as $value) {
            if ('' === $value) {
                continue;
            }

            $skill[] = $value;
        }

        $jewel['skills'][] = [
            'id' => $skill[0],
            'level' => isset($skill[1]) ? (int) $skill[1] : 1
        ];
    }

    $result[$path][] = $jewel;
}

foreach ($result as $path => $list) {
    saveJson($path, $list);
}
