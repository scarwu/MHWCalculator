#!/usr/bin/env php
<?php

error_reporting(E_ALL);

$root = __DIR__;

$weapons = file_get_contents("{$root}/../src/assets/json/weapons.json");
$armors = file_get_contents("{$root}/../src/assets/json/armors.json");
$charms = file_get_contents("{$root}/../src/assets/json/charms.json");
$jewels = file_get_contents("{$root}/../src/assets/json/jewels.json");
$enhances = file_get_contents("{$root}/../src/assets/json/enhances.json");
$skills = file_get_contents("{$root}/../src/assets/json/skills.json");
$sets = file_get_contents("{$root}/../src/assets/json/sets.json");

$weapons = json_decode($weapons, true);
$armors = json_decode($armors, true);
$charms = json_decode($charms, true);
$jewels = json_decode($jewels, true);
$enhances = json_decode($enhances, true);
$skills = json_decode($skills, true);
$sets = json_decode($sets, true);

$enhanceMap = [];
$skillMap = [];
$setMap = [];

foreach ($enhances as $enhance) {
    $enhanceMap[$enhance['name']] = true;
}

foreach ($skills as $skill) {
    $skillMap[$skill['name']] = true;
}

foreach ($sets as $set) {
    $setMap[$set['name']] = true;
}

foreach ($weapons as $weapon) {
    if (is_array($weapon['skills']) && 0 !== count($weapon['skills'])) {
        foreach ($weapon['skills'] as $skill) {
            if (!isset($skillMap[$skill['name']])) {
                echo "Error: Weapon={$weapon['name']}, Skill={$skill['name']}\n";
            }
        }
    }
}

foreach ($armors as $armor) {
    if (is_array($armor['skills']) && 0 !== count($armor['skills'])) {
        foreach ($armor['skills'] as $skill) {
            if (!isset($skillMap[$skill['name']])) {
                echo "Error: Armor={$armor['name']}, Skill={$skill['name']}\n";
            }
        }
    }

    if (is_string($armor['set']['name'])) {
        if (!isset($setMap[$armor['set']['name']])) {
            echo "Error: Armor={$armor['name']}, Set={$armor['set']['name']}\n";
        }
    }
}

foreach ($charms as $charm) {
    if (is_array($charm['skills']) && 0 !== count($charm['skills'])) {
        foreach ($charm['skills'] as $skill) {
            if (!isset($skillMap[$skill['name']])) {
                echo "Error: Charm={$charm['name']}, Skill={$skill['name']}\n";
            }
        }
    }
}

foreach ($jewels as $jewel) {
    if (is_string($jewel['skill']['name'])) {
        if (!isset($skillMap[$jewel['skill']['name']])) {
            echo "Error: Jewel={$jewel['name']}, Skill={$jewel['skill']['name']}\n";
        }
    }
}
