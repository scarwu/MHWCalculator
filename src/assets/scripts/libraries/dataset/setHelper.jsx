'use strict';
/**
 * Dataset Set Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Dataset
import Sets from 'json/datasets/sets.json';

// [
//     0: id,
//     1: name,
//     2: skills [
//         [
//             0: name,
//             1: require
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Sets.map((set) => {
    return {
        id: set[0],
        name: set[1],
        skills: set[2].map((skill) => {
            return {
                id: skill[0],
                require: skill[1]
            };
        })
    };
});

class SetHelper {

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
            if (null !== this.filterSkillName) {
                if (this.filterSkillName !== data.skill.id) {
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

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

export default new SetHelper(dataset);
