'use strict';
/**
 * Common
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Constant
import Constant from 'constant';

// Load Datasets
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import EnhanceDataset from 'libraries/dataset/enhance';
import SkillDataset from 'libraries/dataset/skill';

let getAppliedWeaponInfo = (extend) => {
    let info = WeaponDataset.getInfo(extend.id);

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
        let enhanceId = null;

        if (null !== extend.enhanceIds
            && 'string' === typeof extend.enhanceIds[index]) {

            enhanceId = extend.enhanceIds[index];
        }

        // Update Info
        info.enhances.push({
            id: enhanceId
        });

        if (null === enhanceId) {
            return false;
        }

        if (undefined === enhanceLevelMapping[enhanceId]) {
            enhanceLevelMapping[enhanceId] = 0;
        }

        enhanceLevelMapping[enhanceId] += 1;
    });

    Object.keys(enhanceLevelMapping).forEach((enhanceId) => {
        let enhanceLevel = enhanceLevelMapping[enhanceId];
        let enhanceInfo = EnhanceDataset.getInfo(enhanceId);

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
        let skillId = data.id;

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;
        let jewelId = null;
        let jewelSize = null;
        let skillId = null;

        if (null !== extend.slotIds
            && 'string' === typeof extend.slotIds[index]) {

            jewelInfo = JewelDataset.getInfo(extend.slotIds[index]);
            jewelId = extend.slotIds[index];
            jewelSize = jewelInfo.size;
            skillId = jewelInfo.skill.id;
        }

        // Update Info
        info.slots[index].jewel = {
            id: jewelId,
            size: jewelSize
        };

        if (null === skillId) {
            return false;
        }

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += jewelInfo.skill.level;
    });

    // Reset Skill
    info.skills = [];

    Object.keys(skillLevelMapping).forEach((skillId) => {
        let skillLevel = skillLevelMapping[skillId];
        let skillInfo = SkillDataset.getInfo(skillId);

        // Fix Skill Level Overflow
        if (skillLevel > skillInfo.list.length) {
            skillLevel = skillInfo.list.length;
        }

        info.skills.push({
            id: skillId,
            level: skillLevel,
            description: skillInfo.list[skillLevel - 1].description
        });
    });

    info.skills = info.skills.sort((a, b) => {
        return b.level - a.level;
    });

    return Helper.deepCopy(info);
};

let getAppliedArmorInfo = (extend) => {
    let info = ArmorDataset.getInfo(extend.id);

    // Handler Skill & Slot
    let skillLevelMapping = {};

    info.skills && info.skills.forEach((data, index) => {
        let skillId = data.id;

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;
        let jewelId = null;
        let jewelSize = null;
        let skillId = null;

        if (null !== extend.slotIds
            && 'string' === typeof extend.slotIds[index]) {

            jewelInfo = JewelDataset.getInfo(extend.slotIds[index]);
            jewelId = extend.slotIds[index];
            jewelSize = jewelInfo.size;
            skillId = jewelInfo.skill.id;
        }

        // Update Info
        info.slots[index].jewel = {
            id: jewelId,
            size: jewelSize
        };

        if (null === skillId) {
            return false;
        }

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += jewelInfo.skill.level;
    });

    // Reset Skill
    info.skills = [];

    Object.keys(skillLevelMapping).forEach((skillId) => {
        let skillLevel = skillLevelMapping[skillId];
        let skillInfo = SkillDataset.getInfo(skillId);

        info.skills.push({
            id: skillId,
            level: skillLevel,
            description: skillInfo.list[skillLevel - 1].description
        });
    });

    info.skills = info.skills.sort((a, b) => {
        return b.level - a.level;
    });

    return Helper.deepCopy(info);
};

let getAppliedCharmInfo = (extend) => {
    let info = CharmDataset.getInfo(extend.id);

    // Handler Skill & Slot
    let skillLevelMapping = {};

    info.skills || info.skills.forEach((data, index) => {
        let skillId = data.id;

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    // Reset Skill
    info.skills = [];

    Object.keys(skillLevelMapping).forEach((skillId) => {
        let skillLevel = skillLevelMapping[skillId];
        let skillInfo = SkillDataset.getInfo(skillId);

        // Fix Skill Level Overflow
        if (skillLevel > skillInfo.list.length) {
            skillLevel = skillInfo.list.length;
        }

        info.skills.push({
            id: skillId,
            level: skillLevel,
            description: skillInfo.list[skillLevel - 1].description
        });
    });

    info.skills = info.skills.sort((a, b) => {
        return b.level - a.level;
    });

    return Helper.deepCopy(info);
};

export default {
    getAppliedWeaponInfo: getAppliedWeaponInfo,
    getAppliedArmorInfo: getAppliedArmorInfo,
    getAppliedCharmInfo: getAppliedCharmInfo
};
