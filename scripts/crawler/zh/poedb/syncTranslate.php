#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

foreach ([
    "greatSword",
    "longSword",
    "swordAndShield",
    "dualBlades",
    "hammer",
    "huntingHorn",
    "lance",
    "gunlance",
    "switchAxe",
    "chargeBlade",
    "insectGlaive",
    "lightBowgun",
    "heavyBowgun",
    "bow"
] as $type) {
    foreach ([ 6, 7, 8 ] as $rare) {
        $rawEquips = loadJson("../json/weapons/{$type}/rare{$rare}");
        $tmpEquips = loadJson("zh/poedb/weapons/{$type}/rare{$rare}");

        $mapping = [];

        foreach ($tmpEquips as $equip) {
            $mapping[$equip['id']] = [
                'name' => $equip['name'],
                'series' => $equip['series']
            ];
        }

        foreach ($rawEquips as $index => $equip) {
            if (false === isset($mapping[$equip['id']])) {
                continue;
            }

            if (null === $equip['series']['enUS']) {
                $equip['series']['enUS'] = $mapping[$equip['id']]['series']['enUS'];
            }

            if (null === $equip['name']['enUS']) {
                $equip['name']['enUS'] = $mapping[$equip['id']]['name']['enUS'];
            }

            $rawEquips[$index] = $equip;

            unset($mapping[$equip['id']]);
        }

        saveJson("../json/weapons/{$type}/rare{$rare}", $rawEquips);

        // Show Untrack List
        if (0 < count(array_keys($mapping))) {
            saveJson("lang/weapons/{$type}-{$rare}", $mapping);
        }
    }
}
