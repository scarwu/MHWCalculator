#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/../../common.php";

// Weapons
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
        $rawEquips = loadJson("../../json/weapons/{$type}/rare{$rare}");
        $tmpEquips = loadJson("zh/poedb/weapons/{$type}/rare{$rare}");

        $mapping = [];

        foreach ($tmpEquips as $equip) {
            $mapping[$equip['id']] = $equip;
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

        saveJson("../../json/weapons/{$type}/rare{$rare}", $rawEquips);

        // Show Untrack List
        if (0 < count(array_keys($mapping))) {
            saveJson("untrack/weapons/{$type}-{$rare}", $mapping);
        }
    }
}

// Jewels
$rawEquips = loadJson("../../json/jewels");
$tmpEquips = loadJson("zh/poedb/jewels");

$mapping = [];

foreach ($tmpEquips as $equip) {
    $mapping[$equip['id']] = $equip;
}

foreach ($rawEquips as $index => $equip) {
    if (false === isset($mapping[$equip['id']])) {
        continue;
    }

    if (null === $equip['name']['enUS']) {
        $equip['name']['enUS'] = $mapping[$equip['id']]['name']['enUS'];
    }

    if (null === $equip['rare']) {
        $equip['rare'] = $mapping[$equip['id']]['rare'];
    }

    $rawEquips[$index] = $equip;

    unset($mapping[$equip['id']]);
}

saveJson("../../json/jewels", $rawEquips);

// Show Untrack List
if (0 < count(array_keys($mapping))) {
    saveJson("untrack/jewels", $mapping);
}

// Charms
$rawEquips = loadJson("../../json/charms");
$tmpEquips = loadJson("zh/poedb/charms");

$mapping = [];

foreach ($tmpEquips as $equip) {
    $mapping[$equip['id']] = $equip;
}

foreach ($rawEquips as $index => $equip) {
    if (false === isset($mapping[$equip['id']])) {
        continue;
    }

    if (null === $equip['name']['enUS']) {
        $equip['name']['enUS'] = $mapping[$equip['id']]['name']['enUS'];
    }

    if (null === $equip['rare']) {
        $equip['rare'] = $mapping[$equip['id']]['rare'];
    }

    $rawEquips[$index] = $equip;

    unset($mapping[$equip['id']]);
}

saveJson("../../json/charms", $rawEquips);

// Show Untrack List
if (0 < count(array_keys($mapping))) {
    saveJson("untrack/charms", $mapping);
}

// Skills & Sets
$skillsRawEquips = loadJson("../../json/skills");
$setsRawEquips = loadJson("../../json/sets");
$tmpEquips = loadJson("zh/poedb/skills");

$mapping = [];

foreach ($tmpEquips as $equip) {
    $mapping[$equip['id']] = $equip;
}

foreach ($skillsRawEquips as $index => $equip) {
    if (false === isset($mapping[$equip['id']])) {
        continue;
    }

    if (null === $equip['name']['enUS']) {
        $equip['name']['enUS'] = $mapping[$equip['id']]['name']['enUS'];
    }

    $skillsRawEquips[$index] = $equip;

    unset($mapping[$equip['id']]);
}

saveJson("../../json/skills", $skillsRawEquips);

foreach ($setsRawEquips as $index => $equip) {
    if (false === isset($mapping[$equip['id']])) {
        continue;
    }

    if (null === $equip['name']['enUS']) {
        $equip['name']['enUS'] = $mapping[$equip['id']]['name']['enUS'];
    }

    $setsRawEquips[$index] = $equip;

    unset($mapping[$equip['id']]);
}

saveJson("../../json/sets", $setsRawEquips);

// Show Untrack List
if (0 < count(array_keys($mapping))) {
    saveJson("untrack/skillsAndSets", $mapping);
}
