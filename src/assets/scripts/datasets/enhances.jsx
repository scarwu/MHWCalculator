'use strict';
/**
 * Dataset Enhances
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

export default [
    {
        "name": "強化攻擊力",
        "list": [
            {
                "level": 1,
                "description": "基礎攻擊力+5",
                "reaction": {
                    "attack": {
                        "value": 5
                    }
                }
            },
            {
                "level": 2,
                "description": "基礎攻擊力+10",
                "reaction": {
                    "attack": {
                        "value": 10
                    }
                }
            },
            {
                "level": 3,
                "description": "基礎攻擊力+15",
                "reaction": {
                    "attack": {
                        "value": 15
                    }
                }
            }
        ]
    },
    {
        "name": "強化會心率",
        "list": [
            {
                "level": 1,
                "description": "會心率+10%",
                "reaction": {
                    "criticalRate": {
                        "value": 10
                    }
                }
            },
            {
                "level": 2,
                "description": "會心率+15%",
                "reaction": {
                    "criticalRate": {
                        "value": 15
                    }
                }
            },
            {
                "level": 3,
                "description": "會心率+20%",
                "reaction": {
                    "criticalRate": {
                        "value": 20
                    }
                }
            }
        ]
    },
    {
        "name": "強化防禦力",
        "list": [
            {
                "level": 1,
                "description": "防禦力+10",
                "reaction": {
                    "defense": {
                        "value": 10
                    }
                }
            },
            {
                "level": 2,
                "description": "防禦力+20",
                "reaction": {
                    "defense": {
                        "value": 20
                    }
                }
            },
            {
                "level": 3,
                "description": "防禦力+30",
                "reaction": {
                    "defense": {
                        "value": 30
                    }
                }
            }
        ]
    },
    {
        "name": "強化鑲嵌槽",
        "list": [
            {
                "level": 1,
                "description": "1級鑲嵌槽+1",
                "reaction": {
                    "addSlot": {
                        "size": 1
                    }
                }
            },
            {
                "level": 2,
                "description": "2級鑲嵌槽+1",
                "reaction": {
                    "addSlot": {
                        "size": 2
                    }
                }
            },
            {
                "level": 3,
                "description": "3級鑲嵌槽+1",
                "reaction": {
                    "addSlot": {
                        "size": 3
                    }
                }
            }
        ]
    },
    {
        "name": "賦予回復能力",
        "list": [
            {
                "level": 1,
                "description": "造成傷害時回復少量體力",
                "reaction": null
            },
            {
                "level": 2,
                "description": "造成傷害時回復少量體力",
                "reaction": null
            },
            {
                "level": 3,
                "description": "造成傷害時回復少量體力",
                "reaction": null
            }
        ]
    }
];
