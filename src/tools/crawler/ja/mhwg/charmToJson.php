#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'http://mhwg.org';
$result = [
    'mhw' => [],
    'mhwib' => []
];

$mainDom = getDOM("{$host}/data/4210.html");

foreach ($mainDom->find('.card-header') as $index => $item) {

    $name = trim($item->plaintext);
    $name = trim(explode(" ", $name)[0]);
    $url = $item->find('a', 0)->attr['href'];

    echo "{$name}: {$url}\n";

    $chrams = [];

    $subDom = getDOM("{$host}{$url}");

    foreach ($subDom->find('.t1', 0)->find('tr') as $index => $item) {
        if (0 === $index) {
            continue;
        }

        $isIB = false;

        $name = trim($item->find('td', 0)->plaintext);
        $name = trim(explode("\r\n", $name)[0]);
        $name = str_replace('Ⅰ', 'I', $name);
        $name = str_replace('Ⅱ', 'II', $name);
        $name = str_replace('Ⅲ', 'III', $name);
        $name = str_replace('Ⅳ', 'IV', $name);
        $name = str_replace('Ⅴ', 'V', $name);

        if (false !== strpos($name, '[IB]')) {
            $isIB = true;
            $name = trim(explode('[IB]', $name)[0]);
        }

        $rare = (int) trim($item->find('td', 1)->plaintext);

        $chrams[$index - 1] = [
            "id" => $name,
            "name" => [
                "zhTW" => null,
                "jaJP" => $name,
                "enUS" => null
            ],
            "rare" => $rare,
            "skills" => [],
            "isIB" => $isIB
        ];
    }

    foreach ($subDom->find('.t1', 1)->find('tr') as $index => $item) {
        if (0 === $index) {
            continue;
        }

        $skills = trim($item->find('td', 1)->plaintext);
        $skills = str_replace(' +', ':', $skills);
        $skills = explode(' ', $skills);
        $skills = array_filter($skills, function ($text) {
            return '' !== $text;
        });
        $skills = array_map(function ($text) {
            return [
                'id' => explode(':', $text)[0],
                'level' => (int) explode(':', $text)[1]
            ];
        }, $skills);

        $chrams[$index - 1]['skills'] = $skills;
    }

    foreach ($chrams as $chram) {
        if ($chram['isIB']) {
            unset($chram['isIB']);
            $result['mhwib'][] = $chram;
        } else {
            unset($chram['isIB']);
            $result['mhw'][] = $chram;
        }
    }
}

saveJson("ja/mhwg/chram", $result);
