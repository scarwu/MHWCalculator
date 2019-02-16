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
        "name": "日冕短劍",
        "rare": 7,
        "type": "swordAndShield",
        "series": "火龍",
        "attack": 266,
        "criticalRate": 20,
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
                "minValue": 180,
                "maxValue": 230,
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
        "name": "至尊劍",
        "rare": 7,
        "type": "swordAndShield",
        "series": "工房武器",
        "attack": 280,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 90,
                "orange": 120,
                "yellow": 40,
                "green": 50,
                "blue": 100,
                "white": 0
            }
        },
        "element": {
            "attack": {
                "type": "thunder",
                "minValue": 330,
                "maxValue": 430,
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
        "name": "皇家薔薇",
        "rare": 7,
        "type": "swordAndShield",
        "series": "雌火龍",
        "attack": 266,
        "criticalRate": 10,
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
            "attack": null,
            "status": {
                "type": "poison",
                "minValue": 240,
                "maxValue": 300,
                "isHidden": false
            }
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
        "name": "蠻顎龍追尋者",
        "rare": 7,
        "type": "swordAndShield",
        "series": "蠻顎龍",
        "attack": 294,
        "criticalRate": -20,
        "defense": 0,
        "sharpness": {
            "value": 350,
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
                "type": "fire",
                "minValue": 240,
                "maxValue": 310,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "雷光刀 II",
        "rare": 7,
        "type": "swordAndShield",
        "series": "幻獸",
        "attack": 224,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 110,
                "orange": 20,
                "yellow": 20,
                "green": 130,
                "blue": 120,
                "white": 0
            }
        },
        "element": {
            "attack": {
                "type": "thunder",
                "minValue": 300,
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
        "name": "致命寬劍",
        "rare": 7,
        "type": "swordAndShield",
        "series": "恐暴龍",
        "attack": 308,
        "criticalRate": -20,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 50,
                "orange": 120,
                "yellow": 80,
                "green": 60,
                "blue": 40,
                "white": 50
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
            "affinity": "high"
        },
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．幻",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 224,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "thunder",
                "minValue": 360,
                "maxValue": 460,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．痺賊",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 224,
        "criticalRate": 30,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "paralysis",
                "minValue": 240,
                "maxValue": null,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．風漂",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 224,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "ice",
                "minValue": 330,
                "maxValue": 430,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．浮空",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 252,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 270,
                "maxValue": null,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．毒妖",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 252,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "poison",
                "minValue": 390,
                "maxValue": null,
                "isHidden": false
            }
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
        "name": "鎧羅切刀．賊",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 266,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "water",
                "minValue": 270,
                "maxValue": 350,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．王",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 266,
        "criticalRate": 30,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 180,
                "maxValue": 230,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．骨鎚",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 266,
        "criticalRate": 10,
        "defense": 30,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "sleep",
                "minValue": 210,
                "maxValue": 260,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．蠻顎",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 294,
        "criticalRate": -20,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 240,
                "maxValue": null,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅切刀．土砂",
        "rare": 7,
        "type": "swordAndShield",
        "series": "絢輝龍",
        "attack": 308,
        "criticalRate": -10,
        "defense": 25,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "paralysis",
                "minValue": 180,
                "maxValue": null,
                "isHidden": true
            }
        },
        "elderseal": null,
        "slots": [
            {
                "size": 1
            }
        ],
        "skills": null
    }
]