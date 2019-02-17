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
        "name": "滅鬼凶器",
        "rare": 8,
        "type": "greatSword",
        "series": "滅盡龍",
        "attack": 1008,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 400,
            "steps": {
                "red": 110,
                "orange": 120,
                "yellow": 40,
                "green": 50,
                "blue": 80,
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
        "name": "火龍煌劍",
        "rare": 8,
        "type": "greatSword",
        "series": "火龍",
        "attack": 912,
        "criticalRate": 15,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 90,
                "orange": 60,
                "yellow": 60,
                "green": 100,
                "blue": 60,
                "white": 30
            }
        },
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 240,
                "maxValue": 310,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": [
            {
                "size": 1
            }
        ],
        "skills": null
    },
    {
        "name": "魔物的憤怒",
        "rare": 8,
        "type": "greatSword",
        "series": "屍套龍",
        "attack": 960,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
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
                "type": "dragon",
                "minValue": 300,
                "maxValue": 390,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": {
            "affinity": "medium"
        },
        "slots": [
            {
                "size": 2
            }
        ],
        "skills": null
    },
    {
        "name": "召雷劍【麒麟王】",
        "rare": 8,
        "type": "greatSword",
        "series": "幻獸",
        "attack": 768,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 110,
                "orange": 20,
                "yellow": 20,
                "green": 150,
                "blue": 100,
                "white": 0
            }
        },
        "element": {
            "attack": {
                "type": "thunder",
                "minValue": 540,
                "maxValue": 690,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鋼龍凍大劍",
        "rare": 8,
        "type": "greatSword",
        "series": "黑鋼",
        "attack": 864,
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
                "minValue": 270,
                "maxValue": 350,
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
        "name": "冥燈龍大劍",
        "rare": 8,
        "type": "greatSword",
        "series": "冥燈龍",
        "attack": 816,
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
                "minValue": 210,
                "maxValue": 270,
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
        "name": "龍顎劍【大牙】",
        "rare": 8,
        "type": "greatSword",
        "series": "工房武器",
        "attack": 960,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 110,
                "orange": 120,
                "yellow": 40,
                "green": 50,
                "blue": 80,
                "white": 0
            }
        },
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 330,
                "maxValue": 410,
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
        "name": "鎧羅炎．冰",
        "rare": 8,
        "type": "greatSword",
        "series": "絢輝龍",
        "attack": 912,
        "criticalRate": 10,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 60,
                "orange": 50,
                "yellow": 60,
                "green": 120,
                "blue": 70,
                "white": 40
            }
        },
        "element": {
            "attack": {
                "type": "ice",
                "minValue": 510,
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
        "name": "鎧羅炎．睡眠",
        "rare": 8,
        "type": "greatSword",
        "series": "絢輝龍",
        "attack": 912,
        "criticalRate": 0,
        "defense": 30,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 80,
                "orange": 50,
                "yellow": 60,
                "green": 120,
                "blue": 50,
                "white": 40
            }
        },
        "element": {
            "attack": null,
            "status": {
                "type": "sleep",
                "minValue": 450,
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
        "name": "鎧羅炎．水",
        "rare": 8,
        "type": "greatSword",
        "series": "絢輝龍",
        "attack": 912,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 150,
                "orange": 100,
                "yellow": 30,
                "green": 30,
                "blue": 60,
                "white": 30
            }
        },
        "element": {
            "attack": {
                "type": "water",
                "minValue": 540,
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
        "name": "皇后盔．炎妃",
        "rare": 8,
        "type": "greatSword",
        "series": "炎妃龍",
        "attack": 864,
        "criticalRate": 20,
        "defense": 0,
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
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 270,
                "maxValue": 330,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": [
            {
                "size": 2
            },
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
        "name": "皇后盔．滅盡",
        "rare": 8,
        "type": "greatSword",
        "series": "炎妃龍．滅盡",
        "attack": 912,
        "criticalRate": 0,
        "defense": 0,
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
                "size": 2
            },
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
        "name": "皇后盔．冥燈",
        "rare": 8,
        "type": "greatSword",
        "series": "炎妃龍．冥燈",
        "attack": 864,
        "criticalRate": 10,
        "defense": 0,
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
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 330,
                "maxValue": 410,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": [
            {
                "size": 3
            },
            {
                "size": 3
            }
        ],
        "skills": [
            {
                "name": "利刃／彈藥節約",
                "level": 1
            }
        ]
    }
]