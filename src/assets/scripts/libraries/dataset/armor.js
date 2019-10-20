/**
 * Dataset Armor
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Dataset
import Armors from 'files/json/datasets/armors.json';

let dataset = Armors.map((bundle) => {
    return bundle[1].map((item) => {
        return {
            seriesId: bundle[0][0],
            series: bundle[0][1],
            rare: bundle[0][2],
            gender: bundle[0][3],
            defense: bundle[0][4],
            resistance: {
                fire: bundle[0][5][0],
                water: bundle[0][5][1],
                thunder: bundle[0][5][2],
                ice: bundle[0][5][3],
                dragon: bundle[0][5][4]
            },
            set: (Helper.isNotEmpty(bundle[0][6])) ? {
                id: bundle[0][6]
            } : null,
            id: item[0],
            name: item[1],
            type: item[2],
            slots: (Helper.isNotEmpty(item[3])) ? item[3].map((size) => {
                return {
                    size: size
                }
            }) : [],
            skills: (Helper.isNotEmpty(item[4])) ? item[4].map((skill) => {
                return {
                    id: skill[0],
                    level: skill[1]
                };
            }) : []
        };
    });
})
.reduce((armorsA, armorsB) => {
    return armorsA.concat(armorsB);
});

class ArmorDataset {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.id] = data;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterType = null;
        this.filterRare = null;
        this.filterSet = null;
        this.filterSkillName = null;
    };

    getIds = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (Helper.isNotEmpty(this.filterType)) {
                if (this.filterType !== data.type) {
                    return false;
                }
            }

            if (Helper.isNotEmpty(this.filterRare)) {
                if (this.filterRare !== data.rare) {
                    return false;
                }
            }

            if (Helper.isNotEmpty(this.filterSet)) {
                if (Helper.isEmpty(data.set)
                    || this.filterSet !== data.set.id
                ) {
                    return false;
                }
            }

            let isSkip = true;

            if (Helper.isNotEmpty(this.filterSkillName)) {
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
        return (Helper.isNotEmpty(this.mapping[name]))
            ? Helper.deepCopy(this.mapping[name]) : null;
    };

    // Conditional Functions
    typeIs = (text) => {
        this.filterType = text;

        return this;
    };

    rareIs = (number) => {
        this.filterRare = number;

        return this;
    };

    setIs = (text) => {
        this.filterSet = text;

        return this;
    };

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

export default new ArmorDataset(dataset);
