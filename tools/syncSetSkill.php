#!/usr/bin/env php
<?php

$root = __DIR__;

// Composer Auto Loader
include "{$root}/crawler/common.php";

$sets = [];
$sets = array_merge($sets, loadJson("../../json/mhw/sets"));
$sets = array_merge($sets, loadJson("../../json/mhwib/sets"));
$setNameMapping = [];

foreach ($sets as $set) {
    foreach ($set['name'] as $name) {
        $setNameMapping[$name] = $set['id'];
    }
}

$skills = [];
$skills = array_merge($skills, loadJson("../../json/mhw/skills"));
$skills = array_merge($skills, loadJson("../../json/mhwib/skills"));
$skillNameMapping = [];

foreach ($skills as $skill) {
    foreach ($skill['name'] as $name) {
        $skillNameMapping[$name] = $skill['id'];
    }
}

/**
 * MHWIB
 */
$untrack = [
    'sets' => [],
    'skills' => []
];

// Armor
for ($rare = 9; $rare <= 12; $rare++) {
    $bundles = loadJson("../../json/mhwib/armors/rare{$rare}");

    foreach ($bundles as $bundleIndex => $bundle) {
        if (false !== isset($bundle['common']['set'])) {
            if (false === isset($setNameMapping[$bundle['common']['set']['id']])) {
                $untrack['sets'][$bundle['common']['set']['id']] = true;
            } else {
                $bundle['common']['set']['id'] = $setNameMapping[$bundle['common']['set']['id']];
            }
        }

        foreach ($bundle['list'] as $armorIndex => $armor) {
            foreach ($armor['skills'] as $skillIndex => $skill) {
                if (false === isset($skillNameMapping[$skill['id']])) {
                    $untrack['skills'][$skill['id']] = true;
                } else {
                    $armor['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
                }
            }

            $bundle['list'][$armorIndex] = $armor;
        }

        $bundles[$bundleIndex] = $bundle;
    }

    saveJson("../../json/mhwib/armors/rare{$rare}", $bundles);
}

// Jewel
$jewels = loadJson("../../json/mhwib/jewels");

foreach ($jewels as $jewelIndex => $jewel) {
    foreach ($jewel['skills'] as $skillIndex => $skill) {
        if (false === isset($skillNameMapping[$skill['id']])) {
            $untrack['skills'][$skill['id']] = true;
        } else {
            $jewel['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
        }
    }

    $jewels[$jewelIndex] = $jewel;
}

saveJson("../../json/mhwib/jewels", $jewels);

// Charm
$charms = loadJson("../../json/mhwib/charms");

foreach ($charms as $charmIndex => $charm) {
    foreach ($charm['skills'] as $skillIndex => $skill) {
        if (false === isset($skillNameMapping[$skill['id']])) {
            $untrack['skills'][$skill['id']] = true;
        } else {
            $charm['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
        }
    }

    $charms[$charmIndex] = $charm;
}

saveJson("../../json/mhwib/charms", $charms);

$untrack['sets'] = array_keys($untrack['sets']);
$untrack['skills'] = array_keys($untrack['skills']);

print_r($untrack);
