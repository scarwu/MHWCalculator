/**
 * Dataset Weapon
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper'

// Load Dataset
import Weapons from 'datasets/weapons.json'

let dataset = Weapons.map((weapon) => {
    return {
        id: weapon[0],
        rare: weapon[1],
        type: weapon[2],
        series: weapon[3],
        name: weapon[4],
        attack: weapon[5],
        criticalRate: weapon[6],
        defense: weapon[7],
        sharpness: (Helper.isNotEmpty(weapon[8])) ? {
            value: weapon[8][0],
            steps: {
                red: weapon[8][1][0],
                orange: weapon[8][1][1],
                yellow: weapon[8][1][2],
                green: weapon[8][1][3],
                blue: weapon[8][1][4],
                white: weapon[8][1][5],
                purple: weapon[8][1][6]
            }
        } : null,
        element: {
            attack: (Helper.isNotEmpty(weapon[9][0])) ? {
                type: weapon[9][0][0],
                minValue: weapon[9][0][1],
                maxValue: weapon[9][0][2],
                isHidden: weapon[9][0][3]
            } : null,
            status: (Helper.isNotEmpty(weapon[9][1])) ? {
                type: weapon[9][1][0],
                minValue: weapon[9][1][1],
                maxValue: weapon[9][1][2],
                isHidden: weapon[9][1][3]
            } : null
        },
        elderseal: (Helper.isNotEmpty(weapon[10])) ? {
            affinity: weapon[10]
        } : null,
        slots: (Helper.isNotEmpty(weapon[11])) ? weapon[11].map((size) => {
            return {
                size: size
            }
        }) : [],
        skills: (Helper.isNotEmpty(weapon[12])) ? weapon[12].map((skill) => {
            return {
                id: skill[0],
                level: skill[1]
            }
        }) : [],
        set: (Helper.isNotEmpty(weapon[13])) ? {
            id: weapon[13]
        } : null,
    }
})

class WeaponDataset {

    constructor (list) {
        this.mapping = {}

        list.forEach((data) => {
            this.mapping[data.id] = data
        })

        // Filter Conditional
        this.resetFilter()
    }

    resetFilter = () => {
        this.filterType = null
        this.filterTypes = null
        this.filterRare = null
        this.filterSkillName = null
    }

    getIds = () => {
        return Object.keys(this.mapping)
    }

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            let isSkip = true

            // Type Is
            if (Helper.isNotEmpty(this.filterType)) {
                if (this.filterType !== data.type) {
                    return false
                }
            }

            // Types Is
            if (Helper.isNotEmpty(this.filterTypes)) {
                isSkip = false

                if (-1 === this.filterTypes.indexOf(data.type)) {
                    isSkip = true
                }

                if (isSkip) {
                    return false
                }
            }

            // Rare Is
            if (Helper.isNotEmpty(this.filterRare)) {
                if (this.filterRare !== data.rare) {
                    return false
                }
            }

            // Has Skill
            if (Helper.isNotEmpty(this.filterSkillName)) {
                for (let index in data.skills) {
                    if (this.filterSkillName !== data.skills[index].id) {
                        continue
                    }

                    isSkip = false
                }

                if (isSkip) {
                    return false
                }
            }

            return true
        })

        this.resetFilter()

        return result
    }

    getInfo = (id) => {
        return (Helper.isNotEmpty(this.mapping[id]))
            ? Helper.deepCopy(this.mapping[id]) : null
    }

    setInfo = (id, info) => {
        if (Helper.isNotEmpty(info)) {
            this.mapping[id] = info
        } else {
            delete this.mapping[id]
        }
    }

    // Conditional Functions
    typeIs = (text) => {
        this.filterType = text

        return this
    }

    typesIs = (types) => {
        this.filterTypes = types

        return this
    }

    rareIs = (number) => {
        this.filterRare = number

        return this
    }

    hasSkill = (name) => {
        this.filterSkillName = name

        return this
    }
}

export default new WeaponDataset(dataset)
