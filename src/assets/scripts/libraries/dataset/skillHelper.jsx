'use strict';
/**
 * Dataset Skill Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Dataset
import Skills from 'json/datasets/skills.json';

// [
//     0: id,
//     1: name,
//     2: type,
//     3: from [
//         0: set,
//         1: jewel,
//         2: armor
//     ],
//     4: list [
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
        id: skill[0],
        name: skill[1],
        type: skill[2],
        from: {
            set: skill[3][0],
            jewel: skill[3][1],
            armor: skill[3][2]
        },
        list: skill[4].map((item) => {
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
            this.mapping[data.id] = data;
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
