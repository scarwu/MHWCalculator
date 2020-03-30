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
    if ('object' !== typeof extend
        || 'string' !== typeof extend.id
    ) {
        return null;
    }

    let info = WeaponDataset.getInfo(extend.id);

    if (Helper.isEmpty(info)) {
        return null;
    }

    if (Helper.isNotEmpty(info.element)
        && Helper.isNotEmpty(info.element.attack)
    ) {
        info.element.attack.value = info.element.attack.minValue;
    }

    if (Helper.isNotEmpty(info.element)
        && Helper.isNotEmpty(info.element.status)
    ) {
        info.element.status.value = info.element.status.minValue;
    }

    // Handle Enhance
    let enhanceSize = 0;

    if (6 <= info.rare && info.rare <= 8) {
        enhanceSize = 9 - info.rare;
    }

    if (10 <= info.rare && info.rare <= 12) {
        enhanceSize = (15 - info.rare) * 2;
    }

    info.enhanceSize = enhanceSize;
    info.enhances = Helper.isNotEmpty(extend.enhances)
        ? extend.enhances : [];

    info.enhances.forEach((enhance) => {
        let enhanceLevel = enhance.level;
        let enhanceInfo = EnhanceDataset.getInfo(enhance.id);

        if (Helper.isEmpty(enhanceInfo.list[enhanceLevel - 1].reaction)) {
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

        if (Helper.isEmpty(skillLevelMapping[skillId])) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;

        if (Helper.isNotEmpty(extend.slotIds)
            && Helper.isNotEmpty(extend.slotIds[index])
        ) {
            jewelInfo = JewelDataset.getInfo(extend.slotIds[index]);
        }

        if (Helper.isEmpty(jewelInfo)) {
            info.slots[index].jewel = {};

            return false;
        }

        // Update Info
        info.slots[index].jewel = {
            id: jewelInfo.id,
            size: jewelInfo.size
        };

        jewelInfo.skills && jewelInfo.skills.forEach((data, index) => {
            let skillId = data.id;

            if (Helper.isEmpty(skillLevelMapping[skillId])) {
                skillLevelMapping[skillId] = 0;
            }

            skillLevelMapping[skillId] += data.level;
        });
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

    info.skills = info.skills.sort((skillA, skillB) => {
        return skillB.level - skillA.level;
    });

    return Helper.deepCopy(info);
};

let getAppliedArmorInfo = (extend) => {
    if ('object' !== typeof extend
        || 'string' !== typeof extend.id
    ) {
        return null;
    }

    let info = ArmorDataset.getInfo(extend.id);

    if (Helper.isEmpty(info)) {
        return null;
    }

    // Handler Skill & Slot
    let skillLevelMapping = {};

    info.skills && info.skills.forEach((data, index) => {
        let skillId = data.id;

        if (Helper.isEmpty(skillLevelMapping[skillId])) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;

        if (Helper.isNotEmpty(extend.slotIds)
            && Helper.isNotEmpty(extend.slotIds[index])
        ) {
            jewelInfo = JewelDataset.getInfo(extend.slotIds[index]);
        }

        if (Helper.isEmpty(jewelInfo)) {
            info.slots[index].jewel = {};

            return false;
        }

        // Update Info
        info.slots[index].jewel = {
            id: jewelInfo.id,
            size: jewelInfo.size
        };

        jewelInfo.skills && jewelInfo.skills.forEach((data, index) => {
            let skillId = data.id;

            if (Helper.isEmpty(skillLevelMapping[skillId])) {
                skillLevelMapping[skillId] = 0;
            }

            skillLevelMapping[skillId] += data.level;
        });
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

    info.skills = info.skills.sort((skillA, skillB) => {
        return skillB.level - skillA.level;
    });

    return Helper.deepCopy(info);
};

let getAppliedCharmInfo = (extend) => {
    if ('object' !== typeof extend
        || 'string' !== typeof extend.id
    ) {
        return null;
    }

    let info = CharmDataset.getInfo(extend.id);

    if (Helper.isEmpty(info)) {
        return null;
    }

    // Handler Skill & Slot
    let skillLevelMapping = {};

    info.skills && info.skills.forEach((data, index) => {
        let skillId = data.id;

        if (Helper.isEmpty(skillLevelMapping[skillId])) {
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

    info.skills = info.skills.sort((skillA, skillB) => {
        return skillB.level - skillA.level;
    });

    return Helper.deepCopy(info);
};

export default {
    getAppliedWeaponInfo: getAppliedWeaponInfo,
    getAppliedArmorInfo: getAppliedArmorInfo,
    getAppliedCharmInfo: getAppliedCharmInfo
};
