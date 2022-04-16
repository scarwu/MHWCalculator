/**
 * Constant
 *
 * @package     Monster Hunter Rise - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHRCalculator
 */

import Helper from './helper.mjs'

export const defaultWeaponItem = {
    series: null,
    name: null,
    rare: null,
    type: null,
    attack: null,
    criticalRate: null,
    defense: null,
    element: {
        attack: {
            type: null,
            minValue: null,
            maxValue: null
        },
        status: {
            type: null,
            minValue: null,
            maxValue: null
        }
    },
    sharpness: {
        minValue: null,
        maxValue: null,
        steps: {
            red: null,
            orange: null,
            yellow: null,
            green: null,
            blue: null,
            white: null,
            purple: null
        }
    },
    slots: [
        // {
        //     size: null
        // }
    ],
    enhance: {
        amount: null,
        list: [
            // {
            //     name: null
            // }
        ]
    }
}

export const defaultArmorItem = {
    series: null,
    name: null,
    rare: null,
    type: null,
    gender: null,
    minDefense: null,
    maxDefense: null,
    resistance: {
        fire: null,
        water: null,
        thunder: null,
        ice: null,
        dragon: null
    },
    slots: [
        // {
        //     size: null
        // }
    ],
    skills: [
        // {
        //     name: null,
        //     level: null
        // }
    ]
}

export const defaultJewelItem = {
    name: null,
    rare: null,
    size: null,
    skills: [
        // {
        //     name: null,
        //     level: null
        // }
    ]
}

export const defaultPetalaceItem = {
    name: null,
    rare: null,
    health: {
        increment: null,
        obtain: null
    },
    stamina: {
        increment: null,
        obtain: null
    },
    attack: {
        increment: null,
        obtain: null
    },
    defense: {
        increment: null,
        obtain: null
    }
}

export const defaultEnhanceItem = {
    name: null,
    description: null
}

export const defaultSkillItem = {
    name: null,
    description: null,
    level: null,
    effect: null
}

export const autoExtendListQuantity = (list) => {
    let slotCount = 0
    let skillCount = 0
    let enhanceCount = 0

    list.forEach((row) => {
        if (Helper.isNotEmpty(row.slots)
            && slotCount < row.slots.length
        ) {
            slotCount = row.slots.length
        }

        if (Helper.isNotEmpty(row.skills)
            && skillCount < row.skills.length
        ) {
            skillCount = row.skills.length
        }

        if (Helper.isNotEmpty(row.enhance) && Helper.isNotEmpty(row.enhance.list)
            && enhanceCount < row.enhance.list.length
        ) {
            enhanceCount = row.enhance.list.length
        }
    })

    return list.map((row) => {
        if (Helper.isNotEmpty(row.slots)) {
            for (let index = 0; index < slotCount; index++) {
                if (Helper.isNotEmpty(row.slots[index])) {
                    continue
                }

                row.slots[index] = {
                    size: null
                }
            }
        }

        if (Helper.isNotEmpty(row.skills)) {
            for (let index = 0; index < skillCount; index++) {
                if (Helper.isNotEmpty(row.skills[index])) {
                    continue
                }

                row.skills[index] = {
                    name: null,
                    level: null
                }
            }
        }

        if (Helper.isNotEmpty(row.enhance) && Helper.isNotEmpty(row.enhance.list)) {
            for (let index = 0; index < enhanceCount; index++) {
                if (Helper.isNotEmpty(row.enhance.list[index])) {
                    continue
                }

                row.enhance.list[index] = {
                    name: null
                }
            }
        }

        return row
    })
}

export const normalizeText = (text) => {
    return text.trim()
        .replace(/ /g, ' ')
        .replace(/(│|├|└)*/g, '').replace(/(┃|┣|┗|　)*/g, '')

        .replace(/Ⅰ/g, 'I').replace(/Ⅱ/g, 'II').replace(/Ⅲ/g, 'III').replace(/Ⅳ/g, 'IV').replace(/Ⅴ/g, 'V')

        .replace(/Ａ/g, 'A').replace(/Ｂ/g, 'B').replace(/Ｃ/g, 'C').replace(/Ｄ/g, 'D').replace(/Ｅ/g, 'E')
        .replace(/Ｆ/g, 'F').replace(/Ｇ/g, 'G').replace(/Ｈ/g, 'H').replace(/Ｉ/g, 'I').replace(/Ｊ/g, 'J')
        .replace(/Ｋ/g, 'K').replace(/Ｌ/g, 'L').replace(/Ｍ/g, 'M').replace(/Ｎ/g, 'N').replace(/Ｏ/g, 'O')
        .replace(/Ｐ/g, 'P').replace(/Ｑ/g, 'Q').replace(/Ｒ/g, 'R').replace(/Ｓ/g, 'S').replace(/Ｔ/g, 'T')
        .replace(/Ｕ/g, 'U').replace(/Ｖ/g, 'V').replace(/Ｗ/g, 'W').replace(/Ｘ/g, 'X').replace(/Ｙ/g, 'Y')
        .replace(/Ｚ/g, 'Z')

        .replace(/ａ/g, 'a').replace(/ｂ/g, 'b').replace(/ｃ/g, 'c').replace(/ｄ/g, 'd').replace(/ｅ/g, 'e')
        .replace(/ｆ/g, 'f').replace(/ｇ/g, 'g').replace(/ｈ/g, 'h').replace(/ｉ/g, 'i').replace(/ｊ/g, 'j')
        .replace(/ｋ/g, 'k').replace(/ｌ/g, 'l').replace(/ｍ/g, 'm').replace(/ｎ/g, 'n').replace(/ｏ/g, 'o')
        .replace(/ｐ/g, 'p').replace(/ｑ/g, 'q').replace(/ｒ/g, 'r').replace(/ｓ/g, 's').replace(/ｔ/g, 't')
        .replace(/ｕ/g, 'u').replace(/ｖ/g, 'v').replace(/ｗ/g, 'w').replace(/ｘ/g, 'x').replace(/ｙ/g, 'y')
        .replace(/ｚ/g, 'z')

        .replace(/１/g, '1').replace(/２/g, '2').replace(/３/g, '3').replace(/４/g, '4').replace(/５/g, '5')
        .replace(/６/g, '6').replace(/７/g, '7').replace(/８/g, '8').replace(/９/g, '9').replace(/０/g, '0')
        .replace(/＋/g, '+').replace(/(－|−)/g, '-').replace(/＝/g, '=').replace(/％/g, '%')
        .replace(/．/g, '.').replace(/･/g, '・').replace(/（/g, '(').replace(/）/g, ')')
}

export const guessArmorType = (name) => {
    let type = null
    let typeKeywordMapping = {
        helm: [
            '頭盔', '頭部', '【蒙面】', '綻放', '頭飾', '【頭巾】', '【武士盔】', '【元結】', '首腦',
            '毛髮', '護頭', '帽', '兜帽', '之首', '禮帽',
            '的包頭', '偽裝', '羽飾', '【斗笠】', '【面具】', '面具', '假髮'
        ],
        chest: [
            '鎧甲', '服飾', '【上衣】', '枝幹', '衣裝', '【上衣】', '【胸甲】', '【白衣】', '肌肉',
            '羽織', '上身', '戰衣', '洋裝', '胸甲', '服裝',
            '的鎧', '披風', '襯衫'
        ],
        arm: [
            '腕甲', '拳套', '【手甲】', '枝葉', '手套', '【手甲】', '【臂甲】', '【花袖】', '雙手',
            '臂甲', '護袖', '腕甲', '袖', '之臂', '護手'
        ],
        waist: [
            '腰甲', '纏腰布', '【腰卷】', '葉片', '腰帶', '【腰卷】', '【腰具】', '【腰卷】', '臍帶',
            '帶', '護腰具', '腰甲', '腰甲', '之腰', '腰甲'
        ],
        leg: [
            '護腿', '涼鞋', '【綁腿】', '紮根', '鞋子', '【綁腿】', '【腿甲】', '【緋袴】', '腳跟',
            '下裳', '腳', '靴', '長褲', '之足', '靴'
        ]
    }

    for (let entry of Object.entries(typeKeywordMapping)) {
        let typeName = entry[0]
        let keywords = entry[1]

        for (let keyword of keywords) {
            if (-1 === name.indexOf(keyword)) {
                continue
            }

            type = typeName

            break
        }

        if (Helper.isNotEmpty(type)) {
            break
        }
    }

    return type
}

export const weaponTypeList = [
    'greatSword', 'swordAndShield', 'dualBlades', 'longSword',
    'hammer', 'huntingHorn', 'lance', 'gunlance', 'switchAxe', 'chargeBlade',
    'insectGlaive', 'bow', 'heavyBowgun', 'lightBowgun'
]

export const rareList = [
    'rare1', 'rare2', 'rare3', 'rare4', 'rare5', 'rare6', 'rare7'
]

export const sizeList = [
    'size1', 'size2', 'size3'
]

export const crawlerList = [
    'gameqb', 'game8', 'kiranico', 'fextralife'
]

export const targetList = [
    'weapons',
    'armors',
    'petalaces',
    'jewels',
    'enhances',
    'skills'
]

export const langList = [
    'zhTW', 'jaJP', 'enUS'
]
