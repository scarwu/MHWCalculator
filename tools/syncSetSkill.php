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
// Armor
for ($rare = 9; $rare <= 12; $rare++) {
    $bundles = loadJson("../../json/mhwib/armors/rare{$rare}");

    foreach ($bundles as $bundleIndex => $bundle) {
        if (false !== isset($bundle['common']['set'])) {
            if (false === isset($setNameMapping[$bundle['common']['set']['id']])) {
                echo "Armor Untrack Set: {$bundle['common']['set']['id']}\n";
            } else {
                $bundle['common']['set']['id'] = $setNameMapping[$bundle['common']['set']['id']];
            }
        }

        foreach ($bundle['list'] as $armorIndex => $armor) {
            foreach ($armor['skills'] as $skillIndex => $skill) {
                if (false === isset($skillNameMapping[$skill['id']])) {
                    echo "Armor Untrack Skill: {$skill['id']}\n";
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

foreach ($jewels as $chramIndex => $chram) {
    foreach ($chram['skills'] as $skillIndex => $skill) {
        if (false === isset($skillNameMapping[$skill['id']])) {
            echo "Jewel Untrack Skill: {$skill['id']}\n";
        } else {
            $chram['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
        }
    }

    $jewels[$chramIndex] = $chram;
}

saveJson("../../json/mhwib/jewels", $jewels);
