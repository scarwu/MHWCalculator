#!/usr/bin/env php
<?php

error_reporting(E_ALL);
define('ROOT', __DIR__);

function loadJson ($name) {
    $path = ROOT . "/../json/{$name}.json";

    return json_decode(file_get_contents($path), true);
}

function saveDatasetJson ($name, $data) {
    $path = ROOT . "/../src/assets/datasets/{$name}.json";
    $json = json_encode($path, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    return file_get_contents($json);
}

function saveLangJson ($name, $data) {
    $path = ROOT . "/../src/assets/langs/{$name}.json";
    $json = json_encode($path, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    return file_get_contents($json);
}

/**
 * Load Json Files
 */
$weaponsBundle = [];
$weaponsBundle['greatSword/rare6'] = loadJson('weapons/greatSword/rare6');
$weaponsBundle['greatSword/rare7'] = loadJson('weapons/greatSword/rare7');
$weaponsBundle['greatSword/rare8'] = loadJson('weapons/greatSword/rare8');
$weaponsBundle['longSword/rare6'] = loadJson('weapons/longSword/rare6');
$weaponsBundle['longSword/rare7'] = loadJson('weapons/longSword/rare7');
$weaponsBundle['longSword/rare8'] = loadJson('weapons/longSword/rare8');
$weaponsBundle['swordAndShield/rare6'] = loadJson('weapons/swordAndShield/rare6');
$weaponsBundle['swordAndShield/rare7'] = loadJson('weapons/swordAndShield/rare7');
$weaponsBundle['swordAndShield/rare8'] = loadJson('weapons/swordAndShield/rare8');
$weaponsBundle['dualBlades/rare6'] = loadJson('weapons/dualBlades/rare6');
$weaponsBundle['dualBlades/rare7'] = loadJson('weapons/dualBlades/rare7');
$weaponsBundle['dualBlades/rare8'] = loadJson('weapons/dualBlades/rare8');
$weaponsBundle['hammer/rare6'] = loadJson('weapons/hammer/rare6');
$weaponsBundle['hammer/rare7'] = loadJson('weapons/hammer/rare7');
$weaponsBundle['hammer/rare8'] = loadJson('weapons/hammer/rare8');
$weaponsBundle['huntingHorn/rare6'] = loadJson('weapons/huntingHorn/rare6');
$weaponsBundle['huntingHorn/rare7'] = loadJson('weapons/huntingHorn/rare7');
$weaponsBundle['huntingHorn/rare8'] = loadJson('weapons/huntingHorn/rare8');
$weaponsBundle['lance/rare6'] = loadJson('weapons/lance/rare6');
$weaponsBundle['lance/rare7'] = loadJson('weapons/lance/rare7');
$weaponsBundle['lance/rare8'] = loadJson('weapons/lance/rare8');
$weaponsBundle['gunlance/rare6'] = loadJson('weapons/gunlance/rare6');
$weaponsBundle['gunlance/rare7'] = loadJson('weapons/gunlance/rare7');
$weaponsBundle['gunlance/rare8'] = loadJson('weapons/gunlance/rare8');
$weaponsBundle['switchAxe/rare6'] = loadJson('weapons/switchAxe/rare6');
$weaponsBundle['switchAxe/rare7'] = loadJson('weapons/switchAxe/rare7');
$weaponsBundle['switchAxe/rare8'] = loadJson('weapons/switchAxe/rare8');
$weaponsBundle['chargeBlade/rare6'] = loadJson('weapons/chargeBlade/rare6');
$weaponsBundle['chargeBlade/rare7'] = loadJson('weapons/chargeBlade/rare7');
$weaponsBundle['chargeBlade/rare8'] = loadJson('weapons/chargeBlade/rare8');
$weaponsBundle['insectGlaive/rare6'] = loadJson('weapons/insectGlaive/rare6');
$weaponsBundle['insectGlaive/rare7'] = loadJson('weapons/insectGlaive/rare7');
$weaponsBundle['insectGlaive/rare8'] = loadJson('weapons/insectGlaive/rare8');
$weaponsBundle['lightBowgun/rare6'] = loadJson('weapons/lightBowgun/rare6');
$weaponsBundle['lightBowgun/rare7'] = loadJson('weapons/lightBowgun/rare7');
$weaponsBundle['lightBowgun/rare8'] = loadJson('weapons/lightBowgun/rare8');
$weaponsBundle['heavyBowgun/rare6'] = loadJson('weapons/heavyBowgun/rare6');
$weaponsBundle['heavyBowgun/rare7'] = loadJson('weapons/heavyBowgun/rare7');
$weaponsBundle['heavyBowgun/rare8'] = loadJson('weapons/heavyBowgun/rare8');
$weaponsBundle['bow/rare6'] = loadJson('weapons/bow/rare6');
$weaponsBundle['bow/rare7'] = loadJson('weapons/bow/rare7');
$weaponsBundle['bow/rare8'] = loadJson('weapons/bow/rare8');
$armorsBundle = [];
$armorsBundle['rare5'] = loadJson('armors/rare5');
$armorsBundle['rare6'] = loadJson('armors/rare6');
$armorsBundle['rare7'] = loadJson('armors/rare7');
$armorsBundle['rare8'] = loadJson('armors/rare8');
$charms = loadJson('charms');
$jewels = loadJson('jewels');
$enhances = loadJson('enhances');
$skills = loadJson('skills');
$sets = loadJson('sets');

/**
 * Check Enhance, Skill, Set & Create Lang, Dataset
 */
$langMap = [];
$datasetMap = [];
$enhanceChecklist = [];
$skillChecklist = [];
$setChecklist = [];

// Handle Enhances Data
foreach ($enhances as $enhance) {
    $enhanceChecklist[$enhance['id']] = true;

    // Create Translation Mapping
    $hash = md5("enhance:{$enhance['id']}:name");

    foreach ($enhance['name'] as $lang => $translation) {
        if (!isset($langMap[$lang])) {
            $langMap[$lang] = [];
        }

        $langMap[$lang][$hash] = $translation;
    }

    $enhance['name'] = $hash;

    foreach (array_keys($enhance['list']) as $index) {
        $hash = md5("enhance:{$enhance['id']}:list:{$index}:description");

        foreach ($enhance['list'][$index]['description'] as $lang => $translation) {
            if (!isset($langMap[$lang])) {
                $langMap[$lang] = [];
            }

            $langMap[$lang][$hash] = $translation;
        }

        $enhance['list'][$index]['description'] = $hash;
    }

    // Create ID Hash
    $enhance['id'] = md5($enhance['id']);

    // Create Dataset

}

// Handle Skill Data
foreach ($skills as $skill) {
    $skillChecklist[$skill['id']] = true;

    // Create Translation Mapping
    $hash = md5("skill:{$skill['id']}:name");

    foreach ($skill['name'] as $lang => $translation) {
        if (!isset($langMap[$lang])) {
            $langMap[$lang] = [];
        }

        $langMap[$lang][$hash] = $translation;
    }

    $skill['name'] = $hash;

    foreach (array_keys($skill['list']) as $index) {
        $hash = md5("skill:{$skill['id']}:list:{$index}:description");

        foreach ($skill['list'][$index]['description'] as $lang => $translation) {
            if (!isset($langMap[$lang])) {
                $langMap[$lang] = [];
            }

            $langMap[$lang][$hash] = $translation;
        }

        $skill['list'][$index]['description'] = $hash;
    }

    // Create ID Hash
    $skill['id'] = md5($skill['id']);

    // Create Dataset

}

// Handle Set Data
foreach ($sets as $set) {
    $setChecklist[$set['id']] = true;

    // Create Translation Mapping
    $hash = md5("set:{$set['id']}:name");

    foreach ($set['name'] as $lang => $translation) {
        if (!isset($langMap[$lang])) {
            $langMap[$lang] = [];
        }

        $langMap[$lang][$hash] = $translation;
    }

    $set['name'] = $hash;

    // Create ID Hash
    $set['id'] = md5($set['id']);

    foreach (array_keys($set['skills']) as $index) {
        $set['skills'][$index]['id'] = md5($set['skills'][$index]['id']);
    }

    // Create Dataset

}

// Handle Weapon Data
foreach ($weaponsBundle as $weapons) {
    foreach ($weapons as $weapon) {
        if (!is_array($weapon['skills'])) {
            continue;
        }

        foreach ($weapon['skills'] as $skill) {
            if (!isset($skillChecklist[$skill['id']])) {
                echo "Error: Weapon={$weapon['id']}, Skill={$skill['id']}\n";
            }
        }

        // Create Translation Mapping
        $hash = md5("weapon:{$weapon['id']}:name");

        foreach ($weapon['name'] as $lang => $translation) {
            if (!isset($langMap[$lang])) {
                $langMap[$lang] = [];
            }

            $langMap[$lang][$hash] = $translation;
        }

        $weapon['name'] = $hash;

        $hash = md5("weapon:{$weapon['id']}:series");

        foreach ($weapon['series'] as $lang => $translation) {
            if (!isset($langMap[$lang])) {
                $langMap[$lang] = [];
            }

            $langMap[$lang][$hash] = $translation;
        }

        $weapon['series'] = $hash;

        // Create ID Hash
        $set['id'] = md5($set['id']);

        foreach (array_keys($set['skills']) as $index) {
            $set['skills'][$index]['id'] = md5($set['skills'][$index]['id']);
        }

        // Create Dataset

    }
}

// Handler Armor Data
foreach ($armorsBundle as $armors) {
    foreach ($armors as $armor) {

        // Checklist
        if (is_string($armor['common']['set']['id'])) {
            if (!isset($setChecklist[$armor['common']['set']['id']])) {
                echo "Error: Set={$armor['common']['set']['id']}\n";
            }
        }

        foreach ($armor['list'] as $item) {
            if (!is_array($item['skills'])) {
                continue;
            }

            foreach ($item['skills'] as $skill) {
                if (!isset($skillChecklist[$skill['id']])) {
                    echo "Error: Armor={$item['id']}, Skill={$skill['id']}\n";
                }
            }
        }

        // Create Translation Mapping
        $hash = md5("armor:common:series");

        foreach ($armor['series'] as $lang => $translation) {
            if (!isset($langMap[$lang])) {
                $langMap[$lang] = [];
            }

            $langMap[$lang][$hash] = $translation;
        }

        $armor['series'] = $hash;

        foreach (array_keys($armor['list']) as $index) {
            // Create Translation Mapping
            $hash = md5("armor:list:{$armor['list'][$index]['id']}:name");

            foreach ($armor['list'][$index]['name'] as $lang => $translation) {
                if (!isset($langMap[$lang])) {
                    $langMap[$lang] = [];
                }

                $langMap[$lang][$hash] = $translation;
            }

            $armor['list'][$index]['name'] = $hash;

            // Create ID Hash
            $armor['list'][$index]['id'] = md5($armor['list'][$index]['name']);

            foreach (array_keys($armor['list'][$index]['skills']) as $index) {
                $armor['list'][$index]['skills'][$index]['id'] = md5($armor['list'][$index]['skills'][$index]['id']);
            }
        }

        // Create Dataset

    }
}

// Handle Charm Data
foreach ($charms as $charm) {

    // Checklist
    if (is_array($charm['skills'])) {
        foreach ($charm['skills'] as $skill) {
            if (!isset($skillChecklist[$skill['id']])) {
                echo "Error: Charm={$charm['id']}, Skill={$skill['id']}\n";
            }
        }
    }

    // Create Translation Mapping
    $hash = md5("charm:{$charm['id']}:name");

    foreach ($charm['name'] as $lang => $translation) {
        if (!isset($langMap[$lang])) {
            $langMap[$lang] = [];
        }

        $langMap[$lang][$hash] = $translation;
    }

    $charm['name'] = $hash;

    // Create ID Hash
    $charm['id'] = md5($charm['id']);

    foreach (array_keys($charm['skills']) as $index) {
        $charm['skills'][$index]['id'] = md5($charm['skills'][$index]['id']);
    }

    // Create Dataset

}

// handler Jewel Data
foreach ($jewels as $jewel) {

    // Checklist
    if (is_string($jewel['skill']['id'])) {
        if (!isset($skillChecklist[$jewel['skill']['id']])) {
            echo "Error: Jewel={$jewel['id']}, Skill={$jewel['skill']['id']}\n";
        }
    }

    // Create Translation Mapping
    $hash = md5("jewel:{$jewel['id']}:name");

    foreach ($jewel['name'] as $lang => $translation) {
        if (!isset($langMap[$lang])) {
            $langMap[$lang] = [];
        }

        $langMap[$lang][$hash] = $translation;
    }

    $jewel['name'] = $hash;

    // Create ID Hash
    $jewel['id'] = md5($jewel['id']);
    $jewel['skill']['id'] = md5($jewel['skill']['id']);

    // Create Dataset

}

// Save Datasets Json
foreach ($datasetMap as $name => $data) {
    saveDatasetJson($name, $data);
}

// Save Langs Json
foreach ($langMap as $lang => $data) {
    saveLangJson("{$lang}/datasets", $data);
}
