#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

$host = 'https://monsterhunterworld.wiki.fextralife.com';
$result = [
    'sets' => [],
    'skills' => []
];

$dom = getDOM("{$host}/Skills");

foreach ($dom->find('#wiki-content-block .col-sm-3 > h5 a.wiki_link') as $item) {
    $name = trim($item->plaintext);
    $list = [];

    echo "Set: {$name}\n";

    $content = getDOM("{$host}{$item->attr['href']}");

    foreach ($content->find('#wiki-content-block ul', 0)->find('li') as $skill) {
        $list[] = trim(html_entity_decode($skill->plaintext));
    }

    $result['sets'][] = [
        'name' => $name,
        'list' => $list
    ];
}

foreach ($dom->find('#wiki-content-block .col-sm-3 > p') as $item) {
    if (!isset($item->attr['style']) || 'text-align: center;' !== $item->attr['style']) {
        continue;
    }

    if (0 === count($item->find('img.lazyload'))) {
        continue;
    }

    $name = trim($item->find('a.wiki_link', 0)->plaintext);
    $list = [];

    echo "Skill: {$name}\n";

    $content = getDOM("{$host}/" . $item->find('a.wiki_link', 0)->attr['href']);

    foreach ($content->find('#wiki-content-block ul', 0)->find('li') as $skill) {
        $list[] = trim(html_entity_decode($skill->plaintext));
    }

    $result['skill'][] = [
        'name' => $name,
        'list' => $list
    ];
}

saveJson('en/monsterhunterworld/sets_skills', $result);
