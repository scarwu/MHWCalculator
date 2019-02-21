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

$host = 'https://monsterhunterworld.wiki.fextralife.com';
$result = [];

$dom = parseHTML(getHTML("{$host}/Charms"));

foreach ($dom->find('.wiki_table tr') as $index => $item) {
    if (0 === $index) {
        continue;
    }

    $name = trim($item->find('td', 1)->plaintext);
    $desciption = trim(html_entity_decode($item->find('td', 2)->plaintext));

    echo "Charm: {$name}\n";

    $result[] = [
        'name' => $name,
        'desciption' => $desciption
    ];
}

if (!file_exists("{$root}/../../temp")) {
    mkdir("{$root}/../../temp");
}

file_put_contents(
    "{$root}/../../temp/en-charms.json",
    json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);
