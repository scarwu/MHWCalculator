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
    defaultSets: {
        '狂暴雙刀': {
            weapon: {
                key: '罪【真】',
                slots: [],
                enhances: [
                    {
                        'key': '賦予回復能力'
                    }
                ]
            },
            helm: {
                key: '龍王的獨眼α',
                slots: [
                    {
                        key: '耐衝珠'
                    }
                ]
            },
            chest: {
                key: '杜賓鎧甲β',
                slots: [
                    {
                        key: '痛擊珠'
                    }
                ]
            },
            arm: {
                key: '異種大型鋼爪α',
                slots: [
                    {
                        key: '達人珠'
                    }
                ]
            },
            waist: {
                key: '慘爪龍腰甲β',
                slots: [
                    {
                        key: '無擊珠'
                    }
                ]
            },
            leg: {
                key: '杜賓護腿β',
                slots: [
                    {
                        key: '達人珠'
                    }
                ]
            },
            charm: {
                key: '攻擊護石 III'
            }
        },
        '破壞大劍': {
            weapon: {
                key: '龍熱機關式【鋼翼】改',
                slots: [
                    {
                        key: '奪氣珠'
                    },
                    {
                        key: '奪氣珠'
                    }
                ],
                enhances: [
                    {
                        'key': '賦予回復能力'
                    }
                ]
            },
            helm: {
                key: '龍王的獨眼α',
                slots: [
                    {
                        key: 'KO珠'
                    }
                ]
            },
            chest: {
                key: '爆鎚龍鎧甲α',
                slots: [
                    {
                        key: '達人珠'
                    }
                ]
            },
            arm: {
                key: '帝王手β',
                slots: [
                    {
                        key: 'KO珠'
                    }
                ]
            },
            waist: {
                key: '爆鎚龍腰甲β',
                slots: [
                    {
                        key: '無擊珠'
                    },
                    {
                        key: '達人珠'
                    }
                ]
            },
            leg: {
                key: '死神護腿β',
                slots: [
                    {
                        key: '攻擊珠'
                    },
                    {
                        key: '攻擊珠'
                    }
                ]
            },
            charm: {
                key: '匠之護石 III'
            }
        }
    }
};
