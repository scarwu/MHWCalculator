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
    defaultSkills: [
        {
            name: '攻擊',
            level: 7
        },
        {
            name: '看破',
            level: 4
        },
        {
            name: '弱點特效',
            level: 3
        },
        {
            name: '減輕膽怯',
            level: 2
        },
        {
            name: '超會心',
            level: 1
        },
        {
            name: '無屬性強化',
            level: 1
        }
    ],
    defaultCandidateEquip: {
        name: null,
        type: null,
        defense: 0,
        skills: {},
        ownSlotCount: {
            1: 0,
            2: 0,
            3: 0
        }
    },
    defaultBundle: {
        defense: 0,
        equips: {
            weapon: null,
            helm: null,
            chest: null,
            arm: null,
            waist: null,
            leg: null,
            charm: null
        },
        skills: {},
        jewels: {},
        remainingSlotCount: {
            1: 0,
            2: 0,
            3: 0
        },
        euqipCount: 0,
        completedSkillCount: 0
    },
    defaultEquips: {
        weapon: {
            name: null,
            enhanceNames: {},
            slotNames: {}
        },
        helm: {
            name: null,
            slotNames: {}
        },
        chest: {
            name: null,
            slotNames: {}
        },
        arm: {
            name: null,
            slotNames: {}
        },
        waist: {
            name: null,
            slotNames: {}
        },
        leg: {
            name: null,
            slotNames: {}
        },
        charm: {
            name: null
        }
    },
    defaultEquipsLock: {
        weapon: false,
        helm: false,
        chest: false,
        arm: true,
        waist: true,
        leg: true,
        charm: true
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
            attack: null,
            status: null
        },
        elderseal: null,
        defense: 31, // 守護護符+10 守護之爪+20
        resistance: {
            fire: 0,
            water: 0,
            thunder: 0,
            ice: 0,
            dragon: 0
        },
        sets: [],
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
                name: '罪【真】',
                enhanceNames: {
                    0: '賦予回復能力'
                },
                slotNames: {}
            },
            helm: {
                name: '龍王的獨眼α',
                slotNames: {
                    0: '耐衝珠'
                }
            },
            chest: {
                name: '杜賓鎧甲β',
                slotNames: {
                    0: '痛擊珠'
                }
            },
            arm: {
                name: '異種大型鋼爪α',
                slotNames: {
                    0: '達人珠'
                }
            },
            waist: {
                name: '慘爪龍腰甲β',
                slotNames: {
                    0: '無擊珠'
                }
            },
            leg: {
                name: '杜賓護腿β',
                slotNames: {
                    0: '達人珠'
                }
            },
            charm: {
                name: '攻擊護石 III'
            }
        },
        {
            weapon: {
                name: '龍熱機關式【鋼翼】改',
                enhanceNames: {
                    0: '賦予回復能力',
                    1: '強化鑲嵌槽'
                },
                slotNames: {
                    0: '奪氣珠',
                    1: '奪氣珠'
                }
            },
            helm: {
                name: '龍王的獨眼α',
                slotNames: {
                    0: 'KO珠'
                }
            },
            chest: {
                name: '爆鎚龍鎧甲α',
                slotNames: {
                    0: '達人珠'
                }
            },
            arm: {
                name: '帝王腕甲β',
                slotNames: {
                    0: 'KO珠'
                }
            },
            waist: {
                name: '爆鎚龍腰甲β',
                slotNames: {
                    0: '無擊珠',
                    1: '達人珠'
                }
            },
            leg: {
                name: '死神護腿β',
                slotNames: {
                    0: '攻擊珠',
                    1: '攻擊珠'
                }
            },
            charm: {
                name: '匠之護石 III'
            }
        },
        {
            weapon: {
                name: '搔鳥尖槍 III',
                enhanceNames: {
                    0: '強化鑲嵌槽',
                    1: '強化鑲嵌槽',
                    2: '強化鑲嵌槽'
                },
                slotNames: {}
            },
            helm: {
                name: '鋼龍強力β',
                slotNames: {}
            },
            chest: {
                name: '大馬士革鎧甲β',
                slotNames: {}
            },
            arm: {
                name: '烏爾德腕甲β',
                slotNames: {}
            },
            waist: {
                name: '麒麟腰環β',
                slotNames: {}
            },
            leg: {
                name: '燕尾蝶腳β',
                slotNames: {}
            },
            charm: {
                name: '匠之護石 III'
            }
        }
    ]
};
