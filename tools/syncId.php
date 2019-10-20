#!/usr/bin/env php
<?php
error_reporting(E_ALL);

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
for ($rare = 5; $rare <= 8; $rare++) {
    $bundles = loadJson("../../json/mhw/armors/rare{$rare}");

    foreach ($bundles as $bundleIndex => $bundle) {
        if (false !== isset($bundle['series']['set'])) {
            if (false === isset($setNameMapping[$bundle['series']['set']['id']])) {
                $untrack['sets'][$bundle['series']['set']['id']] = true;
            } else {
                $bundle['series']['set']['id'] = $setNameMapping[$bundle['series']['set']['id']];
            }
        }

        foreach ($bundle['items'] as $armorIndex => $armor) {
            if (null !== $armor['skills']) {
                foreach ($armor['skills'] as $skillIndex => $skill) {
                    if (false === isset($skillNameMapping[$skill['id']])) {
                        $untrack['skills'][$skill['id']] = true;
                    } else {
                        $armor['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
                    }
                }
            }

            $bundle['items'][$armorIndex] = $armor;
        }

        $bundles[$bundleIndex] = $bundle;
    }

    saveJson("../../json/mhw/armors/rare{$rare}", $bundles);
}

for ($rare = 9; $rare <= 12; $rare++) {
    $bundles = loadJson("../../json/mhwib/armors/rare{$rare}");

    foreach ($bundles as $bundleIndex => $bundle) {
        if (false !== isset($bundle['series']['set'])) {
            if (false === isset($setNameMapping[$bundle['series']['set']['id']])) {
                $untrack['sets'][$bundle['series']['set']['id']] = true;
            } else {
                $bundle['series']['set']['id'] = $setNameMapping[$bundle['series']['set']['id']];
            }
        }

        foreach ($bundle['items'] as $armorIndex => $armor) {
            if (null !== $armor['skills']) {
                foreach ($armor['skills'] as $skillIndex => $skill) {
                    if (false === isset($skillNameMapping[$skill['id']])) {
                        $untrack['skills'][$skill['id']] = true;
                    } else {
                        $armor['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
                    }
                }
            }

            $bundle['items'][$armorIndex] = $armor;
        }

        $bundles[$bundleIndex] = $bundle;
    }

    saveJson("../../json/mhwib/armors/rare{$rare}", $bundles);
}

// Jewel
$jewels = loadJson("../../json/mhw/jewels");

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

saveJson("../../json/mhw/jewels", $jewels);

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
$charms = loadJson("../../json/mhw/charms");

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

saveJson("../../json/mhw/charms", $charms);

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

// Set
$sets = loadJson("../../json/mhw/sets");

foreach ($sets as $setIndex => $set) {
    foreach ($set['skills'] as $skillIndex => $skill) {
        if (false === isset($skillNameMapping[$skill['id']])) {
            $untrack['skills'][$skill['id']] = true;
        } else {
            $set['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
        }
    }

    $sets[$setIndex] = $set;
}

saveJson("../../json/mhw/sets", $sets);

$sets = loadJson("../../json/mhwib/sets");

foreach ($sets as $setIndex => $set) {
    foreach ($set['skills'] as $skillIndex => $skill) {
        if (false === isset($skillNameMapping[$skill['id']])) {
            $untrack['skills'][$skill['id']] = true;
        } else {
            $set['skills'][$skillIndex]['id'] = $skillNameMapping[$skill['id']];
        }
    }

    $sets[$setIndex] = $set;
}

saveJson("../../json/mhwib/sets", $sets);

$untrack['sets'] = array_keys($untrack['sets']);
$untrack['skills'] = array_keys($untrack['skills']);

print_r($untrack);
