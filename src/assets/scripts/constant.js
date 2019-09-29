/**
 * Constant
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Config
import Config from 'config';

export default {
    langs: ('production' !== Config.env) ? {
        zhTW: '正體中文',
        jaJP: '日本語',
        enUS: 'English'
    } : {
        zhTW: '正體中文'
    },
    resistances: [
        'fire',
        'water',
        'thunder',
        'ice',
        'dragon'
    ],
    weaponTypes: [
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
        'lightBowgun',
        'heavyBowgun',
        'bow'
    ],
    armorTypes: [
        'helm',
        'chest',
        'arm',
        'waist',
        'leg'
    ],
    sharpnessMultiple: {
        raw: {
            red: 0.50,
            orange: 0.75,
            yellow: 1.00,
            green: 1.05,
            blue: 1.20,
            white: 1.32,
            purple: 1.45
        },
        element: {
            red: 0.25,
            orange: 0.50,
            yellow: 0.75,
            green: 1.00,
            blue: 1.0625,
            white: 1.125,
            purple: 1.2
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
    default: {
        lang: 'zhTW',
        algorithmParams: {
            limit: 25,
            sort: 'complex', // complex | defense | amount | slot | expectedValue | expectedLevel
            order: 'desc', // asc | desc
            isEndEarly: false,
            isExpectBundle: true,
            isDeepSearch: true,
            isRequireConsistent: false,
            isUsingFactor: {
                armorRare: {
                    12: true,
                    11: true,
                    10: true,
                    9: true,
                    8: false,
                    7: false,
                    6: false,
                    5: false
                },
                jewelRare: {
                    4: true,
                    3: true,
                    2: true,
                    1: true
                }
            }
        },
        candidateEquip: {
            id: null,
            type: null,
            defense: 0,
            resistance: {
                fire: 0,
                water: 0,
                thunder: 0,
                ice: 0,
                dragon: 0
            },
            skills: {},
            setId: null,
            ownSlotCount: {
                1: 0,
                2: 0,
                3: 0,
                4: 0
            },
            expectedValue: 0,
            expectedLevel: 0
        },
        bundle: {
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
            skills: {},
            sets: {},
            meta: {
                defense: 0,
                resistance: {
                    fire: 0,
                    water: 0,
                    thunder: 0,
                    ice: 0,
                    dragon: 0
                },
                expectedValue: 0,
                expectedLevel: 0,
                equipCount: 0,
                completedSkills: {},
                completedSets: {},
                remainingSlotCount: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    all: 0
                }
            }
        },
        equips: {
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
        equipsLock: {
            weapon: false,
            helm: false,
            chest: false,
            arm: false,
            waist: false,
            leg: false,
            charm: false
        },
        status: {
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
        extraInfo: {
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
    }
};
