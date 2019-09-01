'use strict';
/**
 * Dataset Skill
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Dataset
import Skills from 'files/json/datasets/skills.json';

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

class SkillDataset {

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
        return (Helper.isNotEmpty(this.mapping[name]))
            ? Helper.deepCopy(this.mapping[name]) : null;
    };
}

export default new SkillDataset(dataset);
