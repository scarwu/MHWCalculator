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
    defaultLang: 'zhTW',
    langs: {
        zhTW: '正體中文',
        enUS: 'English'
    },
    elements: [
        'fire',
        'water',
        'thunder',
        'ice',
        'dragon'
    ],
    weapons: [
        'greatSword',
        'longSword',
        'swordAndShield',
        'dualBlades',
        'hammer',
        'huntingHorn',
        'lance',
        'gunlance',
        'switchAxe',
        'chargeBlade',
        'insectGlaive',
        'bow',
        'lightBowgun',
        'heavyBowgun'
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
        dualBlades: 1.4,
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
    defaultCandidateEquip: {
        name: null,
        type: null,
        defense: 0,
        skills: {},
        setId: null,
        ownSlotCount: {
            1: 0,
            2: 0,
            3: 0
        },
        expectedValue: 0,
        expectedLevel: 0
    },
    defaultBundle: {
        equips: {
            weapon: null,
            helm: null,
            chest: null,
            arm: null,
            waist: null,
            leg: null,
            charm: null
        },
        jewels: {},
        defense: 0,
        skills: {},
        sets: {},
        meta: {
            expectedValue: 0,
            expectedLevel: 0,
            equipCount: 0,
            completedSkills: {},
            remainingSlotCount: {
                1: 0,
                2: 0,
                3: 0,
                all: 0
            }
        }
    },
    defaultEquips: {
        weapon: {
            id: null,
            enhanceIds: {},
            slotIds: {}
        },
        helm: {
            id: null,
            slotIds: {}
        },
        chest: {
            id: null,
            slotIds: {}
        },
        arm: {
            id: null,
            slotIds: {}
        },
        waist: {
            id: null,
            slotIds: {}
        },
        leg: {
            id: null,
            slotIds: {}
        },
        charm: {
            id: null
        }
    },
    defaultEquipsLock: {
        weapon: false,
        helm: false,
        chest: false,
        arm: false,
        waist: false,
        leg: false,
        charm: false
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
    }
};
