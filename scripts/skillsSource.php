#!/usr/bin/env php
<?php

error_reporting(E_ALL);

$root = __DIR__;

$skills = file_get_contents("{$root}/../src/assets/json/skills.json");
$jewels = file_get_contents("{$root}/../src/assets/json/jewels.json");
$armors = file_get_contents("{$root}/../src/assets/json/armors.json");
$sets = file_get_contents("{$root}/../src/assets/json/sets.json");

$skills = json_decode($skills, true);
$jewels = json_decode($jewels, true);
$armors = json_decode($armors, true);
$sets = json_decode($sets, true);

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

$newSkills = json_encode($newSkills, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents("{$root}/../temp/skills.json", $newSkills);
