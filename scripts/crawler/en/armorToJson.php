#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../common.php";

$host = 'https://monsterhunterworld.wiki.fextralife.com';
$result = [
    'sets' => [],
    'skills' => []
];

$dom = parseHTML(getHTML("{$host}/Skills"));

foreach ($dom->find('#wiki-content-block .col-sm-3 > h5 a.wiki_link') as $item) {
    $name = $item->plaintext;
    $link = "{$host}{$item->attr['href']}";
    $list = [];

    echo "Set: {$name}\n";

    // $content = parseHTML(getHTML($link));

    // foreach ($content->find('#wiki-content-block ul', 0)->find('li') as $skill) {
    //     $list[] = $skill->plaintext;
    // }

    $result['sets'][] = [
        'name' => $name,
        'link' => $link,
        // 'list' => $list
    ];
}

foreach ($dom->find('#wiki-content-block .col-sm-3 > p') as $item) {
    if (!isset($item->attr['style']) || 'text-align: center;' !== $item->attr['style']) {
        continue;
    }

    if (0 === count($item->find('img.lazyload'))) {
        continue;
    }

    $name = $item->find('a.wiki_link', 0)->plaintext;
    $link = $item->find('a.wiki_link', 0)->attr['href'];
    $link = "{$host}/{$link}";
    $list = [];

    echo "Skill: {$name}\n";

    $content = parseHTML(getHTML($link));

    foreach ($content->find('#wiki-content-block ul', 0)->find('li') as $skill) {
        $list[] = $skill->plaintext;
    }

    $result['skill'][] = [
        'name' => $name,
        'link' => $link,
        'list' => $list
    ];
}

if (!file_exists("{$root}/../../temp")) {
    mkdir("{$root}/../../temp");
}

file_put_contents(
    "{$root}/../../temp/en-sets_skills.json",
    json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);
