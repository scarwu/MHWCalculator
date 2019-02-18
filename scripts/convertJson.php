#!/usr/bin/env php
<?php

error_reporting(E_ALL);
define('ROOT', __DIR__);

function loadJson ($name) {
    $path = ROOT . "/../json/{$name}.json";

    return json_decode(file_get_contents($path), true);
}

function saveDatasetJson ($name, $data) {
    $path = ROOT . "/../src/assets/scripts/datasets/{$name}.json";
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    @mkdir(dirname($path), 0755, true);

    return file_put_contents($path, $json);
}

function saveLangJson ($name, $data) {
    $path = ROOT . "/../src/assets/scripts/langs/{$name}.json";
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    @mkdir(dirname($path), 0755, true);

    return file_put_contents($path, $json);
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
$datasetMap['enhances'] = [];

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
    // {
    //     "id": "強化攻擊力",
    //     "name":{
    //         "zhTW":  "強化攻擊力"
    //     },
    //     "list": [
    //         {
    //             "level": 1,
    //             "description": {
    //                 "zhTW": "基礎攻擊力+5"
    //             },
    //             "reaction": {
    //                 "attack": {
    //                     "value": 5
    //                 }
    //             }
    //         },
    //         {
    //             "level": 2,
    //             "description": {
    //                 "zhTW": "基礎攻擊力+10"
    //             },
    //             "reaction": {
    //                 "attack": {
    //                     "value": 10
    //                 }
    //             }
    //         },
    //         {
    //             "level": 3,
    //             "description": {
    //                 "zhTW": "基礎攻擊力+15"
    //             },
    //             "reaction": {
    //                 "attack": {
    //                     "value": 15
    //                 }
    //             }
    //         }
    //     ]
    // }
    $datasetMap['enhances'][] = [
        $enhance['id'],
        $enhance['name'],
        array_map(function ($item) {
            return [
                $item['level'],
                $item['description'],
                $item['reaction']
            ];
        }, $enhance['list'])
    ];
}

// Handle Skill Data
$datasetMap['skills'] = [];

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
    // {
    //     "id": "體力增強",
    //     "name": {
    //         "zhTW": "體力增強"
    //     },
    //     "type": "active",
    //     "from" : {
    //         "set": false,
    //         "jewel": true,
    //         "armor": true
    //     },
    //     "list": [
    //         {
    //             "level": 1,
    //             "description": {
    //                 "zhTW": "體力+15"
    //             },
    //             "reaction": {
    //                 "health": {
    //                     "value": 15
    //                 }
    //             }
    //         },
    //         {
    //             "level": 2,
    //             "description": {
    //                 "zhTW": "體力+30"
    //             },
    //             "reaction": {
    //                 "health": {
    //                     "value": 30
    //                 }
    //             }
    //         },
    //         {
    //             "level": 3,
    //             "description": {
    //                 "zhTW": "體力+50"
    //             },
    //             "reaction": {
    //                 "health": {
    //                     "value": 50
    //                 }
    //             }
    //         }
    //     ]
    // }
    $datasetMap['skills'][] = [
        $skill['id'],
        $skill['name'],
        $skill['type'],
        [
            $skill['from']['set'],
            $skill['from']['jewel'],
            $skill['from']['armor']
        ],
        array_map(function ($item) {
            return [
                $item['level'],
                $item['description'],
                $item['reaction']
            ];
        }, $skill['list'])
    ];
}

// Handle Set Data
$datasetMap['sets'] = [];

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
    // {
    //     "id": "蠻顎龍之力",
    //     "name": {
    //         "zhTW": "蠻顎龍之力"
    //     },
    //     "skills": [
    //         {
    //             "id": "振奮",
    //             "require": 3
    //         }
    //     ]
    // }
    $datasetMap['sets'][] = [
        $set['id'],
        $set['name'],
        array_map(function ($item) {
            return [
                $item['id'],
                $item['require']
            ];
        }, $set['skills'])
    ];
}

// Handle Weapon Data
foreach ($weaponsBundle as $name => $weapons) {
    $datasetMap["weapons/{$name}"] = [];

    foreach ($weapons as $weapon) {

        // Checklist
        if (is_array($weapon['skills'])) {
            foreach ($weapon['skills'] as $skill) {
                if (!isset($skillChecklist[$skill['id']])) {
                    echo "Error: Weapon={$weapon['id']}, Skill={$skill['id']}\n";
                }
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
        $weapon['id'] = md5($weapon['id']);

        if (is_array($weapon['skills']) && 0 !== count($weapon['skills'])) {
            foreach (array_keys($weapon['skills']) as $index) {
                $weapon['skills'][$index]['id'] = md5($weapon['skills'][$index]['id']);
            }
        }

        // Create Dataset
        // {
        //     "id": "冰炎劍維爾瑪閃焰",
        //     "rare": 8,
        //     "type": "dualBlades",
        //     "series": {
        //         "zhTW": "黑鋼"
        //     },
        //     "name": {
        //         "zhTW": "冰炎劍維爾瑪閃焰"
        //     },
        //     "attack": 252,
        //     "criticalRate": 10,
        //     "defense": 0,
        //     "sharpness": {
        //         "value": 350,
        //         "steps": {
        //             "red": 60,
        //             "orange": 50,
        //             "yellow": 60,
        //             "green": 120,
        //             "blue": 70,
        //             "white": 40
        //         }
        //     },
        //     "element": {
        //         "attack": {
        //             "type": "ice",
        //             "minValue": 240,
        //             "maxValue": 310,
        //             "isHidden": false
        //         },
        //         "status": {
        //             "type": "blast",
        //             "minValue": 240,
        //             "maxValue": 300,
        //             "isHidden": false
        //         }
        //     },
        //     "elderseal": null,
        //     "slots": [
        //         {
        //             "size": 2
        //         }
        //     ],
        //     "skills": null
        // }
        $datasetMap["weapons/{$name}"][] = [
            $weapon['id'],
            $weapon['rare'],
            $weapon['type'],
            $weapon['series'],
            $weapon['name'],
            $weapon['attack'],
            $weapon['criticalRate'],
            $weapon['defense'],
            (null !== $weapon['sharpness']) ? [
                $weapon['sharpness']['value'],
                [
                    $weapon['sharpness']['steps']['red'],
                    $weapon['sharpness']['steps']['orange'],
                    $weapon['sharpness']['steps']['yellow'],
                    $weapon['sharpness']['steps']['green'],
                    $weapon['sharpness']['steps']['blue'],
                    $weapon['sharpness']['steps']['white']
                ]
            ] : null,
            [
                (null !== $weapon['element']['attack']) ? [
                    $weapon['element']['attack']['type'],
                    $weapon['element']['attack']['minValue'],
                    $weapon['element']['attack']['maxValue'],
                    $weapon['element']['attack']['isHidden']
                ] : null,
                (null !== $weapon['element']['status']) ? [
                    $weapon['element']['status']['type'],
                    $weapon['element']['status']['minValue'],
                    $weapon['element']['status']['maxValue'],
                    $weapon['element']['status']['isHidden']
                ] : null
            ],
            (null !== $weapon['elderseal']) ? $weapon['elderseal']['affinity'] : null,
            (null !== $weapon['slots']) ? array_map(function ($slot) {
                return $slot['size'];
            }, $weapon['slots']) : null,
            (null !== $weapon['skills']) ? array_map(function ($skill) {
                return [
                    $skill['id'],
                    $skill['level']
                ];
            }, $weapon['skills']) : null
        ];
    }
}

// Handler Armor Data
foreach ($armorsBundle as $name => $armors) {
    $datasetMap["armors/{$name}"] = [];

    foreach ($armors as $armor) {

        // Checklist
        if (is_string($armor['common']['set']['id'])) {
            if (!isset($setChecklist[$armor['common']['set']['id']])) {
                echo "Error: Set={$armor['common']['set']['id']}\n";
            }
        }

        foreach ($armor['list'] as $item) {
            if (is_array($item['skills'])) {
                foreach ($item['skills'] as $skill) {
                    if (!isset($skillChecklist[$skill['id']])) {
                        echo "Error: Armor={$item['id']}, Skill={$skill['id']}\n";
                    }
                }
            }
        }

        // Create Translation Mapping
        $hash = md5("armor:common:series");

        foreach ($armor['common']['series'] as $lang => $translation) {
            if (!isset($langMap[$lang])) {
                $langMap[$lang] = [];
            }

            $langMap[$lang][$hash] = $translation;
        }

        $armor['common']['series'] = $hash;

        foreach (array_keys($armor['list']) as $listIndex) {
            // Create Translation Mapping
            $hash = md5("armor:list:{$armor['list'][$listIndex]['id']}:name");

            foreach ($armor['list'][$listIndex]['name'] as $lang => $translation) {
                if (!isset($langMap[$lang])) {
                    $langMap[$lang] = [];
                }

                $langMap[$lang][$hash] = $translation;
            }

            $armor['list'][$listIndex]['name'] = $hash;

            // Create ID Hash
            $armor['list'][$listIndex]['id'] = md5($armor['list'][$listIndex]['name']);

            if (is_array($armor['list'][$listIndex]['skills'])
                && 0 !== count($armor['list'][$listIndex]['skills'])) {

                foreach (array_keys($armor['list'][$listIndex]['skills']) as $skillIndex) {
                    $armor['list'][$listIndex]['skills'][$skillIndex]['id'] = md5($armor['list'][$listIndex]['skills'][$skillIndex]['id']);
                }
            }
        }

        // Create Dataset
        // {
        //     "common": {
        //         "rare": 8,
        //         "gender": "general",
        //         "series": {
        //             "zhTW": "龍王的獨眼α"
        //         },
        //         "defense": 90,
        //         "resistance": {
        //             "fire": 0,
        //             "water": 0,
        //             "thunder": 0,
        //             "ice": 0,
        //             "dragon": 0
        //         },
        //         "set": null
        //     },
        //     "list": [
        //         {
        //             "id": "龍王的獨眼α",
        //             "type": "helm",
        //             "name": {
        //                 "zhTW": "龍王的獨眼α"
        //             },
        //             "slots": [
        //                 {
        //                     "size": 3
        //                 }
        //             ],
        //             "skills": [
        //                 {
        //                     "id": "弱點特效",
        //                     "level": 2
        //                 }
        //             ]
        //         }
        //     ]
        // }
        $datasetMap["armors/{$name}"][] = [
            [
                $armor['common']['rare'],
                $armor['common']['gender'],
                $armor['common']['series'],
                $armor['common']['defense'],
                [
                    $armor['common']['resistance']['fire'],
                    $armor['common']['resistance']['water'],
                    $armor['common']['resistance']['thunder'],
                    $armor['common']['resistance']['ice'],
                    $armor['common']['resistance']['dragon']
                ],
                (null !== $armor['common']['set']) ? $armor['common']['set']['id'] : null,
            ],
            array_map(function ($item) {
                return [
                    $item['id'],
                    $item['type'],
                    $item['name'],
                    (null !== $item['slots']) ? array_map(function ($slot) {
                        return $slot['size'];
                    }, $item['slots']) : null,
                    (null !== $item['skills']) ? array_map(function ($skill) {
                        return [
                            $skill['id'],
                            $skill['level']
                        ];
                    }, $item['skills']) : null
                ];
            }, $armor['list'])
        ];
    }
}

// Handle Charm Data
$datasetMap['charms'] = [];

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
    // {
    //     "id": "心靜自然涼護石",
    //     "name": {
    //         "zhTW": "心靜自然涼護石"
    //     },
    //     "rare": 7,
    //     "skills": [
    //         {
    //             "id": "熱傷害無效",
    //             "level": 1
    //         },
    //         {
    //             "id": "適應瘴氣環境",
    //             "level": 1
    //         }
    //     ]
    // }
    $datasetMap['charms'][] = [
        $charm['id'],
        $charm['name'],
        $charm['rare'],
        array_map(function ($item) {
            return [
                $item['id'],
                $item['level']
            ];
        }, $charm['skills'])
    ];
}

// handler Jewel Data
$datasetMap['jewels'] = [];

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
    // {
    //     "id": "増彈珠",
    //     "name": {
    //         "zhTW": "増彈珠"
    //     },
    //     "rare": 7,
    //     "size": 2,
    //     "skill": {
    //         "id": "砲彈裝填數UP",
    //         "level": 1
    //     }
    // }
    $datasetMap['jewels'][] = [
        $jewel['id'],
        $jewel['name'],
        $jewel['rare'],
        $jewel['size'],
        [
            $jewel['skill']['id'],
            $jewel['skill']['level']
        ]
    ];
}

// Save Datasets Json
foreach ($datasetMap as $name => $data) {
    saveDatasetJson($name, $data);
}

// Save Langs Json
foreach ($langMap as $lang => $data) {
    saveLangJson("{$lang}/datasets", $data);
}
