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
            white: 1.32
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
        weapon: {
            key: null,
            enhanceKeys: {},
            slotKeys: {},
            isLock: false
        },
        helm: {
            key: null,
            slotKeys: {},
            isLock: false
        },
        chest: {
            key: null,
            slotKeys: {},
            isLock: false
        },
        arm: {
            key: null,
            slotKeys: {},
            isLock: false
        },
        waist: {
            key: null,
            slotKeys: {},
            isLock: false
        },
        leg: {
            key: null,
            slotKeys: {},
            isLock: false
        },
        charm: {
            key: null,
            isLock: false
        }
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
        sharpness: null,
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
        skills: []
    },
    defaultExtraInfo: {
        rawAttack: 0,
        rawCriticalAttack: 0,
        rawExpectedValue: 0,
        elementAttack: 0,
        elementExpectedValue: 0,
        expectedValue: 0,
        perNRawAttackExpectedValue: 0,
        perNRawCriticalRateExpectedValue: 0,
        perNRawCriticalMultipleExpectedValue: 0,
        perNElementAttackExpectedValue: 0
    },
    testEquipsSetting: [
        {
            weapon: {
                key: '罪【真】',
                enhanceKeys: {
                    0: '賦予回復能力'
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
                    0: '強化鑲嵌槽',
                    1: '強化鑲嵌槽',
                    2: '強化鑲嵌槽'
                },
                slotKeys: null,
                isLock: false
            },
            helm: {
                key: '鋼龍強力β',
                slotKeys: {},
                isLock: false
            },
            chest: {
                key: '大馬士革鎧甲β',
                slotKeys: {},
                isLock: false
            },
            arm: {
                key: '烏爾德腕甲β',
                slotKeys: {},
                isLock: false
            },
            waist: {
                key: '麒麟腰環β',
                slotKeys: {},
                isLock: false
            },
            leg: {
                key: '燕尾蝶腳β',
                slotKeys: {},
                isLock: false
            },
            charm: {
                key: '匠之護石 III',
                isLock: false
            }
        }
    ]
};
