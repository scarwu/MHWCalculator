'use strict';
/**
 * Dataset Weapons
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

export default [
    {
        "name": "撲滅導燈",
        "rare": 8,
        "type": "insectGlaive",
        "series": "滅盡龍",
        "attack": 651,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 400,
            "steps": {
                "red": 100,
                "orange": 120,
                "yellow": 40,
                "green": 50,
                "blue": 90,
                "white": 0
            }
        },
        "element": {
            "attack": {
                "type": "dragon",
                "minValue": 150,
                "maxValue": 200,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": {
            "affinity": "high"
        },
        "slots": [
            {
                "size": 1
            }
        ],
        "skills": null
    },
    {
        "name": "惡【VICE】",
        "rare": 8,
        "type": "insectGlaive",
        "series": "慘爪龍",
        "attack": 496,
        "criticalRate": 20,
        "defense": 0,
        "sharpness": {
            "value": 400,
            "steps": {
                "red": 200,
                "orange": 70,
                "yellow": 20,
                "green": 20,
                "blue": 50,
                "white": 40
            }
        },
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 150,
                "maxValue": 200,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": [
            {
                "size": 2
            }
        ],
        "skills": null
    },
    {
        "name": "碧綠神鳴",
        "rare": 8,
        "type": "insectGlaive",
        "series": "幻獸",
        "attack": 496,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 110,
                "orange": 20,
                "yellow": 20,
                "green": 120,
                "blue": 130,
                "white": 0
            }
        },
        "element": {
            "attack": {
                "type": "thunder",
                "minValue": 360,
                "maxValue": 470,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "冰體鋼龍棍",
        "rare": 8,
        "type": "insectGlaive",
        "series": "黑鋼",
        "attack": 558,
        "criticalRate": 10,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 90,
                "orange": 60,
                "yellow": 80,
                "green": 80,
                "blue": 70,
                "white": 20
            }
        },
        "element": {
            "attack": {
                "type": "ice",
                "minValue": 180,
                "maxValue": 230,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": [
            {
                "size": 2
            }
        ],
        "skills": null
    },
    {
        "name": "冥燈龍長刀",
        "rare": 8,
        "type": "insectGlaive",
        "series": "冥燈龍",
        "attack": 558,
        "criticalRate": 15,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 130,
                "orange": 30,
                "yellow": 60,
                "green": 80,
                "blue": 40,
                "white": 60
            }
        },
        "element": {
            "attack": {
                "type": "dragon",
                "minValue": 120,
                "maxValue": 160,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": {
            "affinity": "low"
        },
        "slots": [
            {
                "size": 3
            },
            {
                "size": 3
            }
        ],
        "skills": null
    },
    {
        "name": "鎧羅長刀．冰",
        "rare": 8,
        "type": "insectGlaive",
        "series": "絢輝龍",
        "attack": 527,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 110,
                "orange": 30,
                "yellow": 60,
                "green": 80,
                "blue": 40,
                "white": 80
            }
        },
        "element": {
            "attack": {
                "type": "ice",
                "minValue": 390,
                "maxValue": null,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": [
            {
                "size": 3
            }
        ],
        "skills": null
    },
    {
        "name": "鎧羅長刀．麻痺",
        "rare": 8,
        "type": "insectGlaive",
        "series": "絢輝龍",
        "attack": 620,
        "criticalRate": 0,
        "defense": 30,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 70,
                "orange": 50,
                "yellow": 50,
                "green": 80,
                "blue": 150,
                "white": 0
            }
        },
        "element": {
            "attack": null,
            "status": {
                "type": "paralysis",
                "minValue": 300,
                "maxValue": null,
                "isHidden": true
            }
        },
        "elderseal": null,
        "slots": [
            {
                "size": 3
            }
        ],
        "skills": null
    },
    {
        "name": "鎧羅長刀．水",
        "rare": 8,
        "type": "insectGlaive",
        "series": "絢輝龍",
        "attack": 620,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 70,
                "orange": 50,
                "yellow": 60,
                "green": 120,
                "blue": 60,
                "white": 40
            }
        },
        "element": {
            "attack": {
                "type": "water",
                "minValue": 360,
                "maxValue": null,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": [
            {
                "size": 3
            }
        ],
        "skills": null
    },
    {
        "name": "皇后長鞭．炎妃",
        "rare": 8,
        "type": "insectGlaive",
        "series": "炎妃龍",
        "attack": 589,
        "criticalRate": 20,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 100,
                "orange": 30,
                "yellow": 60,
                "green": 90,
                "blue": 30,
                "white": 90
            }
        },
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 150,
                "maxValue": 190,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": [
            {
                "size": 1
            }
        ],
        "skills": [
            {
                "name": "毅力",
                "level": 1
            }
        ]
    },
    {
        "name": "皇后長鞭．滅盡",
        "rare": 8,
        "type": "insectGlaive",
        "series": "炎妃龍．滅盡",
        "attack": 620,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 100,
                "orange": 30,
                "yellow": 60,
                "green": 90,
                "blue": 30,
                "white": 90
            }
        },
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 120,
                "maxValue": 150,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": [
            {
                "size": 2
            }
        ],
        "skills": [
            {
                "name": "加速再生",
                "level": 1
            }
        ]
    },
    {
        "name": "皇后長鞭．冥燈",
        "rare": 8,
        "type": "insectGlaive",
        "series": "炎妃龍．冥燈",
        "attack": 589,
        "criticalRate": 10,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 100,
                "orange": 30,
                "yellow": 60,
                "green": 90,
                "blue": 30,
                "white": 90
            }
        },
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 210,
                "maxValue": 260,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": [
            {
                "size": 3
            },
            {
                "size": 1
            }
        ],
        "skills": [
            {
                "name": "利刃／彈藥節約",
                "level": 1
            }
        ]
    },
    {
        "name": "穿心槍蓋博爾格．真",
        "rare": 8,
        "type": "insectGlaive",
        "series": "蓋博爾格",
        "attack": 589,
        "criticalRate": 20,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 60,
                "orange": 60,
                "yellow": 20,
                "green": 150,
                "blue": 90,
                "white": 20
            }
        },
        "element": {
            "attack": {
                "type": "dragon",
                "minValue": 300,
                "maxValue": 390,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": {
            "affinity": "high"
        },
        "slots": [
            {
                "size": 2
            }
        ],
        "skills": null
    }
]