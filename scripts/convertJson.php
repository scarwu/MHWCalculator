#!/usr/bin/env php
<?php

error_reporting(E_ALL);
define('ROOT', __DIR__);

class Misc
{
    private static $codeLength = 2;
    private static $codeMap = [];
    private static $hashMap = [];
    private static $seed = 0;
    private static $charPool = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    public static function loadJson ($name)
    {
        $path = ROOT . "/../json/{$name}.json";

        return json_decode(file_get_contents($path), true);
    }

    public static function saveJson ($name, $data)
    {
        $path = ROOT . "/../src/assets/scripts/json/{$name}.json";
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        @mkdir(dirname($path), 0755, true);

        return file_put_contents($path, $json);
    }

    public static function createCode($text = null)
    {
        if (!is_string($text)) {
            return false;
        }

        $hash = md5($text);

        if (isset(self::$hashMap[$hash])) {
            return self::$hashMap[$hash];
        }

        $poolSize = count(self::$charPool);

        // Set Random Seed
        srand(self::$seed);

        while (true) {
            $code = '';

            for ($i = 0; $i < self::$codeLength; $i++) {
                $code .= self::$charPool[rand() % $poolSize];
            }

            if (!isset(self::$codeMap[$code])) {
                self::$hashMap[$hash] = $code;
                self::$codeMap[$code] = true;

                break;
            }

            echo "conflict: {$code}\n";
        }

        // Reset Random Seed
        srand();

        // Increase Seed
        self::$seed++;

        return $code;
    }
}

/**
 * Load Json Files
 */
$weapons = [];

foreach ([
    'greatSword', 'longSword', 'swordAndShield', 'dualBlades',
    'hammer', 'huntingHorn', 'lance', 'gunlance',
    'switchAxe', 'chargeBlade', 'insectGlaive',
    'lightBowgun', 'heavyBowgun', 'bow'
] as $type) {
    for ($level = 6; $level <= 8; $level++) {
        $weapons = array_merge($weapons, Misc::loadJson("weapons/$type/rare{$level}"));
    }
}

$armors = [];

for ($level = 5; $level <= 8; $level++) {
    $armors = array_merge($armors, Misc::loadJson("armors/rare{$level}"));
}

$charms = Misc::loadJson('charms');
$jewels = Misc::loadJson('jewels');
$enhances = Misc::loadJson('enhances');
$skills = Misc::loadJson('skills');
$sets = Misc::loadJson('sets');
$testData = Misc::loadJson('testData');

/**
 * Check Enhance, Skill, Set & Create Lang, Dataset
 */
$langMap = [];
$datasetMap = [];
$enhanceChecklist = [];
$skillChecklist = [];
$setChecklist = [];
$weaponChecklist = [];
$armorChecklist = [];
$charmChecklist = [];
$jewelChecklist = [];

function appendLangMap ($uniqueStr, $pack)
{
    $code = Misc::createCode($uniqueStr);

    foreach ($pack as $lang => $translation) {
        if (!isset($langMap[$lang])) {
            $langMap[$lang] = [];
        }

        $langMap[$lang][$code] = $translation;
    }

    return $code;
}

// Handle Enhances Data
$datasetMap['enhances'] = [];

foreach ($enhances as $enhance) {
    $enhanceChecklist[$enhance['id']] = true;

    // Create Translation Mapping
    $enhance['name'] = appendLangMap("enhance:{$enhance['id']}:name", $enhance['name']);

    foreach ($enhance['list'] as $index => $item) {
        $item['description'] = appendLangMap("enhance:{$enhance['id']}:list:{$index}:description", $item['description']);

        // Rewrite
        $enhance['list'][$index] = $item;
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
    $skill['name'] = appendLangMap("skill:{$skill['id']}:name", $skill['name']);

    foreach ($skill['list'] as $index => $item) {
        $item['description'] = appendLangMap("skill:{$skill['id']}:list:{$index}:description", $item['description']);

        // Rewrite
        $skill['list'][$index] = $item;
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
    $set['name'] = appendLangMap("set:{$set['id']}:name", $set['name']);

    // Create ID Hash
    $set['id'] = md5($set['id']);
    $set['skills'] = array_map(function ($skill) {
        $skill['id'] = md5($skill['id']);

        return $skill;
    }, $set['skills']);

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
$datasetMap['weapons'] = [];

foreach ($weapons as $weapon) {
    $weaponChecklist[$weapon['id']] = true;

    // Checklist
    if (is_array($weapon['skills'])) {
        foreach ($weapon['skills'] as $skill) {
            if (!isset($skillChecklist[$skill['id']])) {
                echo "Error: Weapon={$weapon['id']}, Skill={$skill['id']}\n";
            }
        }
    }

    // Create Translation Mapping
    $weapon['name'] = appendLangMap("weapon:{$weapon['id']}:name", $weapon['name']);
    $weapon['series'] = appendLangMap("weapon:{$weapon['id']}:series", $weapon['series']);

    // Create ID Hash
    $weapon['id'] = md5($weapon['id']);

    if (is_array($weapon['skills']) && 0 !== count($weapon['skills'])) {
        $weapon['skills'] = array_map(function ($skill) {
            $skill['id'] = md5($skill['id']);

            return $skill;
        }, $weapon['skills']);
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
    $datasetMap['weapons'][] = [
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

// Handler Armor Data
$datasetMap['armors'] = [];

foreach ($armors as $armor) {

    // Checklist
    if (is_array($armor['common']['set'])) {
        if (!isset($setChecklist[$armor['common']['set']['id']])) {
            echo "Error: Set={$armor['common']['set']['id']}\n";
        }
    }

    foreach ($armor['list'] as $item) {
        $armorChecklist[$item['id']] = true;

        if (is_array($item['skills'])) {
            foreach ($item['skills'] as $skill) {
                if (!isset($skillChecklist[$skill['id']])) {
                    echo "Error: Armor={$item['id']}, Skill={$skill['id']}\n";
                }
            }
        }
    }

    // Create ID Hash
    if (is_array($armor['common']['set'])) {
        $armor['common']['set']['id'] = md5($armor['common']['set']['id']);
    }

    // Create Translation Mapping
    $armor['common']['series'] = appendLangMap("armor:common:series", $armor['common']['series']);

    foreach ($armor['list'] as $index => $item) {

        // Create Translation Mapping
        $item['name'] = appendLangMap("armor:list:{$item['id']}:name", $item['name']);

        // Create ID Hash
        $item['id'] = md5($item['id']);

        if (is_array($item['skills']) && 0 !== count($item['skills'])) {
            $item['skills'] = array_map(function ($skill) {
                $skill['id'] = md5($skill['id']);

                return $skill;
            }, $item['skills']);
        }

        // Rewrite
        $armor['list'][$index] = $item;
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
    $datasetMap['armors'][] = [
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

// Handle Charm Data
$datasetMap['charms'] = [];

foreach ($charms as $charm) {
    $charmChecklist[$charm['id']] = true;

    // Checklist
    if (is_array($charm['skills'])) {
        foreach ($charm['skills'] as $skill) {
            if (!isset($skillChecklist[$skill['id']])) {
                echo "Error: Charm={$charm['id']}, Skill={$skill['id']}\n";
            }
        }
    }

    // Create Translation Mapping
    $charm['name'] = appendLangMap("charm:{$charm['id']}:name", $charm['name']);

    // Create ID Hash
    $charm['id'] = md5($charm['id']);
    $charm['skills'] = array_map(function ($skill) {
        $skill['id'] = md5($skill['id']);

        return $skill;
    }, $charm['skills']);

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
    $jewelChecklist[$jewel['id']] = true;

    // Checklist
    if (is_string($jewel['skill']['id'])) {
        if (!isset($skillChecklist[$jewel['skill']['id']])) {
            echo "Error: Jewel={$jewel['id']}, Skill={$jewel['skill']['id']}\n";
        }
    }

    // Create Translation Mapping
    $jewel['name'] = appendLangMap("jewel:{$jewel['id']}:name", $jewel['name']);

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

// Test Data: Equips
foreach ($testData['equipsList'] as $index => $equips) {

    // Weapon
    if (!isset($weaponChecklist[$equips['weapon']['id']])) {
        echo "Error: Weapon={$equips['weapon']['id']}\n";
    }

    $equips['weapon']['id'] = md5($equips['weapon']['id']);

    foreach ($equips['weapon']['enhanceIds'] as $enhanceIndex => $id) {
        if (!isset($enhanceChecklist[$id])) {
            echo "Error: Enhance={$id}\n";
        }

        $equips['weapon']['enhanceIds'][$enhanceIndex] = md5($id);
    }

    foreach ($equips['weapon']['slotIds'] as $slotIndex => $id) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Slot={$id}\n";
        }

        $equips['weapon']['slotIds'][$slotIndex] = md5($id);
    }

    // Helm
    if (!isset($armorChecklist[$equips['helm']['id']])) {
        echo "Error: Helm={$equips['helm']['id']}\n";
    }

    $equips['helm']['id'] = md5($equips['helm']['id']);

    foreach ($equips['helm']['slotIds'] as $slotIndex => $id) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Slot={$id}\n";
        }

        $equips['helm']['slotIds'][$slotIndex] = md5($id);
    }

    // Chest
    if (!isset($armorChecklist[$equips['chest']['id']])) {
        echo "Error: Chest={$equips['chest']['id']}\n";
    }

    $equips['chest']['id'] = md5($equips['chest']['id']);

    foreach ($equips['chest']['slotIds'] as $slotIndex => $id) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Slot={$id}\n";
        }

        $equips['chest']['slotIds'][$slotIndex] = md5($id);
    }

    // Arm
    if (!isset($armorChecklist[$equips['arm']['id']])) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Slot={$id}\n";
        }

        echo "Error: Arm={$equips['arm']['id']}\n";
    }

    $equips['arm']['id'] = md5($equips['arm']['id']);

    foreach ($equips['arm']['slotIds'] as $slotIndex => $id) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Slot={$id}\n";
        }

        $equips['arm']['slotIds'][$slotIndex] = md5($id);
    }

    // Waist
    if (!isset($armorChecklist[$equips['waist']['id']])) {
        echo "Error: Waist={$equips['waist']['id']}\n";
    }

    $equips['waist']['id'] = md5($equips['waist']['id']);

    foreach ($equips['waist']['slotIds'] as $slotIndex => $id) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Slot={$id}\n";
        }

        $equips['waist']['slotIds'][$slotIndex] = md5($id);
    }

    // Leg
    if (!isset($armorChecklist[$equips['leg']['id']])) {
        echo "Error: Leg={$equips['leg']['id']}\n";
    }

    $equips['leg']['id'] = md5($equips['leg']['id']);

    foreach ($equips['leg']['slotIds'] as $slotIndex => $id) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Slot={$id}\n";
        }

        $equips['leg']['slotIds'][$slotIndex] = md5($id);
    }

    // Charm
    if (!isset($charmChecklist[$equips['charm']['id']])) {
        echo "Error: Charm={$equips['charm']['id']}\n";
    }

    $equips['charm']['id'] = md5($equips['charm']['id']);

    $testData['equipsList'][$index] = $equips;
}

// Test Data: Require Condition
foreach ($testData['requireList'] as $index => $require) {

    // Set
    foreach ($require['sets'] as $setIndex => $set) {
        if (!isset($setChecklist[$set['id']])) {
            echo "Error: Set={$set['id']}\n";
        }

        $set['id'] = md5($set['id']);

        $require['sets'][$setIndex] = $set;
    }

    // Skill
    foreach ($require['skills'] as $skillIndex => $skill) {
        if (!isset($skillChecklist[$skill['id']])) {
            echo "Error: Set={$skill['id']}\n";
        }

        $skill['id'] = md5($skill['id']);

        $require['skills'][$skillIndex] = $skill;
    }

    $testData['requireList'][$index] = $require;
}

// Save Json
foreach ($datasetMap as $name => $data) {
    Misc::saveJson("datasets/{$name}", $data);
}

foreach ($langMap as $lang => $data) {
    Misc::saveJson("langs/{$lang}/dataset", $data);
}

Misc::saveJson("testData", $testData);
