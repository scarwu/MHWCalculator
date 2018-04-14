'use strict';
/**
 * Constant
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

export default {
    elements: [
        'fire',
        'water',
        'thunder',
        'ice',
        'dragon'
    ],
    sharpnessMultiple: {
        raw: {
            red: 0.50,
            orange: 0.75,
            yellow: 1.00,
            green: 1.05,
            blue: 1.20,
            whit: 1.32
        },
        element: {
            red: 0.25,
            orange: 0.50,
            yellow: 0.75,
            green: 1.00,
            blue: 1.0625,
            white: 1.125
        }
    },
    weaponMultiple: {
        greatSword: 4.8,
        longSword: 3.3,
        swordAndShield: 1.4,
        dualSlades: 1.4,
        hammer: 5.2,
        huntingHorn: 4.2,
        lance: 2.3,
        gunlance: 2.3,
        switchAxe: 3.5,
        chargeBlade: 3.6,
        insectGlaive: 3.1,
        lightBowgun: 1.3,
        heavyBowgun: 1.5,
        bow: 1.2
    },
    defaultEquips: {
        weapon: null,
        helm: null,
        chest: null,
        arm: null,
        waist: null,
        leg: null,
        charm: null
    },
    defaultStatus: {
        health: 100,
        stamina: 100,
        attack: 15, // 力量護符+6 力量之爪+9
        critical: {
            rate: 0,
            multiple: {
                positive: 1.25,
                nagetive: 0.75
            }
        },
        sharpness: {
            value: 0,
            steps: {
                red: 0,
                orange: 0,
                yellow: 0,
                green: 0,
                blue: 0,
                white: 0
            }
        },
        element: {
            attack: {
                type: null,
                value: 0,
                isHidden: null
            },
            status: {
                type: null,
                value: 0,
                isHidden: null
            }
        },
        elderseal: {
            affinity: null
        },
        defense: 31, // 守護護符+10 守護之爪+20
        resistance: {
            fire: 0,
            water: 0,
            thunder: 0,
            ice: 0,
            dragon: 0
        },
        skills: [],
        extraInfo: {
            basicAttack: 0,
            basicCriticalAttack: 0,
            expectedValue: 0
        }
    },
    testEquipsSetting: [
        {
            weapon: {
                key: '罪【真】',
                enhanceKeys: {
                    0: '賦予回復能力',
                    1: null
                },
                slotKeys: null,
                isLock: false
            },
            helm: {
                key: '龍王的獨眼α',
                slotKeys: {
                    0: '耐衝珠'
                },
                isLock: false
            },
            chest: {
                key: '杜賓鎧甲β',
                slotKeys: {
                    0: '痛擊珠'
                },
                isLock: false
            },
            arm: {
                key: '異種大型鋼爪α',
                slotKeys: {
                    0: '達人珠'
                },
                isLock: false
            },
            waist: {
                key: '慘爪龍腰甲β',
                slotKeys: {
                    0: '無擊珠'
                },
                isLock: false
            },
            leg: {
                key: '杜賓護腿β',
                slotKeys: {
                    0: '達人珠'
                },
                isLock: false
            },
            charm: {
                key: '攻擊護石 III',
                isLock: false
            }
        },
        {
            weapon: {
                key: '龍熱機關式【鋼翼】改',
                enhanceKeys: {
                    0: '賦予回復能力',
                    1: '強化鑲嵌槽'
                },
                slotKeys: {
                    0: '奪氣珠',
                    1: '奪氣珠'
                },
                isLock: false
            },
            helm: {
                key: '龍王的獨眼α',
                slotKeys: {
                    0: 'KO珠'
                },
                isLock: false
            },
            chest: {
                key: '爆鎚龍鎧甲α',
                slotKeys: {
                    0: '達人珠'
                },
                isLock: false
            },
            arm: {
                key: '帝王腕甲β',
                slotKeys: {
                    0: 'KO珠'
                },
                isLock: false
            },
            waist: {
                key: '爆鎚龍腰甲β',
                slotKeys: {
                    0: '無擊珠',
                    1: '達人珠'
                },
                isLock: false
            },
            leg: {
                key: '死神護腿β',
                slotKeys: {
                    0: '攻擊珠',
                    1: '攻擊珠'
                },
                isLock: false
            },
            charm: {
                key: '匠之護石 III',
                isLock: false
            }
        },
        {
            weapon: {
                key: '搔鳥尖槍 III',
                enhanceKeys: {
                    0: '強化攻擊力',
                    1: '強化攻擊力',
                    2: '強化攻擊力'
                },
                slotKeys: null,
                isLock: false
            },
            helm: {
                key: '鋼龍強力β',
                slotKeys: {
                    0: null,
                    1: null,
                    2: null
                },
                isLock: false
            },
            chest: {
                key: '大馬士革鎧甲β',
                slotKeys: {
                    0: null,
                    1: null,
                    2: null
                },
                isLock: false
            },
            arm: {
                key: '烏爾德腕甲β',
                slotKeys: {
                    0: null,
                    1: null,
                    2: null
                },
                isLock: false
            },
            waist: {
                key: '麒麟腰環β',
                slotKeys: {
                    0: null,
                    1: null,
                    2: null
                },
                isLock: false
            },
            leg: {
                key: '燕尾蝶腳β',
                slotKeys: {
                    0: null,
                    1: null
                },
                isLock: false
            },
            charm: {
                key: '匠之護石 III',
                isLock: false
            }
        }
    ]
};
