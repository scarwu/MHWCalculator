'use strict';
/**
 * Dataset Set Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant
import Constant from 'constant';

// Load Dataset
import Sets from 'datasets/sets';

// [
//     0: name,
//     1: skills [
//         [
//             0: name,
//             1: require
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Sets.map((set) => {
    return {
        name: set[0],
        skills: set[1].map((skill) => {
            return {
                name: skill[0],
                require: skill[1]
            };
        })
    };
});

class SetHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;
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
                if (this.filterSkillName !== data.skill.name) {
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
