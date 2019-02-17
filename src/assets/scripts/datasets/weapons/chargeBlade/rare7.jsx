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
        "name": "焰斧鶴王",
        "rare": 7,
        "type": "chargeBlade",
        "series": "火龍",
        "attack": 684,
        "criticalRate": 20,
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
        "name": "火鎧盾斧",
        "rare": 7,
        "type": "chargeBlade",
        "series": "雌火龍",
        "attack": 684,
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
                "type": "poison",
                "minValue": 330,
                "maxValue": 410,
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
        "name": "暴君銅盾 II",
        "rare": 7,
        "type": "chargeBlade",
        "series": "角龍",
        "attack": 828,
        "criticalRate": -30,
        "defense": 15,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 90,
                "orange": 50,
                "yellow": 60,
                "green": 120,
                "blue": 60,
                "white": 20
            }
        },
        "element": {
            "attack": {
                "type": "ice",
                "minValue": 180,
                "maxValue": 230,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "岩賊龍盾 II",
        "rare": 7,
        "type": "chargeBlade",
        "series": "岩賊龍",
        "attack": 612,
        "criticalRate": 0,
        "defense": 0,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 110,
                "orange": 110,
                "yellow": 40,
                "green": 40,
                "blue": 80,
                "white": 20
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
                "size": 2
            },
            {
                "size": 2
            }
        ],
        "skills": null
    },
    {
        "name": "屍套龍盾斧 II",
        "rare": 7,
        "type": "chargeBlade",
        "series": "屍套龍",
        "attack": 684,
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
                "minValue": 270,
                "maxValue": 350,
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
        "name": "德斯特涅塔",
        "rare": 7,
        "type": "chargeBlade",
        "series": "恐暴龍",
        "attack": 792,
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
        "name": "鎧羅兵裝．痺賊",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 576,
        "criticalRate": 30,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "paralysis",
                "minValue": 150,
                "maxValue": null,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅兵裝．慘爪",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 684,
        "criticalRate": 25,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 90,
                "maxValue": 120,
                "isHidden": true
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅兵裝．岩賊",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 684,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "blast",
                "minValue": 90,
                "maxValue": null,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅兵裝．屍套",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 684,
        "criticalRate": 10,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "dragon",
                "minValue": 120,
                "maxValue": null,
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
        "name": "鎧羅兵裝．賊",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 684,
        "criticalRate": 0,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": null,
            "status": {
                "type": "sleep",
                "minValue": 90,
                "maxValue": null,
                "isHidden": false
            }
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅兵裝．王",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 684,
        "criticalRate": 20,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "fire",
                "minValue": 120,
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
        "name": "鎧羅兵裝．泥魚",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 684,
        "criticalRate": 10,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "water",
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
        "name": "鎧羅兵裝．飛雷",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 684,
        "criticalRate": 15,
        "defense": 20,
        "sharpness": null,
        "element": {
            "attack": {
                "type": "thunder",
                "minValue": 150,
                "maxValue": 200,
                "isHidden": false
            },
            "status": null
        },
        "elderseal": null,
        "slots": null,
        "skills": null
    },
    {
        "name": "鎧羅兵裝．角",
        "rare": 7,
        "type": "chargeBlade",
        "series": "絢輝龍",
        "attack": 828,
        "criticalRate": -30,
        "defense": 25,
        "sharpness": {
            "value": 350,
            "steps": {
                "red": 90,
                "orange": 50,
                "yellow": 60,
                "green": 120,
                "blue": 60,
                "white": 20
            }
        },
        "element": {
            "attack": {
                "type": "ice",
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
        "name": "鎧羅兵裝．？",
        "rare": 7,
        "type": "chargeBlade",
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