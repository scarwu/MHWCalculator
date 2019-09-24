#!/usr/bin/env php
<?php
error_reporting(E_ALL);

$root = __DIR__;

// Composer Auto Loader
include "{$root}/crawler/common.php";

/**
 * MHW
 */
$sets = loadJson("../../json/mhw/sets");
$skills = loadJson("../../json/mhw/skills");
$jewels = loadJson("../../json/mhw/jewels");
$armors = [];

foreach ([5, 6, 7, 8] as $rare) {
    $armors = array_merge($armors, loadJson("../../json/mhw/armors/rare{$rare}.json"));
}

$jewelMap = [];

foreach ($jewels as $jewel) {
    $jewelMap[$jewel['skill']['name']] = true;
}

$armorMap = [];

foreach ($armors as $armor) {
    foreach ($armor['skills'] as $skill) {
        $armorMap[$skill['name']] = true;
    }
}

$setMap = [];

foreach ($sets as $set) {
    foreach ($set['skills'] as $skill) {
        $setMap[$skill['name']] = true;
    }
}

print_r($jewelMap);
print_r($armorMap);
print_r($setMap);

$newSkills = [];

foreach ($skills as $skill) {
    $skill['fromJewel'] = isset($jewelMap[$skill['name']]);
    $skill['fromArmor'] = isset($armorMap[$skill['name']]);
    $skill['fromSet'] = isset($setMap[$skill['name']]);

    $newSkills[] = $skill;
}

saveJson("../../json/mhw/skills", $newSkills);

/**
 * MHW: IB
 */
$sets = loadJson("../../json/mhwib/sets");
$skills = loadJson("../../json/mhwib/skills");
$jewels = loadJson("../../json/mhwib/jewels");
$armors = [];

foreach ([9, 10, 11, 12] as $rare) {
    $armors = array_merge($armors, loadJson("../../json/mhwib/armors/rare{$rare}.json"));
}

$jewelMap = [];

foreach ($jewels as $jewel) {
    $jewelMap[$jewel['skill']['name']] = true;
}

$armorMap = [];

foreach ($armors as $armor) {
    foreach ($armor['skills'] as $skill) {
        $armorMap[$skill['name']] = true;
    }
}

$setMap = [];

foreach ($sets as $set) {
    foreach ($set['skills'] as $skill) {
        $setMap[$skill['name']] = true;
    }
}

print_r($jewelMap);
print_r($armorMap);
print_r($setMap);

$newSkills = [];

foreach ($skills as $skill) {
    $skill['fromJewel'] = isset($jewelMap[$skill['name']]);
    $skill['fromArmor'] = isset($armorMap[$skill['name']]);
    $skill['fromSet'] = isset($setMap[$skill['name']]);

    $newSkills[] = $skill;
}

saveJson("../../json/mhwib/skills", $newSkills);
