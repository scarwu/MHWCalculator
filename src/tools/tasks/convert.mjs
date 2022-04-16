/**
 * Convert Handler
 *
 * @package     Monster Hunter Rise - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHRCalculator
 */

import md5 from 'md5'

import Helper from '../liberaries/helper.mjs'
import {
    autoExtendListQuantity,
    weaponTypeList,
    rareList,
    sizeList,
    targetList
} from '../liberaries/mh.mjs'

const tempCrawlerRoot = 'temp/crawler'
const tempConvertRoot = 'temp/convert'

const fileRoot = '../files'

const assetsDatasetRoot = '../assets/scripts/datasets'
const assetsLangRoot = '../assets/scripts/langs'

const codeLength = 3
const codeChars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

export const runAction = () => {
    let rawDataMapping = {}

    // Load Raw Data
    Object.values(targetList).forEach((target) => {
        console.log(`load:${target}`)

        let list = Helper.loadCSVAsJSON(`${fileRoot}/${target}.csv`)

        if (Helper.isNotEmpty(list)) {
            rawDataMapping[target] = list
        }
    })

    // Load Unique Id Mapping
    let hashCodeMapping = Helper.loadJSON(`${fileRoot}/hashCodeMapping.json`)

    if (Helper.isEmpty(hashCodeMapping)) {
        hashCodeMapping = {}
    }

    // Init Used Code Maping By Unique Id Mapping
    let usedCodeMapping = {}

    Object.values(hashCodeMapping).forEach((code) => {
        usedCodeMapping[code] = true
    })

    const createCode = (text) => {
        if (Helper.isEmpty(text)) {
            return null
        }

        let hash = md5(text)

        if (Helper.isNotEmpty(hashCodeMapping[hash])) {
            return hashCodeMapping[hash]
        }

        let code = null

        while (true) {
            code = '_'

            for (let i = 0; i < codeLength; i++) {
                code += codeChars[parseInt(Math.random() * codeChars.length, 10)]
            }

            if (Helper.isEmpty(usedCodeMapping[code])) {
                hashCodeMapping[hash] = code
                usedCodeMapping[code] = true

                break
            }

            console.log(`createCode:duplicate <${code}:${hash}> <${text}>`)
        }

        return code
    }

    let datasetMapping = {}
    let datasetLangMapping = {}
    let incompleteDataMapping = {}

    // Handle Skills
    console.log('handle:skills')

    let skillBundlesMapping = {}

    rawDataMapping.skills.forEach((skillItem) => {

        // Check Propeties Using as Unique Key
        if (Helper.isEmpty(skillItem.name)
            || Helper.isEmpty(skillItem.name.zhTW)
            || Helper.isEmpty(skillItem.level)
        ) {
            if (Helper.isEmpty(incompleteDataMapping.skills)) {
                incompleteDataMapping.skills = []
            }

            incompleteDataMapping.skills.push(skillItem)

            return
        }

        if (Helper.isEmpty(skillBundlesMapping[skillItem.name.zhTW])) {
            skillBundlesMapping[skillItem.name.zhTW] = {}
            skillBundlesMapping[skillItem.name.zhTW].name = skillItem.name
            skillBundlesMapping[skillItem.name.zhTW].description = skillItem.description
            skillBundlesMapping[skillItem.name.zhTW].from = skillItem.from
            skillBundlesMapping[skillItem.name.zhTW].type = skillItem.type
            skillBundlesMapping[skillItem.name.zhTW].list = {}
        }

        if (Helper.isEmpty(skillBundlesMapping[skillItem.name.zhTW].list[skillItem.level])) {
            skillBundlesMapping[skillItem.name.zhTW].list[skillItem.level] = {
                level: skillItem.level,
                effect: skillItem.effect,
                reaction: skillItem.reaction
            }
        }
    })

    Object.values(skillBundlesMapping).forEach((skillBundle) => {
        skillBundle.list = Object.values(skillBundle.list)

        // Get Id Code
        let idCode = createCode(`skills:id:${skillBundle.name.zhTW}`)

        skillBundle.id = idCode

        // Get Translate Code & Create Dataset Lang Mapping
        for (let property of ['name', 'description']) {
            let translateCode = createCode(`skills:translate:${property}:${idCode}`)

            Object.keys(skillBundle[property]).forEach((lang) => {
                if (Helper.isEmpty(datasetLangMapping[lang])) {
                    datasetLangMapping[lang] = {}
                }

                datasetLangMapping[lang][translateCode] = skillBundle[property][lang]
            })

            skillBundle[property] = translateCode
        }

        // Bundle List
        skillBundle.list = skillBundle.list.map((skillItem) => {

            // Get Translate Code & Create Dataset Lang Mapping
            let translateCode = createCode(`skills:translate:effect:${idCode}:${skillItem.level}`)

            Object.keys(skillItem.effect).forEach((lang) => {
                if (Helper.isEmpty(datasetLangMapping[lang])) {
                    datasetLangMapping[lang] = {}
                }

                datasetLangMapping[lang][translateCode] = skillItem.effect[lang]
            })

            skillItem.effect = translateCode

            return skillItem
        })

        // Create Dataset Mapping
        if (Helper.isEmpty(datasetMapping.skills)) {
            datasetMapping.skills = []
        }

        datasetMapping.skills.push([
            skillBundle.id,
            skillBundle.name,
            skillBundle.description,
            [
                skillBundle.from.jewel,
                skillBundle.from.armor,
                skillBundle.from.charm
            ],
            skillBundle.type,
            skillBundle.list.map((skillItem) => {
                return [
                    skillItem.level,
                    skillItem.effect,
                    [
                        [
                            skillItem.reaction.attack.value
                        ],
                        [
                            skillItem.reaction.attackMultiple.value
                        ],
                        [
                            skillItem.reaction.defense.value
                        ],
                        [
                            skillItem.reaction.defenseMultiple.value
                        ],
                        [
                            skillItem.reaction.criticalRate.value
                        ],
                        [
                            skillItem.reaction.criticalMultiple.value
                        ],
                        [
                            skillItem.reaction.elementAttackCriticalMultiple.value
                        ],
                        [
                            skillItem.reaction.elementStatusCriticalMultiple.value
                        ],
                        [
                            skillItem.reaction.sharpness.value
                        ],
                        [
                            skillItem.reaction.resistance.type,
                            skillItem.reaction.resistance.value
                        ],
                        [
                            skillItem.reaction.resistanceMultiple.type,
                            skillItem.reaction.resistanceMultiple.value
                        ],
                        [
                            skillItem.reaction.elementAttack.type,
                            skillItem.reaction.elementAttack.value,
                            skillItem.reaction.elementAttack.multiple
                        ],
                        [
                            skillItem.reaction.elementStatus.type,
                            skillItem.reaction.elementStatus.value,
                            skillItem.reaction.elementStatus.multiple
                        ],
                        [
                            skillItem.reaction.skillLevelUp.value
                        ]
                    ]
                ]
            })
        ])
    })

    // Handle Enhances
    console.log('handle:enhances')

    rawDataMapping.enhances.forEach((enhanceItem) => {

        // Check Propeties Using as Unique Key
        if (Helper.isEmpty(enhanceItem.name)
            || Helper.isEmpty(enhanceItem.name.zhTW)
        ) {
            if (Helper.isEmpty(incompleteDataMapping.enhances)) {
                incompleteDataMapping.enhances = []
            }

            incompleteDataMapping.enhances.push(enhanceItem)

            return
        }

        // Get Id Code
        let idCode = createCode(`enhances:id:${enhanceItem.name.zhTW}`)

        enhanceItem.id = idCode

        // Get Translate Code & Create Dataset Lang Mapping
        for (let property of ['name', 'description']) {
            let translateCode = createCode(`enhances:translate:${property}:${idCode}`)

            Object.keys(enhanceItem[property]).forEach((lang) => {
                if (Helper.isEmpty(datasetLangMapping[lang])) {
                    datasetLangMapping[lang] = {}
                }

                datasetLangMapping[lang][translateCode] = enhanceItem[property][lang]
            })

            enhanceItem[property] = translateCode
        }

        // Create Dataset Mapping
        if (Helper.isEmpty(datasetMapping.enhances)) {
            datasetMapping.enhances = []
        }

        datasetMapping.enhances.push([
            enhanceItem.id,
            enhanceItem.name,
            enhanceItem.description,
            null // enhanceItem.reaction
        ])
    })

    // Handle Petalaces
    console.log('handle:petalaces')

    rawDataMapping.petalaces.forEach((petalaceItem) => {

        // Check Propeties Using as Unique Key
        if (Helper.isEmpty(petalaceItem.name)
            || Helper.isEmpty(petalaceItem.name.zhTW)
        ) {
            if (Helper.isEmpty(incompleteDataMapping.petalaces)) {
                incompleteDataMapping.petalaces = []
            }

            incompleteDataMapping.petalaces.push(petalaceItem)

            return
        }

        // Get Id Code
        let idCode = createCode(`petalaces:id:${petalaceItem.name.zhTW}`)

        petalaceItem.id = idCode

        // Get Translate Code & Create Dataset Lang Mapping
        let translateCode = createCode(`petalaces:translate:name:${idCode}`)

        Object.keys(petalaceItem.name).forEach((lang) => {
            if (Helper.isEmpty(datasetLangMapping[lang])) {
                datasetLangMapping[lang] = {}
            }

            datasetLangMapping[lang][translateCode] = petalaceItem.name[lang]
        })

        petalaceItem.name = translateCode

        // Create Dataset Mapping
        if (Helper.isEmpty(datasetMapping.petalaces)) {
            datasetMapping.petalaces = []
        }

        datasetMapping.petalaces.push([
            petalaceItem.id,
            petalaceItem.name,
            petalaceItem.rare,
            [
                petalaceItem.health.increment,
                petalaceItem.health.obtain
            ],
            [
                petalaceItem.stamina.increment,
                petalaceItem.stamina.obtain
            ],
            [
                petalaceItem.attack.increment,
                petalaceItem.attack.obtain
            ],
            [
                petalaceItem.defense.increment,
                petalaceItem.defense.obtain
            ]
        ])
    })

    // Handle Jewels
    console.log('handle:jewels')

    rawDataMapping.jewels.forEach((jewelItem) => {

        // Filter Empty Items
        jewelItem.skills = jewelItem.skills.filter((skillData) => {
            return Helper.isNotEmpty(skillData.name)
        })

        // Check Propeties Using as Unique Key
        if (Helper.isEmpty(jewelItem.name)
            || Helper.isEmpty(jewelItem.name.zhTW)
        ) {
            if (Helper.isEmpty(incompleteDataMapping.jewels)) {
                incompleteDataMapping.jewels = []
            }

            incompleteDataMapping.jewels.push(jewelItem)

            return
        }

        // Get Id Code
        let idCode = createCode(`jewels:id:${jewelItem.name.zhTW}`)

        jewelItem.id = idCode

        // Get Translate Code & Create Dataset Lang Mapping
        let translateCode = createCode(`jewels:translate:name:${idCode}`)

        Object.keys(jewelItem.name).forEach((lang) => {
            if (Helper.isEmpty(datasetLangMapping[lang])) {
                datasetLangMapping[lang] = {}
            }

            datasetLangMapping[lang][translateCode] = jewelItem.name[lang]
        })

        jewelItem.name = translateCode

        // Filter Empty
        jewelItem.skills = jewelItem.skills.map((skillData) => {
            skillData.name = createCode(`skills:id:${skillData.name}`)

            return skillData
        })

        // Create Dataset Mapping
        if (Helper.isEmpty(datasetMapping.jewels)) {
            datasetMapping.jewels = []
        }

        datasetMapping.jewels.push([
            jewelItem.id,
            jewelItem.name,
            jewelItem.rare,
            jewelItem.size,
            jewelItem.skills.map((skillData) => {
                return [
                    skillData.name,
                    skillData.level
                ]
            })
        ])
    })

    // Handle Armors
    console.log('handle:armors')

    let armorBundlesMapping = {}

    rawDataMapping.armors.forEach((armorItem) => {

        // Filter Empty Items
        armorItem.slots = armorItem.slots.filter((slotData) => {
            return Helper.isNotEmpty(slotData.size)
        })

        armorItem.skills = armorItem.skills.filter((skillData) => {
            return Helper.isNotEmpty(skillData.name)
        })

        // If armor's minDefense is empty or 0, meaning it's a layered armor
        if (Helper.isEmpty(armorItem.minDefense)
            || 0 === armorItem.minDefense
        ) {
            if (Helper.isEmpty(incompleteDataMapping.armors)) {
                incompleteDataMapping.armors = []
            }

            incompleteDataMapping.armors.push(armorItem)

            return
        }

        // Check Propeties Using as Unique Key
        if (Helper.isEmpty(armorItem.name)
            || Helper.isEmpty(armorItem.name.zhTW)
            || Helper.isEmpty(armorItem.series)
            || Helper.isEmpty(armorItem.series.zhTW)
            || Helper.isEmpty(armorItem.type)
        ) {
            if (Helper.isEmpty(incompleteDataMapping.armors)) {
                incompleteDataMapping.armors = []
            }

            incompleteDataMapping.armors.push(armorItem)

            return
        }

        if (Helper.isEmpty(armorBundlesMapping[armorItem.series.zhTW])) {
            armorBundlesMapping[armorItem.series.zhTW] = {
                series: {},
                items: {}
            }
            armorBundlesMapping[armorItem.series.zhTW].series.name = armorItem.series
            armorBundlesMapping[armorItem.series.zhTW].series.rare = armorItem.rare
            armorBundlesMapping[armorItem.series.zhTW].series.gender = armorItem.gender
            armorBundlesMapping[armorItem.series.zhTW].series.minDefense = armorItem.minDefense
            armorBundlesMapping[armorItem.series.zhTW].series.maxDefense = armorItem.maxDefense
            armorBundlesMapping[armorItem.series.zhTW].series.resistance = armorItem.resistance
        }

        if (Helper.isEmpty(armorBundlesMapping[armorItem.series.zhTW].items[armorItem.type])) {
            armorBundlesMapping[armorItem.series.zhTW].items[armorItem.type] = {
                name: armorItem.name,
                type: armorItem.type,
                slots: armorItem.slots,
                skills: armorItem.skills
            }
        }
    })

    Object.values(armorBundlesMapping).forEach((armorBundle) => {
        armorBundle.items = Object.values(armorBundle.items)

        // Get Id Code
        let idCode = createCode(`armors:id:${armorBundle.series.name.zhTW}`)

        armorBundle.series.id = idCode

        // Get Translate Code & Create Dataset Lang Mapping
        let translateCode = createCode(`armors:translate:series:name:${idCode}`)

        Object.keys(armorBundle.series.name).forEach((lang) => {
            if (Helper.isEmpty(datasetLangMapping[lang])) {
                datasetLangMapping[lang] = {}
            }

            datasetLangMapping[lang][translateCode] = armorBundle.series.name[lang]
        })

        armorBundle.series.name = translateCode

        // Bundle Items
        armorBundle.items = armorBundle.items.map((armorItem) => {

            // Get Id Code
            let idCode = createCode(`armors:id:${armorItem.name.zhTW}`)

            armorItem.id = idCode

            // Get Translate Code & Create Dataset Lang Mapping
            let translateCode = createCode(`armors:translate:item:name:${idCode}`)

            Object.keys(armorItem.name).forEach((lang) => {
                if (Helper.isEmpty(datasetLangMapping[lang])) {
                    datasetLangMapping[lang] = {}
                }

                datasetLangMapping[lang][translateCode] = armorItem.name[lang]
            })

            armorItem.name = translateCode

            // Find Code Id
            armorItem.skills = armorItem.skills.map((skillData) => {
                skillData.name = createCode(`skills:id:${skillData.name}`)

                return skillData
            })

            return armorItem
        })

        // Create Dataset Mapping
        if (Helper.isEmpty(datasetMapping.armors)) {
            datasetMapping.armors = []
        }

        datasetMapping.armors.push([
            [
                armorBundle.series.id,
                armorBundle.series.name,
                armorBundle.series.rare,
                armorBundle.series.gender,
                armorBundle.series.minDefense,
                armorBundle.series.maxDefense,
                [
                    armorBundle.series.resistance.fire,
                    armorBundle.series.resistance.water,
                    armorBundle.series.resistance.thunder,
                    armorBundle.series.resistance.ice,
                    armorBundle.series.resistance.dragon
                ]
            ],
            armorBundle.items.map((armorItem) => {
                return [
                    armorItem.id,
                    armorItem.name,
                    armorItem.type,
                    armorItem.slots.map((slotData) => {
                        return [
                            slotData.size
                        ]
                    }),
                    armorItem.skills.map((skillData) => {
                        return [
                            skillData.name,
                            skillData.level
                        ]
                    })
                ]
            })
        ])
    })

    // Handle Weapons
    console.log('handle:weapons')

    rawDataMapping.weapons.forEach((weaponItem) => {

        // Filter Empty Items
        weaponItem.slots = weaponItem.slots.filter((slotData) => {
            return Helper.isNotEmpty(slotData.size)
        })

        // weaponItem.enhance.list = weaponItem.enhance.list.filter((enhanceData) => {
        //     return Helper.isNotEmpty(enhanceData.name)
        // })

        // Check Propeties Using as Unique Key
        if (Helper.isEmpty(weaponItem.name)
            || Helper.isEmpty(weaponItem.name.zhTW)
        ) {
            if (Helper.isEmpty(incompleteDataMapping.weapons)) {
                incompleteDataMapping.weapons = []
            }

            incompleteDataMapping.weapons.push(weaponItem)

            return
        }

        // Get Id Code
        let idCode = createCode(`weapons:id:${weaponItem.name.zhTW}`)

        weaponItem.id = idCode

        // Get Translate Code & Create Dataset Lang Mapping
        for (let property of ['series', 'name']) {
            let translateCode = createCode(`weapons:translate:${property}:${idCode}`)

            Object.keys(weaponItem[property]).forEach((lang) => {
                if (Helper.isEmpty(datasetLangMapping[lang])) {
                    datasetLangMapping[lang] = {}
                }

                datasetLangMapping[lang][translateCode] = weaponItem[property][lang]
            })

            weaponItem[property] = translateCode
        }

        // Find Code Id
        // weaponItem.enhance.list = weaponItem.enhance.list.map((enhanceData) => {
        //     enhanceData.name = createCode(`enhances:id:${enhanceData.name}`)

        //     return enhanceData
        // })

        // Create Dataset Mapping
        if (Helper.isEmpty(datasetMapping.weapons)) {
            datasetMapping.weapons = []
        }

        datasetMapping.weapons.push([
            weaponItem.id,
            weaponItem.series,
            weaponItem.name,
            weaponItem.rare,
            weaponItem.type,
            weaponItem.attack,
            weaponItem.criticalRate,
            weaponItem.defense,
            [
                [
                    weaponItem.element.attack.type,
                    weaponItem.element.attack.minValue,
                    weaponItem.element.attack.maxValue
                ],
                [
                    weaponItem.element.status.type,
                    weaponItem.element.status.minValue,
                    weaponItem.element.status.maxValue
                ]
            ],
            [
                weaponItem.sharpness.minValue,
                weaponItem.sharpness.maxValue,
                [
                    weaponItem.sharpness.steps.red,
                    weaponItem.sharpness.steps.orange,
                    weaponItem.sharpness.steps.yellow,
                    weaponItem.sharpness.steps.green,
                    weaponItem.sharpness.steps.blue,
                    weaponItem.sharpness.steps.white,
                    weaponItem.sharpness.steps.purple
                ]
            ],
            weaponItem.slots.map((slotData) => {
                return [
                    slotData.size
                ]
            }),
            [
                weaponItem.enhance.amount,
                // weaponItem.enhance.list.map((enhanceData) => {
                //     return [
                //         enhanceData.name
                //     ]
                // })
            ]
        ])
    })

    // Save Datasets
    Object.keys(datasetMapping).forEach((target) => {
        Helper.saveJSON(`${assetsDatasetRoot}/${target}.json`, datasetMapping[target])
    })

    // Save Dataset Langs
    Object.keys(datasetLangMapping).forEach((lang) => {
        Helper.saveJSON(`${assetsLangRoot}/${lang}/dataset.json`, datasetLangMapping[lang])
    })

    // Save Unique Id Mapping
    Helper.saveJSON(`${fileRoot}/hashCodeMapping.json`, hashCodeMapping)

    // Save Imcompelete Data
    Helper.cleanFolder(tempConvertRoot)

    Object.keys(incompleteDataMapping).forEach((target) => {
        let list = autoExtendListQuantity(Object.values(incompleteDataMapping[target]))

        Helper.saveJSONAsCSV(`${tempConvertRoot}/incompleteData/${target}.csv`, list)
    })
}

export const findSkillSourceAction = () => {

    let skillList = Helper.loadCSVAsJSON(`${fileRoot}/skills.csv`)
    let jewelList = Helper.loadCSVAsJSON(`${fileRoot}/jewels.csv`)
    let armorList = Helper.loadCSVAsJSON(`${fileRoot}/armors.csv`)

    let jewelSkillMapping = {}
    let armorSkillMapping = {}

    jewelList.forEach((jewelItem) => {
        jewelItem.skills.forEach((skillData) => {
            jewelSkillMapping[skillData.name] = true
        })
    })

    armorList.forEach((armorItem) => {
        armorItem.skills.forEach((skillData) => {
            armorSkillMapping[skillData.name] = true
        })
    })

    skillList = skillList.map((skillItem) => {
        skillItem.from.jewel = Helper.isNotEmpty(jewelSkillMapping[skillItem.name.zhTW])
        skillItem.from.armor = Helper.isNotEmpty(armorSkillMapping[skillItem.name.zhTW])

        return skillItem
    })

    Helper.saveJSONAsCSV(`${fileRoot}/skills.csv`, autoExtendListQuantity(skillList))
}

export const infoAction = () => {

    // Generate Result Format
    let result = {
        weapons: {},
        armors: {},
        petalaces: {},
        jewels: {},
        enhances: {},
        skills: {}
    }

    result.weapons.all = {}
    result.armors.all = {}
    result.jewels.all = {}

    for (let weaponType of weaponTypeList) {
        result.weapons[weaponType] = {}
        result.weapons[weaponType].all = {}

        for (let rare of rareList) {
            result.weapons[weaponType][rare] = {}
        }
    }

    for (let rare of rareList) {
        result.armors[rare] = {}
    }

    for (let size of sizeList) {
        result.jewels[size] = {}
    }

    console.log(`count:final`)

    for (let target of targetList) {
        console.log(`count:final:${target}`)

        if ('weapons' === target) {
            let weaponList = Helper.loadCSVAsJSON(`${fileRoot}/weapons.csv`)

            if (Helper.isNotEmpty(weaponList)) {
                result.weapons.all.final = weaponList.length

                for (let item of weaponList) {
                    let weaponType = item.type

                    if (Helper.isEmpty(result.weapons[weaponType].all.final)) {
                        result.weapons[weaponType].all.final = 0
                    }

                    result.weapons[weaponType].all.final += 1

                    if (Helper.isNotEmpty(item.rare)) {
                        let rare = `rare${item.rare}`

                        if (Helper.isEmpty(result.weapons[weaponType][rare].final)) {
                            result.weapons[weaponType][rare].final = 0
                        }

                        result.weapons[weaponType][rare].final += 1
                    }
                }
            }

            continue
        }

        if ('armors' === target) {
            let armorList = Helper.loadCSVAsJSON(`${fileRoot}/armors.csv`)

            if (Helper.isNotEmpty(armorList)) {
                result.armors.all.final = armorList.length

                for (let item of armorList) {
                    if (Helper.isNotEmpty(item.rare)) {
                        let rare = `rare${item.rare}`

                        if (Helper.isEmpty(result.armors[rare])) {
                            console.log(item)
                        }

                        if (Helper.isEmpty(result.armors[rare].final)) {
                            result.armors[rare].final = 0
                        }

                        result.armors[rare].final += 1
                    }
                }
            }

            continue
        }

        if ('jewels' === target) {
            let jewelList = Helper.loadCSVAsJSON(`${fileRoot}/jewels.csv`)

            if (Helper.isNotEmpty(jewelList)) {
                result.jewels.all.final = jewelList.length

                for (let item of jewelList) {
                    if (Helper.isNotEmpty(item.size)) {
                        let size = `size${item.size}`

                        if (Helper.isEmpty(result.jewels[size].final)) {
                            result.jewels[size].final = 0
                        }

                        result.jewels[size].final += 1
                    }
                }
            }

            continue
        }

        let targetList = Helper.loadCSVAsJSON(`${fileRoot}/${target}.csv`)

        if (Helper.isNotEmpty(targetList)) {
            result[target].final = targetList.length
        }
    }

    // Load All Crawler Data
    const crawlerList = [
        'gameqb', 'game8', 'kiranico', 'fextralife'
    ]

    for (let crawler of crawlerList) {
        console.log(`count:${crawler}`)

        for (let target of targetList) {
            console.log(`count:${crawler}:${target}`)

            if ('weapons' === target) {
                let weaponList = Helper.loadCSVAsJSON(`${tempCrawlerRoot}/${crawler}/weapons.csv`)

                if (Helper.isNotEmpty(weaponList)) {
                    result.weapons.all[crawler] = weaponList.length

                    for (let item of weaponList) {
                        let weaponType = item.type

                        if (Helper.isEmpty(result.weapons[weaponType].all[crawler])) {
                            result.weapons[weaponType].all[crawler] = 0
                        }

                        result.weapons[weaponType].all[crawler] += 1

                        if (Helper.isNotEmpty(item.rare)) {
                            let rare = `rare${item.rare}`

                            if (Helper.isEmpty(result.weapons[weaponType][rare][crawler])) {
                                result.weapons[weaponType][rare][crawler] = 0
                            }

                            result.weapons[weaponType][rare][crawler] += 1
                        }
                    }

                    continue
                }

                for (let weaponType of weaponTypeList) {
                    let weaponList = Helper.loadCSVAsJSON(`${tempCrawlerRoot}/${crawler}/weapons/${weaponType}.csv`)

                    if (Helper.isNotEmpty(weaponList)) {
                        if (Helper.isEmpty(result.weapons.all[crawler])) {
                            result.weapons.all[crawler] = 0
                        }

                        if (Helper.isEmpty(result.weapons[weaponType].all[crawler])) {
                            result.weapons[weaponType].all[crawler] = 0
                        }

                        result.weapons.all[crawler] += weaponList.length
                        result.weapons[weaponType].all[crawler] += weaponList.length

                        for (let item of weaponList) {
                            if (Helper.isNotEmpty(item.rare)) {
                                let rare = `rare${item.rare}`

                                if (Helper.isEmpty(result.weapons[weaponType][rare])) {
                                    console.log(item)
                                }

                                if (Helper.isEmpty(result.weapons[weaponType][rare][crawler])) {
                                    result.weapons[weaponType][rare][crawler] = 0
                                }

                                result.weapons[weaponType][rare][crawler] += 1
                            }
                        }
                    }
                }

                continue
            }

            if ('armors' === target) {
                let armorList = Helper.loadCSVAsJSON(`${tempCrawlerRoot}/${crawler}/armors.csv`)

                if (Helper.isNotEmpty(armorList)) {
                    result.armors.all[crawler] = armorList.length

                    for (let item of armorList) {
                        if (Helper.isNotEmpty(item.rare)) {
                            let rare = `rare${item.rare}`

                            if (Helper.isEmpty(result.armors[rare])) {
                                console.log(item)
                            }

                            if (Helper.isEmpty(result.armors[rare][crawler])) {
                                result.armors[rare][crawler] = 0
                            }

                            result.armors[rare][crawler] += 1
                        }
                    }

                    continue
                }

                for (let rare of rareList) {
                    let armorList = Helper.loadCSVAsJSON(`${tempCrawlerRoot}/${crawler}/armors/${rare}.csv`)

                    if (Helper.isNotEmpty(armorList)) {
                        if (Helper.isEmpty(result.armors.all[crawler])) {
                            result.armors.all[crawler] = 0
                        }

                        result.armors.all[crawler] += armorList.length
                        result.armors[rare][crawler] = armorList.length
                    }
                }

                continue
            }

            if ('jewels' === target) {
                let jewelList = Helper.loadCSVAsJSON(`${tempCrawlerRoot}/${crawler}/jewels.csv`)

                if (Helper.isNotEmpty(jewelList)) {
                    result.jewels.all[crawler] = jewelList.length

                    for (let item of jewelList) {
                        if (Helper.isNotEmpty(item.size)) {
                            let size = `size${item.size}`

                            if (Helper.isEmpty(result.jewels[size][crawler])) {
                                result.jewels[size][crawler] = 0
                            }

                            result.jewels[size][crawler] += 1
                        }
                    }
                }

                continue
            }

            let targetList = Helper.loadCSVAsJSON(`${tempCrawlerRoot}/${crawler}/${target}.csv`)

            if (Helper.isNotEmpty(targetList)) {
                result[target][crawler] = targetList.length
            }
        }
    }

    // Result
    for (let target of Object.keys(result)) {
        console.log(target, '=', result[target])
    }
}

export const oldFilesAction = () => {

    // Load Old Data
    let oldWeaponList = []
    let oldArmorList = []
    let oldCharmList =  []
    let oldJewelList =  []
    let oldEnhanceList =  []
    let oldSkillList =  []
    let oldSetList =  []

    for (let type of weaponTypeList) {
        for (let level = 6; level <= 8; level++) {
            oldWeaponList = oldWeaponList.concat(Helper.loadJSON(`${fileRoot}/old/mhw/weapons/${type}/rare${level}.json`))
        }
    }

    for (let level = 5; level <= 8; level++) {
        oldArmorList = oldArmorList.concat(Helper.loadJSON(`${fileRoot}/old/mhw/armors/rare${level}.json`))
    }

    oldCharmList = oldCharmList.concat(Helper.loadJSON(`${fileRoot}/old/mhw/charms.json`))
    oldJewelList = oldJewelList.concat(Helper.loadJSON(`${fileRoot}/old/mhw/jewels.json`))
    oldEnhanceList = oldEnhanceList.concat(Helper.loadJSON(`${fileRoot}/old/mhw/enhances.json`))
    oldSkillList = oldSkillList.concat(Helper.loadJSON(`${fileRoot}/old/mhw/skills.json`))
    oldSetList = oldSetList.concat(Helper.loadJSON(`${fileRoot}/old/mhw/sets.json`))

    for (let type of weaponTypeList) {
        for (let level = 9; level <= 12; level++) {
            oldWeaponList = oldWeaponList.concat(Helper.loadJSON(`${fileRoot}/old/mhwib/weapons/${type}/rare${level}.json`))
        }
    }

    for (let level = 9; level <= 12; level++) {
        oldArmorList = oldArmorList.concat(Helper.loadJSON(`${fileRoot}/old/mhwib/armors/rare${level}.json`))
    }

    oldCharmList = oldCharmList.concat(Helper.loadJSON(`${fileRoot}/old/mhwib/charms.json`))
    oldJewelList = oldJewelList.concat(Helper.loadJSON(`${fileRoot}/old/mhwib/jewels.json`))
    oldEnhanceList = oldEnhanceList.concat(Helper.loadJSON(`${fileRoot}/old/mhwib/enhances.json`))
    oldSkillList = oldSkillList.concat(Helper.loadJSON(`${fileRoot}/old/mhwib/skills.json`))
    oldSetList = oldSetList.concat(Helper.loadJSON(`${fileRoot}/old/mhwib/sets.json`))

    // Convert Old Data To New Data
    let newWeaponList = []
    let newArmorList = []
    let newCharmList = []
    let newJewelList = []
    let newEnhanceList = []
    let newSkillList = []
    let newSetList = []

    // {
    //     "id": "冰炎劍維爾瑪閃焰",
    //     "rare": 8,
    //     "type": "dualBlades",
    //     "series": {
    //         "zhTW": "黑鋼"
    //     },
    //     "name": {
    //         "zhTW": "冰炎劍維爾瑪閃焰"
    //     },
    //     "attack": 252,
    //     "criticalRate": 10,
    //     "defense": 0,
    //     "sharpness": {
    //         "value": 350,
    //         "steps": {
    //             "red": 60,
    //             "orange": 50,
    //             "yellow": 60,
    //             "green": 120,
    //             "blue": 70,
    //             "white": 40,
    //             "purple": 0
    //         }
    //     },
    //     "element": {
    //         "attack": {
    //             "type": "ice",
    //             "minValue": 240,
    //             "maxValue": 310,
    //             "isHidden": false
    //         },
    //         "status": {
    //             "type": "blast",
    //             "minValue": 240,
    //             "maxValue": 300,
    //             "isHidden": false
    //         }
    //     },
    //     "elderseal": null,
    //     "slots": [
    //         {
    //             "size": 2
    //         }
    //     ],
    //     "skills": null
    // }
    oldWeaponList.forEach((weapon) => {
        newWeaponList.push({

        })
    })

    // {
    //     "series": {
    //         "id": "龍王的獨眼α",
    //         "name": {
    //             "zhTW": "龍王的獨眼α"
    //         },
    //         "rare": 8,
    //         "gender": "general",
    //         "defense": 90,
    //         "resistance": {
    //             "fire": 0,
    //             "water": 0,
    //             "thunder": 0,
    //             "ice": 0,
    //             "dragon": 0
    //         },
    //         "set": null
    //     },
    //     "items": [
    //         {
    //             "id": "龍王的獨眼α",
    //             "type": "helm",
    //             "name": {
    //                 "zhTW": "龍王的獨眼α"
    //             },
    //             "slots": [
    //                 {
    //                     "size": 3
    //                 }
    //             ],
    //             "skills": [
    //                 {
    //                     "id": "弱點特效",
    //                     "level": 2
    //                 }
    //             ]
    //         }
    //     ]
    // }
    oldArmorList.forEach((bundle) => {
        bundle.items.forEach((item) => {
            newArmorList.push({

            })
        })
    })

    // {
    //     "series": {
    //         "id": "迴避護石",
    //         "name": {
    //             "zhTW": "迴避護石",
    //             "jaJP": "回避の護石",
    //             "enUS": "Evasion Charm"
    //         }
    //     },
    //     "items": [
    //         {
    //             "id": "迴避護石 IV",
    //             "name": {
    //                 "zhTW": "迴避護石 IV",
    //                 "jaJP": "回避の護石 IV",
    //                 "enUS": "Evasion Charm IV"
    //             },
    //             "rare": 12,
    //             "level": 4,
    //             "skills": [
    //                 {
    //                     "id": "迴避性能",
    //                     "level": 4
    //                 }
    //             ]
    //         }
    //     ]
    // }
    oldCharmList.forEach((bundle) => {
        bundle.items.forEach((item) => {
            newCharmList.push({

            })
        })
    })

    // {
    //     "id": "増彈珠",
    //     "name": {
    //         "zhTW": "増彈珠"
    //     },
    //     "rare": 7,
    //     "size": 2,
    //     "skills": [
    //         {
    //             "id": "砲彈裝填數UP",
    //             "level": 1
    //         }
    //     ]
    // }
    oldJewelList.forEach((jewel) => {
        newJewelList.push({

        })
    })

    // {
    //     "id": "攻擊力強化 (mhwib)",
    //     "name": {
    //         "zhTW": "攻擊力強化",
    //         "jaJP": null,
    //         "enUS": null
    //     },
    //     "allowRares": [ 10, 11, 12 ],
    //     "list": [
    //         {
    //             "level": 1,
    //             "description": {
    //                 "zhTW": "基礎攻擊力+5",
    //                 "jaJP": null,
    //                 "enUS": null
    //             },
    //             "allowRares": [ 10, 11, 12 ],
    //             "size": 1,
    //             "reaction": {
    //                 "attack": {
    //                     "value": 5
    //                 }
    //             }
    //         }
    //     ]
    // }
    oldEnhanceList.forEach((enhance) => {
        newEnhanceList.push({

        })
    })

    // {
    //     "id": "體力增強",
    //     "name": {
    //         "zhTW": "體力增強"
    //     },
    //     "description": {
    //         "zhTW": "體力+15"
    //     },
    //     "type": "active",
    //     "from" : {
    //         "set": false,
    //         "jewel": true,
    //         "armor": true,
    //         "chram": false,
    //         "weapon": false
    //     },
    //     "list": [
    //         {
    //             "level": 1,
    //             "description": {
    //                 "zhTW": "體力+15"
    //             },
    //             "reaction": {
    //                 "health": {
    //                     "value": 15
    //                 }
    //             },
    //             "isHidden": false
    //         }
    //     ]
    // }
    oldSkillList.forEach((skill) => {
        newSkillList.push({

        })
    })

    // {
    //     "id": "蠻顎龍之力",
    //     "name": {
    //         "zhTW": "蠻顎龍之力"
    //     },
    //     "from" : {
    //         "armor": true,
    //         "weapon": false
    //     },
    //     "skills": [
    //         {
    //             "id": "振奮",
    //             "level": 1,
    //             "require": 3
    //         }
    //     ]
    // }
    oldSetList.forEach((set) => {
        newSetList.push({

        })
    })

    Helper.saveJSONAsCSV(`${tempConvertRoot}/weapons.csv`, autoExtendListQuantity(newWeaponList))
    Helper.saveJSONAsCSV(`${tempConvertRoot}/armors.csv`, autoExtendListQuantity(newArmorList))
    Helper.saveJSONAsCSV(`${tempConvertRoot}/charms.csv`, autoExtendListQuantity(newCharmList))
    Helper.saveJSONAsCSV(`${tempConvertRoot}/jewels.csv`, autoExtendListQuantity(newJewelList))
    Helper.saveJSONAsCSV(`${tempConvertRoot}/enhances.csv`, autoExtendListQuantity(newEnhanceList))
    Helper.saveJSONAsCSV(`${tempConvertRoot}/skills.csv`, autoExtendListQuantity(newSkillList))
    Helper.saveJSONAsCSV(`${tempConvertRoot}/sets.csv`, autoExtendListQuantity(newSetList))
}

export default {
    runAction,
    findSkillSourceAction,
    infoAction,
    oldFilesAction
}
