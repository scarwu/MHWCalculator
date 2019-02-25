#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../common.php";

$host = 'http://mhwg.org';
$list = [
    [
        'greatSword' => "{$host}/data/4000.html",
        'longSword' => "{$host}/data/4001.html",
        'swordAndShield' => "{$host}/data/4002.html",
        'dualBlades' => "{$host}/data/4003.html",
        'hammer' => "{$host}/data/4004.html",
        'lance' => "{$host}/data/4006.html",
    ],
    [
        'huntingHorn' => "{$host}/data/4005.html",
        'gunlance' => "{$host}/data/4007.html",
        'switchAxe' => "{$host}/data/4008.html",
        'chargeBlade' => "{$host}/data/4009.html",
        'insectGlaive' => "{$host}/data/4010.html",
    ],
    [
        'lightBowgun' => "{$host}/data/4011.html",
        'heavyBowgun' => "{$host}/data/4012.html",
    ],
    [
        'bow' => "{$host}/data/4013.html"
    ]
];

function filter ($text)
{
    return trim(str_replace([
        ' ', '[生産]', '┃', '┣', '┗', '&ensp;'
    ], '', $text));
}

$result = [];

foreach ($list[0] as $type => $url) {
    echo "$type\n";

    $dom = getDOM($url);
    $series = null;

    foreach ($dom->find('.t1', 0)->find('tr') as $index => $item) {
        if (0 === $index) {
            continue;
        }

        $count = count($item->find('td'));

        if (5 !== $count && 6 !== $count) {
            continue;
        }

        $offset = 0;

        if (6 === $count) {
            $offset = 1;
            $series = filter($item->find('td', 0)->plaintext);
        }

        $rare = (int) substr($item->find('td', $offset + 0)->find('.wp_img', 0)->attr['src'], -5, 1);
        $name = filter($item->find('td', $offset + 0)->plaintext);
        $attack = (int) filter($item->find('td', $offset + 1)->plaintext);
        $criticalRate = 0;
        $defense = 0;
        $element = [
            'attack' => null,
            'status' => null
        ];
        $elderseal = null;
        $skills = null;

        $attrs = explode("\r\n", filter($item->find('td', $offset + 2)->plaintext));
        $attrs = array_filter($attrs, function ($attr) {
            return '' !== $attr;
        });

        foreach ($attrs as $attr) {
            if (preg_match('/^\((火|水|雷|氷|龍)(\d+)\)$/', $attr, $matches)) {
                $element['attack'] = [
                    'name' => $matches[1],
                    'minValue' => (int) $matches[2],
                    'maxValue' => null,
                    'isHidden' => true
                ];
            } elseif (preg_match('/^(火|水|雷|氷|龍)(\d+)$/', $attr, $matches)) {
                $element['attack'] = [
                    'name' => $matches[1],
                    'minValue' => (int) $matches[2],
                    'maxValue' => null,
                    'isHidden' => false
                ];
            } elseif (preg_match('/^\((毒|麻痺|睡眠|爆破)(\d+)\)$/', $attr, $matches)) {
                $element['status'] = [
                    'name' => $matches[1],
                    'minValue' => (int) $matches[2],
                    'maxValue' => null,
                    'isHidden' => true
                ];
            } elseif (preg_match('/^(毒|麻痺|睡眠|爆破)(\d+)$/', $attr, $matches)) {
                $element['status'] = [
                    'name' => $matches[1],
                    'minValue' => (int) $matches[2],
                    'maxValue' => null,
                    'isHidden' => false
                ];
            } elseif (preg_match('/^龍封力\[(小|中|大)\]$/', $attr, $matches)) {
                $elderseal = [
                    'affinity' => $matches[1]
                ];
            } elseif (preg_match('/^防御([-|+]\d+)$/', $attr, $matches)) {
                $defense = (int) $matches[1];
            } elseif (preg_match('/^会心((?:-)?\d+)\%$/', $attr, $matches)) {
                $criticalRate = (int) $matches[1];
            } else {
                if (null === $skills) {
                    $skills = [];
                }

                $skills[] = [
                    'name' => $attr,
                    'level' => 1
                ];
            }
        }

        $sharpness = [
            'red' => strlen($item->find('td', $offset + 3)->find('.kr0', 1)->plaintext) * 10,
            'orange' => strlen($item->find('td', $offset + 3)->find('.kr1', 1)->plaintext) * 10,
            'yellow' => strlen($item->find('td', $offset + 3)->find('.kr2', 1)->plaintext) * 10,
            'green' => (0 !== count($item->find('td', $offset + 3)->find('.kr3')))
                ? strlen($item->find('td', $offset + 3)->find('.kr3', 1)->plaintext) * 10 : 0,
            'blue' => (0 !== count($item->find('td', $offset + 3)->find('.kr4')))
                ? strlen($item->find('td', $offset + 3)->find('.kr4', 1)->plaintext) * 10 : 0,
            'white' => (0 !== count($item->find('td', $offset + 3)->find('.kr5')))
                ? strlen($item->find('td', $offset + 3)->find('.kr5', 1)->plaintext) * 10 : 0
        ];
        $sharpness = [
            'value' => array_reduce(array_values($sharpness), function ($a, $b) {
                return $a + $b;
            }),
            'steps' => $sharpness
        ];

        $slots = filter($item->find('td', $offset + 4)->plaintext);
        $slots = ('---' !== $slots)
            ? array_map(function ($size) {
                return [
                    'size' => (int) $size
                ];
            }, explode(':', trim(str_replace([
                '①', '②', '③'
            ], [
                '1:', '2:', '3:'
            ], $slots), ':')))
            : null;

        $result[] = [
            'id' => null,
            'type' => $type,
            'rare' => $rare,
            'series' => $series,
            'name' => $name,
            'attack' => $attack,
            'criticalRate' => $criticalRate,
            'defense' => $defense,
            'sharpness' => $sharpness,
            'element' => $element,
            'elderseal' => $elderseal,
            'slots' => $slots,
            'skills' => $skills
        ];
    }
}

saveJson('ja/weapons', $result);
