'use strict';
/**
 * Dataset Charm Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Dataset
import Charms from 'json/datasets/charms.json';

// [
//     0: id,
//     1: name,
//     2: rare,
//     3: skills [
//         [
//             0: id,
//             1: level
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Charms.map((charm) => {
    return {
        id: charm[0],
        name: charm[1],
        rare: charm[2],
        skills: charm[3].map((skill) => {
            return {
                id: skill[0],
                level: skill[1]
            };
        })
    };
});

class CharmHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.id] = data;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterSkillName = null;
    };

    getNames = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            let isSkip = true;

            if (null !== this.filterSkillName) {
                for (let index in data.skills) {
                    if (this.filterSkillName !== data.skills[index].id) {
                        continue;
                    }

                    isSkip = false;
                }

                if (isSkip) {
                    return false;
                }
            }

            return true;
        });

        this.resetFilter();

        return result;
    };

    getInfo = (name) => {
        return undefined !== this.mapping[name]
            ? JSON.parse(JSON.stringify(this.mapping[name])) : null;
    };

    // Conditional Functions
    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

export default new CharmHelper(dataset);
