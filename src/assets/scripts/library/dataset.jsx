'use strict';
/**
 * Data Set
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load JSON Data
import skill from '../../json/skill.json';
import jewel from '../../json/jewel.json';
import charm from '../../json/charm.json';
import armor from '../../json/armor.json';
import weapon from '../../json/weapon.json';

/**
 * Weapon Helper
 */
class WeaponHelper {

    constructor (mapping) {
        this.mapping = mapping;

        // Filter Conditional
        this.filterType = null;
        this.filterElementType = null;
        this.filterAttack = null;
        this.filterCriticalRate = null;
        this.filterDefense = null;
        this.filterElementValue = null;
        this.filterSlotCount = null;
    }

    getInfo = (key) => {
        return (undefined !== this.mapping[key])
            ? this.mapping[key] : null;
    };

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping);
    };

    // Conditional Functions
    typeIs = (text) => {
        this.filterType = text;

        return this;
    };

    elementTypeIs = (text) => {
        this.filterElementType = text;

        return this;
    };

    attackIsGreaterEqualThen = (value) => {
        this.filterAttack = value;

        return this;
    };

    criticalRateIsGreaterEqualThen = (value) => {
        this.filterCriticalRate = value;

        return this;
    };

    defenseIsGreaterEqualThen = (value) => {
        this.filterDefense = value;

        return this;
    };

    elementValueIsGreaterEqualThen = (value) => {
        this.filterElementValue = value;

        return this;
    };

    slotCountIsGreaterEqualThen = (value) => {
        this.filterSlotCount = value;

        return this;
    };
}

/**
 * Armor Helper
 */
class ArmorHelper {

    constructor (mapping) {
        this.mapping = mapping;

        // Filter Conditional
        this.filterSkillKey = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            let isSkip = true;

            if (null !== this.filterSkillKey) {
                for (let index in data.skills) {
                    if (this.filterSkillKey !== data.skills[index].key) {
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
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? this.mapping[key] : null;
    };

    // Conditional Functions
    hasSkill = (key) => {
        this.filterSkillKey = key;

        return this;
    }
}

/**
 * Charm Helper
 */
class CharmHelper {

    constructor (mapping) {
        this.mapping = mapping;

        // Filter Conditional
        this.filterSkillKey = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            let isSkip = true;

            if (null !== this.filterSkillKey) {
                for (let index in data.skills) {
                    if (this.filterSkillKey !== data.skills[index].key) {
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
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? this.mapping[key] : null;
    };

    // Conditional Functions
    hasSkill = (key) => {
        this.filterSkillKey = key;

        return this;
    }
}

/**
 * Jewel Helper
 */
class JewelHelper {

    constructor (mapping) {
        this.mapping = mapping;

        // Filter Conditional
        this.filterSkillKey = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            if (null !== this.filterSkillKey) {
                if (this.filterSkillKey !== data.skill.key) {
                    return false;
                }
            }

            return true;
        });
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? this.mapping[key] : null;
    };

    hasSkill = (key) => {
        this.filterSkillKey = key;

        return this;
    }
}

/**
 * Skill Helper
 */
class SkillHelper {

    constructor (mapping) {
        this.mapping = mapping;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping);
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? this.mapping[key] : null;
    };
}

export default {
    weapon: new WeaponHelper(weapon),
    armor: new ArmorHelper(armor),
    charm: new CharmHelper(charm),
    jewel: new JewelHelper(jewel),
    skill: new SkillHelper(skill)
};
