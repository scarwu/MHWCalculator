#!/usr/bin/env php
<?php

error_reporting(E_ALL);

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../vendor/autoload.php";

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

if (!file_exists("{$root}/../../temp")) {
    mkdir("{$root}/../../temp");
}

$host = 'https://monsterhunterworld.wiki.fextralife.com';

// Set & Skill
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

    $content = parseHTML(getHTML($link));

    foreach ($content->find('#wiki-content-block ul', 0)->find('li') as $skill) {
        $list[] = $skill->plaintext;
    }

    $result['sets'][] = [
        'name' => $name,
        'link' => $link,
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

    $name = $item->find('a.wiki_link', 0)->plaintext;
    $link = $item->find('a.wiki_link', 0)->attr['href'];
    $link = "{$host}/{$link}";
    $list = [];

    echo "Skill: {$name}\n";

    $content = parseHTML(getHTML($link));

    foreach ($content->find('#wiki-content-block ul', 0)->find('li') as $skill) {
        $list[] = $skill->plaintext;
    }

    $result['list'][] = [
        'name' => $name,
        'link' => $link,
        'list' => $list
    ];
}

file_put_contents(
    "{$root}/../../temp/en-sets_skills.json",
    json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

exit();

// Jewel
$dom = parseHTML(getHTML("{$host}/Jewels"));

// Charm
$dom = parseHTML(getHTML("{$host}/Charms"));

// Armor
$dom = parseHTML(getHTML("{$host}/Armors"));

// Weapon
$dom = parseHTML(getHTML("{$host}/Weapons"));

