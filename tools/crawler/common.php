<?php

error_reporting(E_ALL);

// Composer Auto Loader
include __DIR__ . '/../vendor/autoload.php';

function getDOM ($url)
{
    return parseHTML(getHTML($url));
}

function getHTML ($url)
{
    $refer = [
        'https://www.google.com.tw/',
        'https://tw.yahoo.com/',
        'https://www.facebook.com/'
    ];

    $agent = [
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.125 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'
    ];

    $client = curl_init();

    curl_setopt($client, CURLOPT_URL, $url);
    curl_setopt($client, CURLOPT_REFERER, $refer[rand() % count($refer)]);
    curl_setopt($client, CURLOPT_USERAGENT, $agent[rand() % count($agent)]);
    curl_setopt($client, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($client, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($client, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($client, CURLOPT_ENCODING , "");

    $html = curl_exec($client);

    curl_close($client);

    return $html;
}

function parseHTML ($str)
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

function saveJson ($name, $data)
{
    $path = __DIR__ . "/../temp/{$name}.json";
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    @mkdir(dirname($path), 0755, true);

    return file_put_contents($path, $json);
}

function loadJson ($name)
{
    $path = __DIR__ . "/../temp/{$name}.json";
    $json = file_get_contents($path);

    return json_decode($json, true);
}
