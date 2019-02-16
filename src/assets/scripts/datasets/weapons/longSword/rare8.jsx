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
        "name": "滅盡一刀",
        "rare": 8,
        "type": "longSword",
        "series": "滅盡龍",
        "attack": 693,
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
                "minValue": 120,
                "maxValue": 160,
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
        "name": "飛龍刀【藍染】",
        "rare": 8,
        "type": "longSword",
        "series": "火龍",
        "attack": 627,
        "criticalRate": 15,
        "defense": 0,
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
        "name": "爆鱗刀赤紅利刃",
        "rare": 8,
        "type": "longSword",
        "series": "爆鱗龍",
        "attack": 660,
        "criticalRate": -10,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 60,
                "orange": 120,
                "yellow": 80,
                "green": 60,
                "blue": 30,
                "white": 50
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
                "size": 1
            },
            {
                "size": 1
            }
        ],
        "skills": null
    },
    {
        "name": "幻光刀",
        "rare": 8,
        "type": "longSword",
        "series": "風漂龍",
        "attack": 528,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 240,
                "orange": 20,
                "yellow": 20,
                "green": 20,
                "blue": 30,
                "white": 70
            }
        },
        "element": {
            "attack": {
                "type": "ice",
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
        "name": "帝王刀【陽炎】",
        "rare": 8,
        "type": "longSword",
        "series": "黑鋼",
        "attack": 627,
        "criticalRate": 0,
        "defense": 0,
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
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 300,
                "maxValue": 370,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "冥燈龍太刀",
        "rare": 8,
        "type": "longSword",
        "series": "冥燈龍",
        "attack": 594,
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
                "minValue": 180,
                "maxValue": 230,
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
        "name": "天上天下無雙刀",
        "rare": 8,
        "type": "longSword",
        "series": "工房武器",
        "attack": 693,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 100,
                "orange": 60,
                "yellow": 60,
                "green": 100,
                "blue": 50,
                "white": 30
            }
        },
        "element": {
            "attack": {
                "type": "dragon",
                "minValue": 150,
                "maxValue": 200,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": {
            "affinity": "high"
        },
        "slots": [
            {
                "size": 3
            }
        ],
        "skills": null
    },
    {
        "name": "鎧羅劍．麻痺",
        "rare": 8,
        "type": "longSword",
        "series": "絢輝龍",
        "attack": 561,
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
            "attack": null,
            "status": {
                "type": "paralysis",
                "minValue": 330,
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
        "name": "鎧羅劍．毒",
        "rare": 8,
        "type": "longSword",
        "series": "絢輝龍",
        "attack": 627,
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
            "attack": null,
            "status": {
                "type": "poison",
                "minValue": 420,
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
        "name": "鎧羅劍．水",
        "rare": 8,
        "type": "longSword",
        "series": "絢輝龍",
        "attack": 627,
        "criticalRate": 0,
        "defense": 20,
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
                "type": "water",
                "minValue": 420,
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
        "name": "皇后劍．炎妃",
        "rare": 8,
        "type": "longSword",
        "series": "炎妃龍",
        "attack": 594,
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
                "minValue": 180,
                "maxValue": 230,
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
                "name": "毅力",
                "level": 1
            }
        ]
    },
    {
        "name": "皇后劍．滅盡",
        "rare": 8,
        "type": "longSword",
        "series": "炎妃龍．滅盡",
        "attack": 627,
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
                "minValue": 150,
                "maxValue": 190,
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
        "name": "皇后劍．冥燈",
        "rare": 8,
        "type": "longSword",
        "series": "炎妃龍．冥燈",
        "attack": 594,
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
                "minValue": 240,
                "maxValue": 300,
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