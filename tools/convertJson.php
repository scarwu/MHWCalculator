#!/usr/bin/env php
<?php

error_reporting(E_ALL);
define('ROOT', __DIR__);

class Misc
{
    public static $langMap = [];
    public static $datasetMap = [
        'weapons' => [],
        'armors' => [],
        'charms' => [],
        'jewels' => [],
        'enhances' => [],
        'skills' => [],
        'sets' => []
    ];

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
        $path = ROOT . "/../src/assets/scripts/files/json/{$name}.json";
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        @mkdir(dirname($path), 0755, true);

        return file_put_contents($path, $json);
    }

    private static function createCode ($text)
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

            echo '*';
        }

        // Reset Random Seed
        srand();

        // Increase Seed
        self::$seed++;

        return $code;
    }

    public static function appendLangMap ($uniqueStr, $pack)
    {
        $code = self::createCode($uniqueStr);

        foreach ($pack as $lang => $translation) {
            if (null === $translation) {
                continue;
            }

            if (!isset(self::$langMap[$lang])) {
                self::$langMap[$lang] = [];
            }

            self::$langMap[$lang][$code] = $translation;
        }

        return $code;
    }

    public static function appendDatasetMap ($name, $data)
    {
        switch ($name) {
        case 'weapon':
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
            Misc::$datasetMap['weapons'][] = [
                $data['id'],
                $data['rare'],
                $data['type'],
                $data['series'],
                $data['name'],
                $data['attack'],
                $data['criticalRate'],
                $data['defense'],
                (null !== $data['sharpness']) ? [
                    $data['sharpness']['value'],
                    [
                        $data['sharpness']['steps']['red'],
                        $data['sharpness']['steps']['orange'],
                        $data['sharpness']['steps']['yellow'],
                        $data['sharpness']['steps']['green'],
                        $data['sharpness']['steps']['blue'],
                        $data['sharpness']['steps']['white']
                    ]
                ] : null,
                [
                    (null !== $data['element']['attack']) ? [
                        $data['element']['attack']['type'],
                        $data['element']['attack']['minValue'],
                        $data['element']['attack']['maxValue'],
                        $data['element']['attack']['isHidden']
                    ] : null,
                    (null !== $data['element']['status']) ? [
                        $data['element']['status']['type'],
                        $data['element']['status']['minValue'],
                        $data['element']['status']['maxValue'],
                        $data['element']['status']['isHidden']
                    ] : null
                ],
                (null !== $data['elderseal']) ? $data['elderseal']['affinity'] : null,
                (null !== $data['slots']) ? array_map(function ($slot) {
                    return $slot['size'];
                }, $data['slots']) : null,
                (null !== $data['skills']) ? array_map(function ($skill) {
                    return [
                        $skill['id'],
                        $skill['level']
                    ];
                }, $data['skills']) : null
            ];
            break;
        case 'armor':
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
            Misc::$datasetMap['armors'][] = [
                [
                    $data['common']['rare'],
                    $data['common']['gender'],
                    $data['common']['series'],
                    $data['common']['defense'],
                    [
                        $data['common']['resistance']['fire'],
                        $data['common']['resistance']['water'],
                        $data['common']['resistance']['thunder'],
                        $data['common']['resistance']['ice'],
                        $data['common']['resistance']['dragon']
                    ],
                    (null !== $data['common']['set']) ? $data['common']['set']['id'] : null,
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
                }, $data['list'])
            ];
            break;
        case 'charm':
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
            Misc::$datasetMap['charms'][] = [
                $data['id'],
                $data['name'],
                $data['rare'],
                array_map(function ($item) {
                    return [
                        $item['id'],
                        $item['level']
                    ];
                }, $data['skills'])
            ];
            break;
        case 'jewel':
            // {
            //     "id": "増彈珠",
            //     "name": {
            //         "zhTW": "増彈珠"
            //     },
            //     "rare": 7,
            //     "size": 2,
            //     "skills": [
            //         {
            //             "id": "砲彈裝填數UP",
            //             "level": 1
            //         }
            //     ]
            // }
            Misc::$datasetMap['jewels'][] = [
                $data['id'],
                $data['name'],
                $data['rare'],
                $data['size'],
                array_map(function ($item) {
                    return [
                        $item['id'],
                        $item['level']
                    ];
                }, $data['skills'])
            ];
            break;
        case 'enhance':
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
            //         }
            //     ]
            // }
            Misc::$datasetMap['enhances'][] = [
                $data['id'],
                $data['name'],
                array_map(function ($item) {
                    return [
                        $item['level'],
                        $item['description'],
                        $item['reaction']
                    ];
                }, $data['list'])
            ];
            break;
        case 'skill':
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
            //         }
            //     ]
            // }
            Misc::$datasetMap['skills'][] = [
                $data['id'],
                $data['name'],
                $data['type'],
                [
                    $data['from']['set'],
                    $data['from']['jewel'],
                    $data['from']['armor']
                ],
                array_map(function ($item) {
                    return [
                        $item['level'],
                        $item['description'],
                        $item['reaction']
                    ];
                }, $data['list'])
            ];
            break;
        case 'set':
            // {
            //     "id": "蠻顎龍之力",
            //     "name": {
            //         "zhTW": "蠻顎龍之力"
            //     },
            //     "skills": [
            //         {
            //             "id": "振奮",
            //             "level": 1,
            //             "require": 3
            //         }
            //     ]
            // }
            Misc::$datasetMap['sets'][] = [
                $data['id'],
                $data['name'],
                array_map(function ($item) {
                    return [
                        $item['id'],
                        $item['level'],
                        $item['require']
                    ];
                }, $data['skills'])
            ];
            break;
        }
    }
}

/**
 * Load Json Files
 */
$weapons = [];
$armors = [];
$charms =  [];
$jewels =  [];
$enhances =  [];
$skills =  [];
$sets =  [];

// MHW
foreach ([
    'greatSword', 'longSword', 'swordAndShield', 'dualBlades',
    'hammer', 'huntingHorn', 'lance', 'gunlance',
    'switchAxe', 'chargeBlade', 'insectGlaive',
    'lightBowgun', 'heavyBowgun', 'bow'
] as $type) {
    for ($level = 6; $level <= 8; $level++) {
        $weapons = array_merge($weapons, Misc::loadJson("mhw/weapons/$type/rare{$level}"));
    }
}

for ($level = 5; $level <= 8; $level++) {
    $armors = array_merge($armors, Misc::loadJson("mhw/armors/rare{$level}"));
}

$charms = array_merge($charms, Misc::loadJson('mhw/charms'));
$jewels = array_merge($jewels, Misc::loadJson('mhw/jewels'));
$enhances = array_merge($enhances, Misc::loadJson('mhw/enhances'));
$skills = array_merge($skills, Misc::loadJson('mhw/skills'));
$sets = array_merge($sets, Misc::loadJson('mhw/sets'));

// MHW: IB
foreach ([
    'greatSword', 'longSword', 'swordAndShield', 'dualBlades',
    'hammer', 'huntingHorn', 'lance', 'gunlance',
    'switchAxe', 'chargeBlade', 'insectGlaive',
    'lightBowgun', 'heavyBowgun', 'bow'
] as $type) {
    for ($level = 9; $level <= 12; $level++) {
        $weapons = array_merge($weapons, Misc::loadJson("mhwib/weapons/$type/rare{$level}"));
    }
}

for ($level = 9; $level <= 12; $level++) {
    $armors = array_merge($armors, Misc::loadJson("mhwib/armors/rare{$level}"));
}

$charms = array_merge($charms, Misc::loadJson('mhwib/charms'));
$jewels = array_merge($jewels, Misc::loadJson('mhwib/jewels'));
$enhances = array_merge($enhances, Misc::loadJson('mhwib/enhances'));
$skills = array_merge($skills, Misc::loadJson('mhwib/skills'));
$sets = array_merge($sets, Misc::loadJson('mhwib/sets'));

$testData = Misc::loadJson('testData');

/**
 * Check Enhance, Skill, Set & Create Lang, Dataset
 */
$enhanceChecklist = [];
$skillChecklist = [];
$setChecklist = [];
$weaponChecklist = [];
$armorChecklist = [];
$charmChecklist = [];
$jewelChecklist = [];

// Load Lang
$_ = [
    'zhTW' => Misc::loadJson('../src/assets/scripts/files/json/langs/zhTW/ui'),
    'jaJP' => Misc::loadJson('../src/assets/scripts/files/json/langs/jaJP/ui'),
    'enUS' => Misc::loadJson('../src/assets/scripts/files/json/langs/enUS/ui')
];

// Extend Weapons
// $slotWeapons = [];

// foreach ($weapons as $weapon) {
//     if (!is_array($weapon['slots']) || 0 === count($weapon['slots'])) {
//         continue;
//     }

//     usort($weapon['slots'], function ($slotA, $slotB) {
//         return $slotA['size'] <> $slotB['size'];
//     });

//     $id = "{$weapon['type']} " . implode('-', array_map(function ($slot) {
//         return $slot['size'];
//     }, $weapon['slots']));

//     $name = [];
//     $series = [];

//     foreach (array_keys($_) as $lang) {
//         $name[$lang] = "{$_[$lang]['slot']}-{$_[$lang][$weapon['type']]} " . implode('', array_map(function ($slot) {
//             return "[{$slot['size']}]";
//         }, $weapon['slots']));

//         $series[$lang] = $_[$lang]['slot'];
//     }

//     $slotWeapons[$id] = [
//         'id' => $id,
//         'name' => $name,
//         'rare' => 0,
//         'type' => $weapon['type'],
//         'series' => $series,
//         'attack' => 0,
//         'criticalRate' => 0,
//         'defense' => 0,
//         'sharpness' => null,
//         'element' => [
//             'attack' => null,
//             'status' => null
//         ],
//         'elderseal' => null,
//         'slots' => $weapon['slots'],
//         'skills' => null
//     ];
// }

// ksort($slotWeapons);

// $weapons = array_merge($weapons, array_values($slotWeapons));

// Extend Armors
// $slotArmorCommon = [];
// $slotArmorList = [];

// $series = [];

// foreach (array_keys($_) as $lang) {
//     $series[$lang] = $_[$lang]['slot'];
// }

// $slotArmorCommon = [
//     'rare' => 0,
//     'gender' => 'general',
//     'series' => $series,
//     'defense' => 0,
//     'resistance' => [
//         'fire' => 0,
//         'water' => 0,
//         'thunder' => 0,
//         'ice' => 0,
//         'dragon' => 0
//     ],
//     'set' => null
// ];

// foreach ($armors as $armor) {
//     foreach ($armor['list'] as $item) {
//         if (!is_array($item['slots']) || 0 === count($item['slots'])) {
//             continue;
//         }

//         usort($item['slots'], function ($slotA, $slotB) {
//             return $slotA['size'] <> $slotB['size'];
//         });

//         $id = "{$item['type']} " . implode('-', array_map(function ($slot) {
//             return $slot['size'];
//         }, $item['slots']));

//         $name = [];

//         foreach (array_keys($_) as $lang) {
//             $name[$lang] = "{$_[$lang]['slot']}-{$_[$lang][$item['type']]} " . implode('', array_map(function ($slot) {
//                 return "[{$slot['size']}]";
//             }, $item['slots']));
//         }

//         $slotArmorList[$id] = [
//             'id' => $id,
//             'name' => $name,
//             'type' => $item['type'],
//             'slots' => $item['slots'],
//             'skills' => null
//         ];
//     }
// }

// ksort($slotArmorList);

// $armors[] = [
//     'common' => $slotArmorCommon,
//     'list' => array_values($slotArmorList)
// ];

// Handle Enhances Data
foreach ($enhances as $enhance) {
    $enhanceChecklist[$enhance['id']] = true;

    // Create Translation Mapping
    $enhance['name'] = Misc::appendLangMap("enhance:{$enhance['id']}:name", $enhance['name']);

    foreach ($enhance['list'] as $index => $item) {
        $item['description'] = Misc::appendLangMap("enhance:{$enhance['id']}:list:{$index}:description", $item['description']);

        // Rewrite
        $enhance['list'][$index] = $item;
    }

    // Create ID Hash
    $enhance['id'] = md5($enhance['id']);

    // Create Dataset
    Misc::appendDatasetMap('enhance', $enhance);
}

// Handle Skill Data
foreach ($skills as $skill) {
    $skillChecklist[$skill['id']] = true;

    // Create Translation Mapping
    $skill['name'] = Misc::appendLangMap("skill:{$skill['id']}:name", $skill['name']);

    foreach ($skill['list'] as $index => $item) {
        $item['description'] = Misc::appendLangMap("skill:{$skill['id']}:list:{$index}:description", $item['description']);

        // Rewrite
        $skill['list'][$index] = $item;
    }

    // Create ID Hash
    $skill['id'] = md5($skill['id']);

    // Create Dataset
    Misc::appendDatasetMap('skill', $skill);
}

// Handle Set Data
foreach ($sets as $set) {
    $setChecklist[$set['id']] = true;

    // Create Translation Mapping
    $set['name'] = Misc::appendLangMap("set:{$set['id']}:name", $set['name']);

    // Create ID Hash
    $set['id'] = md5($set['id']);
    $set['skills'] = array_map(function ($skill) {
        $skill['id'] = md5($skill['id']);

        return $skill;
    }, $set['skills']);

    // Create Dataset
    Misc::appendDatasetMap('set', $set);
}

// Handle Weapon Data
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
    $weapon['name'] = Misc::appendLangMap("weapon:{$weapon['id']}:name", $weapon['name']);
    $weapon['series'] = Misc::appendLangMap("weapon:{$weapon['series']['zhTW']}:series", $weapon['series']);

    // Create ID Hash
    $weapon['id'] = md5($weapon['id']);

    if (is_array($weapon['skills']) && 0 !== count($weapon['skills'])) {
        $weapon['skills'] = array_map(function ($skill) {
            $skill['id'] = md5($skill['id']);

            return $skill;
        }, $weapon['skills']);
    }

    // Create Dataset
    Misc::appendDatasetMap('weapon', $weapon);
}

// Handler Armor Data
foreach ($armors as $index => $armor) {

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
    $armor['common']['series'] = Misc::appendLangMap("armor:common:{$armor['common']['series']['zhTW']}:series", $armor['common']['series']);

    foreach ($armor['list'] as $index => $item) {

        // Create Translation Mapping
        $item['name'] = Misc::appendLangMap("armor:{$index}:list:{$item['id']}:name", $item['name']);

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
    Misc::appendDatasetMap('armor', $armor);
}

// Handle Charm Data
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
    $charm['name'] = Misc::appendLangMap("charm:{$charm['id']}:name", $charm['name']);

    // Create ID Hash
    $charm['id'] = md5($charm['id']);
    $charm['skills'] = array_map(function ($skill) {
        $skill['id'] = md5($skill['id']);

        return $skill;
    }, $charm['skills']);

    // Create Dataset
    Misc::appendDatasetMap('charm', $charm);
}

// handler Jewel Data
foreach ($jewels as $jewel) {
    $jewelChecklist[$jewel['id']] = true;

    // Checklist
    if (is_array($jewel['skills'])) {
        foreach ($jewel['skills'] as $skill) {
            if (!isset($skillChecklist[$skill['id']])) {
                echo "Error: Charm={$jewel['id']}, Skill={$skill['id']}\n";
            }
        }
    }

    // Create Translation Mapping
    $jewel['name'] = Misc::appendLangMap("jewel:{$jewel['id']}:name", $jewel['name']);

    // Create ID Hash
    $jewel['id'] = md5($jewel['id']);
    $jewel['skills'] = array_map(function ($skill) {
        $skill['id'] = md5($skill['id']);

        return $skill;
    }, $jewel['skills']);

    // Create Dataset
    Misc::appendDatasetMap('jewel', $jewel);
}

echo "\n";

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
echo "\n";
echo "Dataset\n";
echo "---\n";

foreach (Misc::$datasetMap as $name => $data) {
    if ('armors' === $name) {
        $count = 0;

        foreach ($data as $bundle) {
            $count += count($bundle[1]);
        }

        echo "{$name} => {$count}\n";
    } else {
        echo "{$name} => " . count($data) . "\n";
    }

    Misc::saveJson("datasets/{$name}", $data);
}

echo "\n";
echo "Lang\n";
echo "---\n";

foreach (Misc::$langMap as $lang => $data) {
    echo "{$lang} => " . count($data) . "\n";

    Misc::saveJson("langs/{$lang}/dataset", $data);
}

Misc::saveJson("testData", $testData);
