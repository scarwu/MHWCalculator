#!/usr/bin/env php
<?php
error_reporting(E_ALL);

define('ROOT', __DIR__);

class Misc
{
    public static $uiLang = null;
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

    private static $codeLength = 3;
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
        $path = ROOT . "/../src/assets/scripts/{$name}.json";
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        @mkdir(dirname($path), 0755, true);

        return file_put_contents($path, $json);
    }

    public static function createCode ($text)
    {
        if (!is_string($text)) {
            return false;
        }

        $hash = md5($text);

        if (isset(self::$hashMap[$hash])) {
            return self::$hashMap[$hash];
        }

        if (null === self::$uiLang) {
            self::$uiLang = Misc::loadJson('../src/assets/scripts/langs/zhTW/ui');
        }

        $poolSize = count(self::$charPool);

        // Set Random Seed
        srand(self::$seed);

        while (true) {
            $code = '_';

            for ($i = 0; $i < self::$codeLength; $i++) {
                $code .= self::$charPool[rand() % $poolSize];
            }

            if (!isset(self::$codeMap[$code]) && !isset(self::$uiLang[$code])) {
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
            //             "white": 40,
            //             "purple": 0
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
                        $data['sharpness']['steps']['white'],
                        $data['sharpness']['steps']['purple']
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
                }, $data['skills']) : null,
                (null !== $data['set']) ? $data['set']['id'] : null,
            ];
            break;
        case 'armor':
            // {
            //     "series": {
            //         "id": "龍王的獨眼α",
            //         "name": {
            //             "zhTW": "龍王的獨眼α"
            //         },
            //         "rare": 8,
            //         "gender": "general",
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
            //     "items": [
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
                    $data['series']['id'],
                    $data['series']['name'],
                    $data['series']['rare'],
                    $data['series']['gender'],
                    $data['series']['defense'],
                    [
                        $data['series']['resistance']['fire'],
                        $data['series']['resistance']['water'],
                        $data['series']['resistance']['thunder'],
                        $data['series']['resistance']['ice'],
                        $data['series']['resistance']['dragon']
                    ],
                    (null !== $data['series']['set']) ? $data['series']['set']['id'] : null,
                ],
                array_map(function ($item) {
                    return [
                        $item['id'],
                        $item['name'],
                        $item['type'],
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
                }, $data['items'])
            ];
            break;
        case 'charm':
            // {
            //     "series": {
            //         "id": "迴避護石",
            //         "name": {
            //             "zhTW": "迴避護石",
            //             "jaJP": "回避の護石",
            //             "enUS": "Evasion Charm"
            //         }
            //     },
            //     "items": [
            //         {
            //             "id": "迴避護石 IV",
            //             "name": {
            //                 "zhTW": "迴避護石 IV",
            //                 "jaJP": "回避の護石 IV",
            //                 "enUS": "Evasion Charm IV"
            //             },
            //             "rare": 12,
            //             "level": 4,
            //             "skills": [
            //                 {
            //                     "id": "迴避性能",
            //                     "level": 4
            //                 }
            //             ]
            //         }
            //     ]
            // }
            Misc::$datasetMap['charms'][] = [
                [
                    $data['series']['id'],
                    $data['series']['name']
                ],
                array_map(function ($item) {
                    return [
                        $item['id'],
                        $item['name'],
                        $item['rare'],
                        $item['level'],
                        array_map(function ($skill) {
                            return [
                                $skill['id'],
                                $skill['level']
                            ];
                        }, $item['skills'])
                    ];
                }, $data['items'])
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
            //     "id": "攻擊力強化 (mhwib)",
            //     "name": {
            //         "zhTW": "攻擊力強化",
            //         "jaJP": null,
            //         "enUS": null
            //     },
            //     "allowRares": [ 10, 11, 12 ],
            //     "list": [
            //         {
            //             "level": 1,
            //             "description": {
            //                 "zhTW": "基礎攻擊力+5",
            //                 "jaJP": null,
            //                 "enUS": null
            //             },
            //             "allowRares": [ 10, 11, 12 ],
            //             "size": 1,
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
                $data['allowRares'],
                array_map(function ($item) {
                    return [
                        $item['level'],
                        $item['description'],
                        $item['allowRares'],
                        $item['size'],
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
            //     "description": {
            //         "zhTW": "體力+15"
            //     },
            //     "type": "active",
            //     "from" : {
            //         "set": false,
            //         "jewel": true,
            //         "armor": true,
            //         "chram": false,
            //         "weapon": false
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
            //             },
            //             "isHidden": false
            //         }
            //     ]
            // }
            Misc::$datasetMap['skills'][] = [
                $data['id'],
                $data['name'],
                $data['description'],
                $data['type'],
                [
                    $data['from']['set'],
                    $data['from']['jewel'],
                    $data['from']['armor'],
                    $data['from']['charm'],
                    $data['from']['weapon']
                ],
                array_map(function ($item) {
                    return [
                        $item['level'],
                        $item['description'],
                        $item['reaction'],
                        $item['isHidden']
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
            //     "from" : {
            //         "armor": true,
            //         "weapon": false
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
                [
                    $data['from']['armor'],
                    $data['from']['weapon']
                ],
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
// $_ = [
//     'zhTW' => Misc::loadJson('../src/assets/scripts/langs/zhTW/ui'),
//     'jaJP' => Misc::loadJson('../src/assets/scripts/langs/jaJP/ui'),
//     'enUS' => Misc::loadJson('../src/assets/scripts/langs/enUS/ui')
// ];

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
//     foreach ($armor['items'] as $item) {
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
//     'series' => $slotArmorCommon,
//     'list' => array_values($slotArmorList)
// ];

// Handle Enhances Data
foreach ($enhances as $enhance) {
    $enhanceChecklist[$enhance['id']] = true;

    // Create Translation Mapping
    $enhance['name'] = Misc::appendLangMap("enhance:name:{$enhance['id']}", $enhance['name']);

    foreach ($enhance['list'] as $index => $item) {
        $item['description'] = Misc::appendLangMap("enhance:{$enhance['id']}:list:{$index}:description", $item['description']);

        // Rewrite
        $enhance['list'][$index] = $item;
    }

    // Create ID Hash
    $enhance['id'] = Misc::createCode("enhance:name:{$enhance['id']}");

    // Create Dataset
    Misc::appendDatasetMap('enhance', $enhance);
}

// Handle Skill Data
foreach ($skills as $skill) {
    $skillChecklist[$skill['id']] = true;

    // Create Translation Mapping
    $skill['name'] = Misc::appendLangMap("skill:name:{$skill['id']}", $skill['name']);
    $skill['description'] = Misc::appendLangMap("skill:description:{$skill['id']}", $skill['description']);

    foreach ($skill['list'] as $index => $item) {
        $item['description'] = Misc::appendLangMap("skill:description:{$skill['id']}:{$index}", $item['description']);

        // Create ID Hash
        if (is_array($item['reaction'])
            && isset($item['reaction']['enableSkillLevel'])
        ) {
            if (true === isset($item['reaction']['enableSkillLevel']['id'])) {
                $item['reaction']['enableSkillLevel']['id'] = Misc::createCode("skill:name:{$item['reaction']['enableSkillLevel']['id']}");
            }

            if (true === isset($item['reaction']['enableSkillLevel']['ids'])) {
                $item['reaction']['enableSkillLevel']['ids'] = array_map(function ($skillId) {
                    return Misc::createCode("skill:name:{$skillId}");
                }, $item['reaction']['enableSkillLevel']['ids']);
            }
        }

        // Rewrite
        $skill['list'][$index] = $item;
    }

    // Create ID Hash
    $skill['id'] = Misc::createCode("skill:name:{$skill['id']}");

    // Create Dataset
    Misc::appendDatasetMap('skill', $skill);
}

// Handle Set Data
foreach ($sets as $set) {
    $setChecklist[$set['id']] = true;

    // Checklist
    if (is_array($set['skills'])) {
        foreach ($set['skills'] as $skill) {
            if (!isset($skillChecklist[$skill['id']])) {
                echo "Error: Set={$set['id']}, Skill={$skill['id']}\n";
            }
        }
    }

    // Create Translation Mapping
    $set['name'] = Misc::appendLangMap("set:name:{$set['id']}", $set['name']);

    // Create ID Hash
    $set['id'] = Misc::createCode("set:name:{$set['id']}");
    $set['skills'] = array_map(function ($skill) {
        $skill['id'] = Misc::createCode("skill:name:{$skill['id']}");

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
    $weapon['name'] = Misc::appendLangMap("weapon:name:{$weapon['id']}", $weapon['name']);
    $weapon['series'] = Misc::appendLangMap("weapon:series:{$weapon['id']}", $weapon['series']);

    // Create ID Hash
    $weapon['id'] = Misc::createCode("weapon:name:{$weapon['id']}");

    if (is_array($weapon['skills']) && 0 !== count($weapon['skills'])) {
        $weapon['skills'] = array_map(function ($skill) {
            $skill['id'] = Misc::createCode("skill:name:{$skill['id']}");

            return $skill;
        }, $weapon['skills']);
    }

    // Create ID Hash
    if (is_array($weapon['set'])) {
        $weapon['set']['id'] = Misc::createCode("set:name:{$weapon['set']['id']}");
    }

    // Create Dataset
    Misc::appendDatasetMap('weapon', $weapon);
}

// Handler Armor Data
foreach ($armors as $index => $armor) {

    // Checklist
    if (is_array($armor['series']['set'])) {
        if (!isset($setChecklist[$armor['series']['set']['id']])) {
            echo "Error: Set={$armor['series']['set']['id']}\n";
        }
    }

    foreach ($armor['items'] as $item) {
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
    if (is_array($armor['series']['set'])) {
        $armor['series']['set']['id'] = Misc::createCode("set:name:{$armor['series']['set']['id']}");
    }

    // Create Translation Mapping
    $armor['series']['name'] = Misc::appendLangMap("armor:series:{$armor['series']['id']}", $armor['series']['name']);

    // Create ID Hash
    $armor['series']['id'] = Misc::createCode("armor:series:{$armor['series']['id']}");

    foreach ($armor['items'] as $index => $item) {

        // Create Translation Mapping
        $item['name'] = Misc::appendLangMap("armor:name:{$item['id']}", $item['name']);

        // Create ID Hash
        $item['id'] = Misc::createCode("armor:name:{$item['id']}");

        if (is_array($item['skills']) && 0 !== count($item['skills'])) {
            $item['skills'] = array_map(function ($skill) {
                $skill['id'] = Misc::createCode("skill:name:{$skill['id']}");

                return $skill;
            }, $item['skills']);
        }

        // Rewrite
        $armor['items'][$index] = $item;
    }

    // Create Dataset
    Misc::appendDatasetMap('armor', $armor);
}

// Handle Charm Data
foreach ($charms as $charm) {

    foreach ($charm['items'] as $item) {
        $charmChecklist[$item['id']] = true;

        if (is_array($item['skills'])) {
            foreach ($item['skills'] as $skill) {
                if (!isset($skillChecklist[$skill['id']])) {
                    echo "Error: Armor={$item['id']}, Skill={$skill['id']}\n";
                }
            }
        }
    }

    // Create Translation Mapping
    $charm['series']['name'] = Misc::appendLangMap("armor:series:{$charm['series']['id']}", $charm['series']['name']);

    // Create ID Hash
    $charm['series']['id'] = Misc::createCode("armor:series:{$charm['series']['id']}");

    foreach ($charm['items'] as $index => $item) {

        // Create Translation Mapping
        $item['name'] = Misc::appendLangMap("armor:name:{$item['id']}", $item['name']);

        // Create ID Hash
        $item['id'] = Misc::createCode("armor:name:{$item['id']}");

        if (is_array($item['skills']) && 0 !== count($item['skills'])) {
            $item['skills'] = array_map(function ($skill) {
                $skill['id'] = Misc::createCode("skill:name:{$skill['id']}");

                return $skill;
            }, $item['skills']);
        }

        // Rewrite
        $charm['items'][$index] = $item;
    }

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
    $jewel['name'] = Misc::appendLangMap("jewel:name:{$jewel['id']}", $jewel['name']);

    // Create ID Hash
    $jewel['id'] = Misc::createCode("jewel:name:{$jewel['id']}");
    $jewel['skills'] = array_map(function ($skill) {
        $skill['id'] = Misc::createCode("skill:name:{$skill['id']}");

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

    $equips['weapon']['id'] = Misc::createCode("weapon:name:{$equips['weapon']['id']}");

    if (isset($equips['weapon']['enhances'])) {
        foreach ($equips['weapon']['enhances'] as $enhanceIndex => $item) {
            if (!isset($enhanceChecklist[$item['id']])) {
                echo "Error: Enhance={$item['id']}\n";
            }

            $item['id'] = Misc::createCode("enhance:name:{$item['id']}");

            $equips['weapon']['enhances'][$enhanceIndex] = $item;
        }
    }

    if (isset($equips['weapon']['slotIds'])) {
        foreach ($equips['weapon']['slotIds'] as $slotIndex => $id) {
            if (!isset($jewelChecklist[$id])) {
                echo "Error: Weapon Slot={$id}\n";
            }

            $equips['weapon']['slotIds'][$slotIndex] = Misc::createCode("jewel:name:{$id}");
        }
    }

    // Helm
    if (!isset($armorChecklist[$equips['helm']['id']])) {
        echo "Error: Helm={$equips['helm']['id']}\n";
    }

    $equips['helm']['id'] = Misc::createCode("armor:name:{$equips['helm']['id']}");

    if (isset($equips['helm']['slotIds'])) {
        foreach ($equips['helm']['slotIds'] as $slotIndex => $id) {
            if (!isset($jewelChecklist[$id])) {
                echo "Error: Helm Slot={$id}\n";
            }

            $equips['helm']['slotIds'][$slotIndex] = Misc::createCode("jewel:name:{$id}");
        }
    }

    // Chest
    if (!isset($armorChecklist[$equips['chest']['id']])) {
        echo "Error: Chest={$equips['chest']['id']}\n";
    }

    $equips['chest']['id'] = Misc::createCode("armor:name:{$equips['chest']['id']}");

    if (isset($equips['chest']['slotIds'])) {
        foreach ($equips['chest']['slotIds'] as $slotIndex => $id) {
            if (!isset($jewelChecklist[$id])) {
                echo "Error: Chest Slot={$id}\n";
            }

            $equips['chest']['slotIds'][$slotIndex] = Misc::createCode("jewel:name:{$id}");
        }
    }

    // Arm
    if (!isset($armorChecklist[$equips['arm']['id']])) {
        if (!isset($jewelChecklist[$id])) {
            echo "Error: Arm Slot={$id}\n";
        }

        echo "Error: Arm={$equips['arm']['id']}\n";
    }

    $equips['arm']['id'] = Misc::createCode("armor:name:{$equips['arm']['id']}");

    if (isset($equips['arm']['slotIds'])) {
        foreach ($equips['arm']['slotIds'] as $slotIndex => $id) {
            if (!isset($jewelChecklist[$id])) {
                echo "Error: Arm Slot={$id}\n";
            }

            $equips['arm']['slotIds'][$slotIndex] = Misc::createCode("jewel:name:{$id}");
        }
    }

    // Waist
    if (!isset($armorChecklist[$equips['waist']['id']])) {
        echo "Error: Waist={$equips['waist']['id']}\n";
    }

    $equips['waist']['id'] = Misc::createCode("armor:name:{$equips['waist']['id']}");

    if (isset($equips['waist']['slotIds'])) {
        foreach ($equips['waist']['slotIds'] as $slotIndex => $id) {
            if (!isset($jewelChecklist[$id])) {
                echo "Error: Waist Slot={$id}\n";
            }

            $equips['waist']['slotIds'][$slotIndex] = Misc::createCode("jewel:name:{$id}");
        }
    }

    // Leg
    if (!isset($armorChecklist[$equips['leg']['id']])) {
        echo "Error: Leg={$equips['leg']['id']}\n";
    }

    $equips['leg']['id'] = Misc::createCode("armor:name:{$equips['leg']['id']}");

    if (isset($equips['leg']['slotIds'])) {
        foreach ($equips['leg']['slotIds'] as $slotIndex => $id) {
            if (!isset($jewelChecklist[$id])) {
                echo "Error: Leg Slot={$id}\n";
            }

            $equips['leg']['slotIds'][$slotIndex] = Misc::createCode("jewel:name:{$id}");
        }
    }

    // Charm
    if (!isset($charmChecklist[$equips['charm']['id']])) {
        echo "Error: Charm={$equips['charm']['id']}\n";
    }

    $equips['charm']['id'] = Misc::createCode("charm:name:{$equips['charm']['id']}");

    $testData['equipsList'][$index] = $equips;
}

// Test Data: Require Condition
foreach ($testData['requireList'] as $index => $require) {

    // Set
    foreach ($require['sets'] as $setIndex => $set) {
        if (!isset($setChecklist[$set['id']])) {
            echo "Error: Set={$set['id']}\n";
        }

        $set['id'] = Misc::createCode("set:name:{$set['id']}");

        $require['sets'][$setIndex] = $set;
    }

    // Skill
    foreach ($require['skills'] as $skillIndex => $skill) {
        if (!isset($skillChecklist[$skill['id']])) {
            echo "Error: Set={$skill['id']}\n";
        }

        $skill['id'] = Misc::createCode("skill:name:{$skill['id']}");

        $require['skills'][$skillIndex] = $skill;
    }

    $testData['requireList'][$index] = $require;
}

// Save Json
echo "\n";
echo "Dataset\n";
echo "---\n";

foreach (Misc::$datasetMap as $name => $data) {
    if ('armors' === $name || 'charms' === $name) {
        $count = 0;

        foreach ($data as $bundle) {
            $count += count($bundle[1]);
        }

        echo "{$name} => " . count($data) . "({$count})\n";
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
