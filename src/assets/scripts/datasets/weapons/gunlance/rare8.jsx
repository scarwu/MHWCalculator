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
        "name": "燒滅種火",
        "rare": 8,
        "type": "gunlance",
        "series": "滅盡龍",
        "attack": 483,
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
                "size": 2
            }
        ],
        "skills": null
    },
    {
        "name": "藍色戰車",
        "rare": 8,
        "type": "gunlance",
        "series": "火龍",
        "attack": 437,
        "criticalRate": 20,
        "defense": 0,
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
        "name": "驚天動地熔山龍銃槍",
        "rare": 8,
        "type": "gunlance",
        "series": "熔山龍",
        "attack": 460,
        "criticalRate": -10,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 210,
                "orange": 30,
                "yellow": 40,
                "green": 90,
                "blue": 30,
                "white": 0
            }
        },
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 420,
                "maxValue": 510,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鋼龍爪銃槍",
        "rare": 8,
        "type": "gunlance",
        "series": "黑鋼",
        "attack": 414,
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
                "minValue": 240,
                "maxValue": 310,
                "isHidden": false
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
        "name": "冥燈龍銃槍",
        "rare": 8,
        "type": "gunlance",
        "series": "冥燈龍",
        "attack": 391,
        "criticalRate": 10,
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
        "name": "鎧羅銃槍．水",
        "rare": 8,
        "type": "gunlance",
        "series": "絢輝龍",
        "attack": 437,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 70,
                "orange": 60,
                "yellow": 60,
                "green": 100,
                "blue": 80,
                "white": 30
            }
        },
        "element": {
            "attack": {
                "type": "water",
                "minValue": 450,
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
        "name": "鎧羅銃槍．睡眠",
        "rare": 8,
        "type": "gunlance",
        "series": "絢輝龍",
        "attack": 437,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 180,
                "orange": 70,
                "yellow": 20,
                "green": 20,
                "blue": 70,
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
        "name": "鎧羅銃槍．毒",
        "rare": 8,
        "type": "gunlance",
        "series": "絢輝龍",
        "attack": 460,
        "criticalRate": 15,
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
                "minValue": 450,
                "maxValue": 550,
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
        "name": "皇后杖．炎妃",
        "rare": 8,
        "type": "gunlance",
        "series": "炎妃龍",
        "attack": 437,
        "criticalRate": 20,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 100,
                "orange": 30,
                "yellow": 60,
                "green": 80,
                "blue": 40,
                "white": 90
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
        "name": "皇后杖．滅盡",
        "rare": 8,
        "type": "gunlance",
        "series": "炎妃龍．滅盡",
        "attack": 460,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 100,
                "orange": 30,
                "yellow": 60,
                "green": 80,
                "blue": 40,
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
        "name": "皇后杖．冥燈",
        "rare": 8,
        "type": "gunlance",
        "series": "炎妃龍．冥燈",
        "attack": 437,
        "criticalRate": 10,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 100,
                "orange": 30,
                "yellow": 60,
                "green": 80,
                "blue": 40,
                "white": 90
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
                "size": 1
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