'use strict';
/**
 * Dataset Weapon Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Custom Libraries
import Lang from 'libraries/lang';
import EnhanceHelper from 'libraries/dataset/enhanceHelper';

// Load Constant
import Constant from 'constant';

// Load Dataset
import R6GreatSword from 'datasets/weapons/greatSword/rare6';
import R6LongSword from 'datasets/weapons/longSword/rare6';
import R6SwordAndShield from 'datasets/weapons/swordAndShield/rare6';
import R6DualBlades from 'datasets/weapons/dualBlades/rare6';
import R6Hammer from 'datasets/weapons/hammer/rare6';
import R6HuntingHorn from 'datasets/weapons/huntingHorn/rare6';
import R6Lance from 'datasets/weapons/lance/rare6';
import R6Gunlance from 'datasets/weapons/gunlance/rare6';
import R6SwitchAxe from 'datasets/weapons/switchAxe/rare6';
import R6ChargeBlade from 'datasets/weapons/chargeBlade/rare6';
import R6InsectGlaive from 'datasets/weapons/insectGlaive/rare6';
import R6Bow from 'datasets/weapons/bow/rare6';
import R6LightBowgun from 'datasets/weapons/lightBowgun/rare6';
import R6HeavyBowgun from 'datasets/weapons/heavyBowgun/rare6';

import R7GreatSword from 'datasets/weapons/greatSword/rare7';
import R7LongSword from 'datasets/weapons/longSword/rare7';
import R7SwordAndShield from 'datasets/weapons/swordAndShield/rare7';
import R7DualBlades from 'datasets/weapons/dualBlades/rare7';
import R7Hammer from 'datasets/weapons/hammer/rare7';
import R7HuntingHorn from 'datasets/weapons/huntingHorn/rare7';
import R7Lance from 'datasets/weapons/lance/rare7';
import R7Gunlance from 'datasets/weapons/gunlance/rare7';
import R7SwitchAxe from 'datasets/weapons/switchAxe/rare7';
import R7ChargeBlade from 'datasets/weapons/chargeBlade/rare7';
import R7InsectGlaive from 'datasets/weapons/insectGlaive/rare7';
import R7Bow from 'datasets/weapons/bow/rare7';
import R7LightBowgun from 'datasets/weapons/lightBowgun/rare7';
import R7HeavyBowgun from 'datasets/weapons/heavyBowgun/rare7';

import R8GreatSword from 'datasets/weapons/greatSword/rare8';
import R8LongSword from 'datasets/weapons/longSword/rare8';
import R8SwordAndShield from 'datasets/weapons/swordAndShield/rare8';
import R8DualBlades from 'datasets/weapons/dualBlades/rare8';
import R8Hammer from 'datasets/weapons/hammer/rare8';
import R8HuntingHorn from 'datasets/weapons/huntingHorn/rare8';
import R8Lance from 'datasets/weapons/lance/rare8';
import R8Gunlance from 'datasets/weapons/gunlance/rare8';
import R8SwitchAxe from 'datasets/weapons/switchAxe/rare8';
import R8ChargeBlade from 'datasets/weapons/chargeBlade/rare8';
import R8InsectGlaive from 'datasets/weapons/insectGlaive/rare8';
import R8Bow from 'datasets/weapons/bow/rare8';
import R8LightBowgun from 'datasets/weapons/lightBowgun/rare8';
import R8HeavyBowgun from 'datasets/weapons/heavyBowgun/rare8';

let dataset = []
    .concat(R6GreatSword).concat(R6LongSword)
    .concat(R6SwordAndShield).concat(R6DualBlades)
    .concat(R6Hammer).concat(R6HuntingHorn)
    .concat(R6Lance).concat(R6Gunlance)
    .concat(R6SwitchAxe).concat(R6ChargeBlade)
    .concat(R6InsectGlaive).concat(R6Bow)
    .concat(R6LightBowgun).concat(R6HeavyBowgun)

    .concat(R7GreatSword).concat(R7LongSword)
    .concat(R7SwordAndShield).concat(R7DualBlades)
    .concat(R7Hammer).concat(R7HuntingHorn)
    .concat(R7Lance).concat(R7Gunlance)
    .concat(R7SwitchAxe).concat(R7ChargeBlade)
    .concat(R7InsectGlaive).concat(R7Bow)
    .concat(R7LightBowgun).concat(R7HeavyBowgun)

    .concat(R8GreatSword).concat(R8LongSword)
    .concat(R8SwordAndShield).concat(R8DualBlades)
    .concat(R8Hammer).concat(R8HuntingHorn)
    .concat(R8Lance).concat(R8Gunlance)
    .concat(R8SwitchAxe).concat(R8ChargeBlade)
    .concat(R8InsectGlaive).concat(R8Bow)
    .concat(R8LightBowgun).concat(R8HeavyBowgun);

class WeaponHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;

            if (null === data.slots || 0 === data.slots.length) {
                return true;
            }

            let slots = data.slots.sort((a, b) => {
                return b.size - a.size;
            });

            let slotEquipData = {
                name: slots.map((slot) => {
                    return '[' + slot.size + ']';
                }).join('') + ' 插槽' + Lang[data.type],
                rare: 0,
                type: data.type,
                series: "插槽",
                attack: 0,
                criticalRate: 0,
                defense: 0,
                sharpness: null,
                element: {
                    attack: null,
                    status: null
                },
                elderseal: null,
                slots: slots,
                skills: []
            };

            this.mapping[slotEquipData.name] = slotEquipData;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterType = null;
        this.filterRare = null;
        this.filterElementType = null;
        this.filterAttack = null;
        this.filterCriticalRate = null;
        this.filterDefense = null;
        this.filterElementValue = null;
        this.filterSlotCount = null;
    };

    getNames = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (null !== this.filterType) {
                if (this.filterType !== data.type) {
                    return false;
                }
            }

            if (null !== this.filterRare) {
                if (this.filterRare !== data.rare) {
                    return false;
                }
            }

            return true;
        });

        this.resetFilter();

        return result;
    };

    getInfo = (name) => {
        return (undefined !== this.mapping[name])
            ? JSON.parse(JSON.stringify(this.mapping[name])) : null;
    };

    // Applyed Info
    getApplyedInfo = (extend) => {
        let info = this.getInfo(extend.name);

        if (null !== info.element.attack) {
            info.element.attack.value = info.element.attack.minValue;
        }

        if (null !== info.element.status) {
            info.element.status.value = info.element.status.minValue;
        }

        // Handle Enhance
        let enhanceLevelMapping = {};
        let enhanceTimes = 0;
        info.enhances = [];

        if (8 === info.rare) {
            enhanceTimes = [...Array(1).keys()];
        } else if (7 === info.rare) {
            enhanceTimes = [...Array(2).keys()];
        } else if (6 === info.rare) {
            enhanceTimes = [...Array(3).keys()];
        } else {
            enhanceTimes = [];
        }

        enhanceTimes.forEach((data, index) => {
            let enhanceName = null;

            if (null !== extend.enhanceNames
                && 'string' === typeof extend.enhanceNames[index]) {

                enhanceName = extend.enhanceNames[index];
            }

            // Update Info
            info.enhances.push({
                name: enhanceName
            });

            if (null === enhanceName) {
                return false;
            }

            if (undefined === enhanceLevelMapping[enhanceName]) {
                enhanceLevelMapping[enhanceName] = 0;
            }

            enhanceLevelMapping[enhanceName] += 1;
        });

        Object.keys(enhanceLevelMapping).forEach((enhanceName) => {
            let enhanceLevel = enhanceLevelMapping[enhanceName];
            let enhanceInfo = EnhanceHelper.getInfo(enhanceName);

            if (null === enhanceInfo.list[enhanceLevel - 1].reaction) {
                return false;
            }

            Object.keys(enhanceInfo.list[enhanceLevel - 1].reaction).forEach((reactionType) => {
                let data = enhanceInfo.list[enhanceLevel - 1].reaction[reactionType];

                switch (reactionType) {
                case 'attack':
                    info.attack += data.value * Constant.weaponMultiple[info.type];
                    info.attack = parseInt(Math.round(info.attack));

                    break;
                case 'criticalRate':
                    info.criticalRate += data.value;

                    break;
                case 'defense':
                    info.defense = data.value;

                    break;
                case 'addSlot':
                    info.slots.push({
                        size: data.size
                    });

                    break;
                }
            });
        });

        // Handler Slot
        let skillLevelMapping = {};

        info.skills && info.skills.forEach((data, index) => {
            let skillName = data.name;

            if (undefined === skillLevelMapping[skillName]) {
                skillLevelMapping[skillName] = 0;
            }

            skillLevelMapping[skillName] += data.level;
        });

        info.slots && info.slots.forEach((data, index) => {
            let jewelInfo = null;
            let jewelName = null;
            let jewelSize = null;
            let skillName = null;

            if (null !== extend.slotNames
                && 'string' === typeof extend.slotNames[index]) {

                jewelInfo = jewelHelper.getInfo(extend.slotNames[index]);
                jewelName = extend.slotNames[index];
                jewelSize = jewelInfo.size;
                skillName = jewelInfo.skill.name;
            }

            // Update Info
            info.slots[index].jewel = {
                name: jewelName,
                size: jewelSize
            };

            if (null === skillName) {
                return false;
            }

            if (undefined === skillLevelMapping[skillName]) {
                skillLevelMapping[skillName] = 0;
            }

            skillLevelMapping[skillName] += jewelInfo.skill.level;
        });

        // Reset Skill
        info.skills = [];

        Object.keys(skillLevelMapping).forEach((skillName) => {
            let skillLevel = skillLevelMapping[skillName];
            let skillInfo = skillHelper.getInfo(skillName);

            // Fix Skill Level Overflow
            if (skillLevel > skillInfo.list.length) {
                skillLevel = skillInfo.list.length;
            }

            info.skills.push({
                name: skillName,
                level: skillLevel,
                description: skillInfo.list[skillLevel - 1].description
            });
        });

        info.skills = info.skills.sort((a, b) => {
            return b.level - a.level;
        });

        return info;
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

export default new WeaponHelper(dataset);
