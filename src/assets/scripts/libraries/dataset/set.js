/**
 * Dataset Set
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import Helper from 'core/helper'

// Load Dataset
import Sets from 'datasets/sets.json'

// [
//     0: id,
//     1: name,
//     2: from [
//         0: armor,
//         1: weapon
//     ],
//     3: skills [
//         [
//             0: name,
//             1: level
//             2: require
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Sets.map((set) => {
    return {
        id: set[0],
        name: set[1],
        from: {
            armor: set[2][0],
            weapon: set[2][1]
        },
        skills: set[3].map((skill) => {
            return {
                id: skill[0],
                level: skill[1],
                require: skill[2]
            }
        })
    }
})

class SetDataset {

    constructor (list) {
        this.mapping = {}

        list.forEach((data) => {
            this.mapping[data.id] = data
        })

        // Filter Conditional
        this.resetFilter()
    }

    resetFilter = () => {
        this.filterSkillName = null
    }

    getIds = () => {
        return Object.keys(this.mapping)
    }

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (Helper.isNotEmpty(this.filterSkillName)) {
                if (this.filterSkillName !== data.skill.id) {
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
    hasSkill = (name) => {
        this.filterSkillName = name

        return this
    }
}

export default new SetDataset(dataset)
