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
        "name": "風漂龍斧槍 II",
        "rare": 7,
        "type": "lance",
        "series": "風漂龍",
        "attack": 368,
        "criticalRate": 0,
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
        "name": "岩賊龍刺針 II",
        "rare": 7,
        "type": "lance",
        "series": "岩賊龍",
        "attack": 391,
        "criticalRate": 0,
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
        "skills": null
    },
    {
        "name": "慘爪刺針 II",
        "rare": 7,
        "type": "lance",
        "series": "慘爪龍",
        "attack": 391,
        "criticalRate": 30,
        "defense": 0,
        "sharpness": {
            "value": 400,
            "steps": {
                "red": 170,
                "orange": 100,
                "yellow": 30,
                "green": 30,
                "blue": 40,
                "white": 30
            }
        },
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 210,
                "maxValue": 270,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "亞特羅西斯塔",
        "rare": 7,
        "type": "lance",
        "series": "恐暴龍",
        "attack": 529,
        "criticalRate": -25,
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
        "name": "鎧羅之尖．王",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 368,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 300,
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
        "name": "鎧羅之尖．黑甲",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 368,
        "criticalRate": 10,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 270,
                "maxValue": null,
                "isHidden": true
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅之尖．風漂",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 368,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "ice",
                "minValue": 300,
                "maxValue": null,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅之尖．岩賊",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 391,
        "criticalRate": 10,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 210,
                "maxValue": null,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅之尖．屍套",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 391,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "dragon",
                "minValue": 270,
                "maxValue": 350,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": {
            "affinity": "medium"
        },
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅之尖．毒妖",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 391,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "poison",
                "minValue": 540,
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
        "name": "鎧羅之尖．搔",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 391,
        "criticalRate": 10,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "sleep",
                "minValue": 210,
                "maxValue": null,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅之尖．慘爪",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 437,
        "criticalRate": 30,
        "defense": 20,
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
            "attack": {
                "type": "fire",
                "minValue": 90,
                "maxValue": null,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅之尖．土砂",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 437,
        "criticalRate": -20,
        "defense": 25,
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
        "name": "鎧羅之尖．？",
        "rare": 7,
        "type": "lance",
        "series": "絢輝龍",
        "attack": 0,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    }
]