'use strict';
/**
 * Dataset Skill Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant
import Constant from 'constant';

// Load Dataset
import Skills from 'datasets/skills';

// [
//     0: name,
//     1: type,
//     2: from [
//         0: set,
//         1: jewel,
//         2: armor
//     ],
//     3: list [
//         [
//             0: level,
//             1: description,
//             2: reaction { ... }
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Skills.map((skill) => {
    return {
        name: skill[0],
        type: skill[1],
        from: {
            set: skill[2][0],
            jewel: skill[2][1],
            armor: skill[2][2]
        },
        list: skill[3].map((item) => {
            return {
                level: item[0],
                description: item[1],
                reaction: item[2]
            }
        })
    };
});

class SkillHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;
        });
    }

    getNames = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping);
    };

    getInfo = (name) => {
        return undefined !== this.mapping[name]
            ? JSON.parse(JSON.stringify(this.mapping[name])) : null;
    };
}

export default new SkillHelper(dataset);
