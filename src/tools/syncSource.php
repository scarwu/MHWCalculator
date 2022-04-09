#!/usr/bin/env php
<?php
error_reporting(E_ALL);

$root = __DIR__;

// Composer Auto Loader
include "{$root}/crawler/common.php";

$weaponTypes = [
    'greatSword',
    'longSword',
    'swordAndShield',
    'dualBlades',
    'hammer',
    'huntingHorn',
    'lance',
    'gunlance',
    'switchAxe',
    'chargeBlade',
    'insectGlaive',
    'lightBowgun',
    'heavyBowgun',
    'bow'
];

$setMap = [];
$jewelMap = [];
$armorMap = [];
$charmMap = [];
$weaponMap = [];

/**
 * MHW
 */
$sets = loadJson("../../json/mhw/sets");
$jewels = loadJson("../../json/mhw/jewels");
$charms = loadJson("../../json/mhw/charms");
$armors = [];

foreach ([5, 6, 7, 8] as $rare) {
    $armors = array_merge($armors, loadJson("../../json/mhw/armors/rare{$rare}"));
}

$weapons = [];

foreach ($weaponTypes as $type) {
    foreach ([6, 7, 8] as $rare) {
        $weapons = array_merge($weapons, loadJson("../../json/mhw/weapons/{$type}/rare{$rare}"));
    }
}

// Generate Map
foreach ($sets as $set) {
    foreach ($set['skills'] as $skill) {
        $setMap[$skill['id']] = true;
    }
}

foreach ($jewels as $jewel) {
    foreach ($jewel['skills'] as $skill) {
        $jewelMap[$skill['id']] = true;
    }
}

foreach ($armors as $armor) {
    foreach ($armor['items'] as $item) {
        if (false === is_array($item['skills'])) {
            continue;
        }

        foreach ($item['skills'] as $skill) {
            $armorMap[$skill['id']] = true;
        }
    }
}

foreach ($charms as $charm) {
    foreach ($charm['items'] as $item) {
        if (false === is_array($item['skills'])) {
            continue;
        }

        foreach ($item['skills'] as $skill) {
            $charmMap[$skill['id']] = true;
        }
    }
}

foreach ($weapons as $weapon) {
    if (false === is_array($weapon['skills'])) {
        continue;
    }

    foreach ($weapon['skills'] as $skill) {
        $weaponMap[$skill['id']] = true;
    }
}

/**
 * MHW: IB
 */
$sets = loadJson("../../json/mhwib/sets");
$jewels = loadJson("../../json/mhwib/jewels");
$charms = loadJson("../../json/mhwib/charms");
$armors = [];
$weapons = [];

foreach ([9, 10, 11, 12] as $rare) {
    $armors = array_merge($armors, loadJson("../../json/mhwib/armors/rare{$rare}"));
}

foreach ($weaponTypes as $type) {
    foreach ([9, 10, 11, 12] as $rare) {
        $weapons = array_merge($weapons, loadJson("../../json/mhwib/weapons/{$type}/rare{$rare}"));
    }
}

// Generate Map
foreach ($sets as $set) {
    foreach ($set['skills'] as $skill) {
        $setMap[$skill['id']] = true;
    }
}

foreach ($jewels as $jewel) {
    foreach ($jewel['skills'] as $skill) {
        $jewelMap[$skill['id']] = true;
    }
}

foreach ($armors as $armor) {
    foreach ($armor['items'] as $item) {
        if (false === is_array($item['skills'])) {
            continue;
        }

        foreach ($item['skills'] as $skill) {
            $armorMap[$skill['id']] = true;
        }
    }
}

foreach ($charms as $charm) {
    foreach ($charm['items'] as $item) {
        if (false === is_array($item['skills'])) {
            continue;
        }

        foreach ($item['skills'] as $skill) {
            $charmMap[$skill['id']] = true;
        }
    }
}

foreach ($weapons as $weapon) {
    if (false === is_array($weapon['skills'])) {
        continue;
    }

    foreach ($weapon['skills'] as $skill) {
        $weaponMap[$skill['id']] = true;
    }
}

print_r($setMap);
print_r($jewelMap);
print_r($armorMap);
print_r($charmMap);
print_r($weaponMap);

$skills = loadJson("../../json/mhw/skills");
$newSkills = [];

foreach ($skills as $skill) {
    $skill['from']['set'] = isset($setMap[$skill['id']]);
    $skill['from']['jewel'] = isset($jewelMap[$skill['id']]);
    $skill['from']['armor'] = isset($armorMap[$skill['id']]);
    $skill['from']['charm'] = isset($charmMap[$skill['id']]);
    $skill['from']['weapon'] = isset($weaponMap[$skill['id']]);

    $newSkills[] = $skill;
}

saveJson("../../json/mhw/skills", $newSkills);

$skills = loadJson("../../json/mhwib/skills");
$newSkills = [];

foreach ($skills as $skill) {
    $skill['from']['set'] = isset($setMap[$skill['id']]);
    $skill['from']['jewel'] = isset($jewelMap[$skill['id']]);
    $skill['from']['armor'] = isset($armorMap[$skill['id']]);
    $skill['from']['charm'] = isset($charmMap[$skill['id']]);
    $skill['from']['weapon'] = isset($weaponMap[$skill['id']]);

    $newSkills[] = $skill;
}

saveJson("../../json/mhwib/skills", $newSkills);
