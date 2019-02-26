'use strict';
/**
 * Fitting Algorithm
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import MD5 from 'md5';

// Load Core
import Helper from 'core/helper';

// Load Custom Libraries
import ArmorDataset from 'libraries/dataset/armor';
import SetDataset from 'libraries/dataset/set';
import JewelDataset from 'libraries/dataset/jewel';
import CharmDataset from 'libraries/dataset/charm';
import CommonDataset from 'libraries/dataset/common';

// Load Constant
import Constant from 'constant';

class FittingAlgorithm {

    /**
     * Search
     */
    search = (equips, ignoreEquips, sets, skills) => {

        if (0 === sets.length
            && 0 === skills.length) {

            return [];
        }

        this.ignoreEquips = ignoreEquips;
        this.conditionEquips = [];
        this.conditionSets = {};
        this.conditionSkills = {};
        this.correspondJewels = {};
        this.skipSkills = {};
        this.usedEquips = {};
        this.usedEquipTypes = {};
        this.conditionExpectedValue = 0;
        this.conditionExpectedLevel = 0;
        this.maxEquipsExpectedValue = {};
        this.maxEquipsExpectedLevel = {};

        let candidateEquips = {};
        let lastBundleLimit = 200;
        let prevBundleList = {};
        let nextBundleList = {};
        let lastBundleList = {};
        let bundle = Helper.deepCopy(Constant.defaultBundle);

        // Create Info by Sets
        sets.sort((setA, setB) => {
            let setInfoA = SetDataset.getInfo(setA.id);
            let setInfoB = SetDataset.getInfo(setB.id);

            return setInfoB.skills.pop().require - setInfoA.skills.pop().require;
        }).forEach((set) => {
            let setInfo = SetDataset.getInfo(set.id);

            this.conditionSets[set.id] = setInfo.skills[set.step - 1].require;
        });

        // Create Info by Skills
        skills.sort((skillA, skillB) => {
            return skillB.level - skillA.level;
        }).forEach((skill) => {
            if (0 === skill.level) {
                this.skipSkills[skill.id] = true;

                return;
            }

            this.conditionSkills[skill.id] = skill.level;

            let jewelInfo = JewelDataset.hasSkill(skill.id).getItems();
            let jewel = (0 !== jewelInfo.length) ? jewelInfo[0] : null;

            this.correspondJewels[skill.id] = (null !== jewel) ? {
                id: jewel.id,
                size: jewel.size,
            } : null;

            // Increase Expected Value & Level
            if (null !== jewel) {
                this.conditionExpectedValue += skill.level * jewel.size; // 1, 2, 3
            } else {
                this.conditionExpectedValue += skill.level * 4;
            }

            this.conditionExpectedLevel += skill.level;
        });

        // Create First Bundle
        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (undefined === equips[equipType]) {
                if ('weapon' !== equipType) {
                    this.conditionEquips.push(equipType);
                }

                return;
            }

            // Get Equip Info
            let equipInfo = null;

            if ('weapon' === equipType) {
                equipInfo = CommonDataset.getAppliedWeaponInfo(equips.weapon);
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = CommonDataset.getAppliedArmorInfo(equips[equipType]);
            } else if ('charm' === equipType) {
                equipInfo = CommonDataset.getAppliedCharmInfo(equips.charm);
            }

            // Check Equip Info
            if (null === equipInfo) {
                return;
            }

            // Rewrite Equip Info Type
            equipInfo.type = equipType;

            // Convert Equip to Candidate Equip
            let candidateEquip = this.convertEquipToCandidateEquip(equipInfo);

            // Add Candidate Equip to Bundle
            bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

            // Add Jewels info to Bundle
            if (undefined !== equipInfo.slots) {
                equipInfo.slots.forEach((slot) => {
                    if (null === slot.jewel.id) {
                        return;
                    }

                    if (undefined === bundle.jewels[slot.jewel.id]) {
                        bundle.jewels[slot.jewel.id] = 0;
                    }

                    bundle.jewels[slot.jewel.id] += 1;
                    bundle.meta.remainingSlotCount[slot.size] -= 1;
                    bundle.meta.remainingSlotCount.all -= 1;
                });
            }

            // Set Used Candidate Equip
            this.usedEquips[candidateEquip.id] = true;
        });

        // Reset Equip Count
        bundle.meta.equipCount = 0;

        prevBundleList[this.generateBundleHash(bundle)] = bundle;

        let requireEquipCount = this.conditionEquips.length;
        let requireSkillCount = Object.keys(this.conditionSkills).length;

        Helper.log('Ignore Equips', this.ignoreEquips);
        Helper.log('Condition Skills:', this.conditionSkills);
        Helper.log('Condition Equips:', this.conditionEquips);
        Helper.log('Correspond Jewels:', this.correspondJewels);
        Helper.log('Condition Expected Value:', this.conditionExpectedValue);
        Helper.log('Condition Expected Level:', this.conditionExpectedLevel);
        Helper.log('Init - Bundle List:', prevBundleList);

        if (0 !== Object.keys(this.conditionSets).length) {

            // Create Candidate Equips with Set Equips
            Helper.log('Create Candidate Equips with Set Equips');

            candidateEquips = {};

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                if (undefined === candidateEquips[equipType]) {
                    candidateEquips[equipType] = {};
                }

                // Create Candidate Equips
                Object.keys(this.conditionSets).forEach((setId) => {
                    let equips = ArmorDataset.typeIs(equipType).setIs(setId).getItems();

                    // Get Candidate Equips
                    candidateEquips[equipType] = this.createCandidateEquips(equips, equipType, candidateEquips[equipType]);
                });

                // Append Empty Candidate Equip
                let candidateEquip = Helper.deepCopy(Constant.defaultCandidateEquip);
                candidateEquip.type = equipType;

                candidateEquips[equipType]['empty'] = candidateEquip;
            });

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                Helper.log('Equip Count:', equipType, Object.keys(candidateEquips[equipType]).length, candidateEquips[equipType]);
            });

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                Helper.log('Bundle Count:', equipType, Object.keys(prevBundleList).length);

                nextBundleList = {};

                Object.values(candidateEquips[equipType]).forEach((candidateEquip) => {
                    Object.keys(prevBundleList).forEach((hash) => {
                        let bundle = Helper.deepCopy(prevBundleList[hash]);

                        if (undefined === bundle.equips[equipType]) {
                            bundle.equips[equipType] = null;
                        }

                        // Check Equip Part is Used
                        if (null !== bundle.equips[equipType]) {
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            return;
                        }

                        // Check Candidate Equip Id
                        if (null === candidateEquip.id) {
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            return;
                        }

                        // Add Candidate Equip to Bundle
                        bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                        // Sets
                        let setRequire = this.conditionSets[candidateEquip.setId];

                        if (undefined === bundle.sets[candidateEquip.setId]) {
                            bundle.sets[candidateEquip.setId] = 0;
                        }

                        if (setRequire < bundle.sets[candidateEquip.setId]) {
                            bundle = Helper.deepCopy(prevBundleList[hash]);
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            return;
                        }

                        nextBundleList[this.generateBundleHash(bundle)] = bundle;
                    });
                });

                prevBundleList = nextBundleList;
            });

            Object.keys(this.conditionSets).forEach((setId) => {
                nextBundleList = {};

                let setRequire = this.conditionSets[setId];

                Object.keys(prevBundleList).forEach((hash) => {
                    let bundle = Helper.deepCopy(prevBundleList[hash]);

                    if (setRequire !== bundle.sets[setId]) {
                        return;
                    }

                    nextBundleList[this.generateBundleHash(bundle)] = bundle;
                });

                prevBundleList = nextBundleList;
            });

            Helper.log('Bundle Count:', Object.keys(prevBundleList).length);

            // Sets Require Equips is Overflow
            if (0 === Object.keys(prevBundleList).length) {
                return [];
            }
        }

        // Completed Skills
        Helper.log('Reset Completed Skills');

        nextBundleList = {};

        Object.keys(prevBundleList).forEach((hash) => {
            let bundle = Helper.deepCopy(prevBundleList[hash]);

            bundle.meta.completedSkills = {};

            Object.keys(bundle.skills).forEach((skillId) => {
                if (undefined === this.conditionSkills[skillId]) {
                    return;
                }

                let skillLevel = this.conditionSkills[skillId];

                if (skillLevel === bundle.skills[skillId]) {
                    bundle.meta.completedSkills[skillId] = true;
                }
            });

            nextBundleList[this.generateBundleHash(bundle)] = bundle;
        });

        prevBundleList = nextBundleList;

        // Create Candidate Equips with Skill & Slot Equips
        Helper.log('Create Candidate Equips with Skill & Slot Equips');

        candidateEquips = {};

        this.conditionEquips.forEach((equipType) => {
            if (undefined === candidateEquips[equipType]) {
                candidateEquips[equipType] = {};
            }

            // Create Candidate Equips
            Object.keys(this.conditionSkills).forEach((skillId) => {
                let equips = null;

                // Get Equips With Skill
                if ('helm' === equipType
                    || 'chest' === equipType
                    || 'arm' === equipType
                    || 'waist' === equipType
                    || 'leg' === equipType) {

                    equips = ArmorDataset.typeIs(equipType).hasSkill(skillId).getItems();
                } else if ('charm' === equipType) {
                    equips = CharmDataset.hasSkill(skillId).getItems();
                }

                // Get Candidate Equips
                candidateEquips[equipType] = this.createCandidateEquips(equips, equipType, candidateEquips[equipType]);

                if ('charm' !== equipType) {

                    // Get Equips With Slot
                    equips = ArmorDataset.typeIs(equipType).rareIs(0).getItems();

                    // Get Candidate Equips
                    candidateEquips[equipType] = this.createCandidateEquips(equips, equipType, candidateEquips[equipType]);
                }
            });

            // Append Empty Candidate Equip
            let candidateEquip = Helper.deepCopy(Constant.defaultCandidateEquip);
            candidateEquip.type = equipType;

            candidateEquips[equipType]['empty'] = candidateEquip;
        });

        Object.keys(candidateEquips).forEach((equipType) => {
            if (undefined === this.maxEquipsExpectedValue[equipType]) {
                this.maxEquipsExpectedValue[equipType] = 0;
            }

            if (undefined === this.maxEquipsExpectedLevel[equipType]) {
                this.maxEquipsExpectedLevel[equipType] = 0;
            }

            Object.values(candidateEquips[equipType]).forEach((candidateEquip) => {
                if (this.maxEquipsExpectedValue[equipType] <= candidateEquip.expectedValue) {
                    this.maxEquipsExpectedValue[equipType] = candidateEquip.expectedValue;
                }

                if (this.maxEquipsExpectedLevel[equipType] <= candidateEquip.expectedLevel) {
                    this.maxEquipsExpectedLevel[equipType] = candidateEquip.expectedLevel;
                }
            });
        });

        this.conditionEquips.forEach((equipType) => {
            Helper.log('Equip Count:', equipType, Object.keys(candidateEquips[equipType]).length, candidateEquips[equipType]);
        });

        Helper.log('Equips Expected Value:', this.maxEquipsExpectedValue);
        Helper.log('Equips Expected Level:', this.maxEquipsExpectedLevel);

        // Create Next BundleList
        Helper.log('Create Next BundleList');

        this.conditionEquips.forEach((equipType) => {
            Helper.log('Bundle Count:', equipType, Object.keys(prevBundleList).length);

            this.usedEquipTypes[equipType] = true;

            nextBundleList = {};

            Object.values(candidateEquips[equipType]).forEach((candidateEquip) => {
                Object.keys(prevBundleList).forEach((hash) => {
                    let bundle = Helper.deepCopy(prevBundleList[hash]);

                    if (undefined === bundle.equips[equipType]) {
                        bundle.equips[equipType] = null;
                    }

                    // Check Equip Part is Used
                    if (null !== bundle.equips[equipType]) {
                        nextBundleList[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // Check Candidate Equip Id
                    if (null === candidateEquip.id) {
                        nextBundleList[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // Add Candidate Equip to Bundle
                    bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                    // Check Bundle Have a Future
                    if (false === this.isBundleHaveFuture(bundle)) {
                        return;
                    }

                    // Count & Check Skills from Candidate Equip
                    let isSkip = false;

                    Object.keys(candidateEquip.skills).forEach((skillId) => {
                        if (true === isSkip) {
                            return;
                        }

                        if (undefined == this.conditionSkills[skillId]) {
                            return;
                        }

                        let skillLevel = this.conditionSkills[skillId];

                        if (skillLevel < bundle.skills[skillId]) {
                            bundle = Helper.deepCopy(prevBundleList[hash]);
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            isSkip = true;

                            return;
                        }

                        if (skillLevel === bundle.skills[skillId]) {
                            bundle.meta.completedSkills[skillId] = true;
                        }
                    });

                    if (true === isSkip) {
                        return;
                    }

                    if (requireSkillCount === Object.keys(bundle.meta.completedSkills).length) {
                        lastBundleList[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // If Equips Is Full Then Do Fully Check
                    if (requireEquipCount === bundle.meta.equipCount) {

                        // Completed Bundle By Skills
                        bundle = this.completeBundleBySkills(bundle);

                        if (false === bundle) {
                            return;
                        }

                        if (requireSkillCount === Object.keys(bundle.meta.completedSkills).length) {
                            lastBundleList[this.generateBundleHash(bundle)] = bundle;
                        }

                        return;
                    }

                    nextBundleList[this.generateBundleHash(bundle)] = bundle;
                });
            });

            prevBundleList = nextBundleList;

            Helper.log('Result - Bundle Count (Pre):', Object.keys(lastBundleList).length);
        });

        // Find Completed Bundle into Last BundleList
        Helper.log('Find Completed Bundles');

        Helper.log('Bundle List:', Object.keys(prevBundleList).length);

        nextBundleList = {};

        Object.keys(prevBundleList).forEach((hash) => {
            let bundle = Helper.deepCopy(prevBundleList[hash]);

            // Completed Bundle By Skills
            bundle = this.completeBundleBySkills(bundle);

            if (false === bundle) {
                return;
            }

            if (requireSkillCount === Object.keys(bundle.meta.completedSkills).length) {
                lastBundleList[this.generateBundleHash(bundle)] = bundle;
            }
        });

        Helper.log('Result - Bundle Count (Final):', Object.keys(lastBundleList).length);

        lastBundleList = Object.values(lastBundleList).sort((bundleA, bundleB) => {
            let valueA = (8 - bundleA.meta.equipCount) * 1000 + bundleA.defense;
            let valueB = (8 - bundleB.meta.equipCount) * 1000 + bundleB.defense;

            return valueB - valueA;
        }).slice(0, lastBundleLimit);

        return lastBundleList;
    };

    /**
     * Generate Bundle Hash
     */
    generateBundleHash = (bundle) => {
        let equips = {};
        let jewels = {};

        Object.keys(bundle.equips).forEach((equipType) => {
            if (null === bundle.equips[equipType]) {
                return;
            }

            equips[equipType] = bundle.equips[equipType];
        });

        Object.keys(bundle.jewels).sort().forEach((jewelId) => {
            if (0 === bundle.jewels[jewelId]) {
                return;
            }

            jewels[jewelId] = bundle.jewels[jewelId];
        });

        return MD5(JSON.stringify([equips, jewels]));
    };

    /**
     * Create Candidate Equips
     */
    createCandidateEquips = (equips, equipType, candidateEquips = {}) => {
        equips.forEach((equip) => {

            // Check Equip is in Ignore Equips
            if (undefined !== this.ignoreEquips[equipType]
                && true === this.ignoreEquips[equipType][equip.id]) {

                return;
            }

            let candidateEquip = this.convertEquipToCandidateEquip(equip);
            candidateEquip.type = equipType;

            // Check is Skip Equips
            if (true === this.isSkipCandidateEquip(candidateEquip)) {
                return;
            }

            // Check Used Equips
            if (true === this.usedEquips[candidateEquip.id]) {
                return;
            }

            // Set Used Candidate Equip Id
            this.usedEquips[candidateEquip.id] = true;

            // Set Candidate Equip
            candidateEquips[candidateEquip.id] = candidateEquip;
        });

        return candidateEquips;
    };

    /**
     * Convert Equip To Candidate Equip
     */
    convertEquipToCandidateEquip = (equip) => {
        let candidateEquip = Helper.deepCopy(Constant.defaultCandidateEquip);

        // Set Id, Type & Defense
        candidateEquip.id = equip.id;
        candidateEquip.type = equip.type;
        candidateEquip.defense = (undefined !== equip.defense) ? equip.defense : 0;

        if (undefined !== equip.set && null !== equip.set) {
            candidateEquip.setId = equip.set.id;
        }

        if (undefined === equip.skills) {
            equip.skills = [];
        }

        if (undefined === equip.slots) {
            equip.slots = [];
        }

        equip.skills.forEach((skill) => {
            candidateEquip.skills[skill.id] = skill.level;

            // Increase Expected Value & Level
            if (undefined !== this.correspondJewels[skill.id]) {
                let jewel = this.correspondJewels[skill.id];

                if (null !== jewel) {
                    candidateEquip.expectedValue += skill.level * jewel.size; // 1, 2, 3
                } else {
                    candidateEquip.expectedValue += skill.level * 4;
                }

                candidateEquip.expectedLevel += skill.level;
            }
        });

        equip.slots.forEach((slot) => {
            candidateEquip.ownSlotCount[slot.size] += 1;

            // Increase Expected Value & Level
            candidateEquip.expectedValue += slot.size;
            candidateEquip.expectedLevel += 1;
        });

        return candidateEquip;
    };

    isSkipCandidateEquip = (candidateEquip) => {

        let isSkip = false;

        Object.keys(candidateEquip.skills).forEach((skillId) => {
            if (true === isSkip) {
                return;
            }

            if (undefined !== this.skipSkills[skillId]
                && true === this.skipSkills[skillId]) {

                isSkip = true;
            }
        });

        return isSkip;
    };

    /**
     * Is Bundle Have Future
     *
     * Thisi is magic function, which is see through the future
     */
    isBundleHaveFuture = (bundle) => {
        let currentExpectedValue = bundle.meta.expectedValue;
        let currentExpectedLevel = bundle.meta.expectedLevel;

        if (currentExpectedValue >= this.conditionExpectedValue
            && currentExpectedLevel >= this.conditionExpectedLevel) {

            return true;
        }

        let haveFuture = false;

        this.conditionEquips.forEach((equipType) => {
            if (true === haveFuture) {
                return;
            }

            if (true === this.usedEquipTypes[equipType]) {
                return;
            }

            if (undefined === bundle.equips[equipType]
                || null !== bundle.equips[equipType]) {

                return;
            }

            currentExpectedValue += this.maxEquipsExpectedValue[equipType];
            currentExpectedLevel += this.maxEquipsExpectedLevel[equipType];

            if (currentExpectedValue >= this.conditionExpectedValue
                && currentExpectedLevel >= this.conditionExpectedLevel) {

                haveFuture = true;
            }
        });

        return haveFuture;
    };

    /**
     * Add Candidate Equip To Bundle
     */
    addCandidateEquipToBundle = (bundle, candidateEquip) => {
        if (null === candidateEquip.id) {
            return bundle;
        }

        if (undefined !== bundle.equips[candidateEquip.type]
            && null !== bundle.equips[candidateEquip.type]) {

            return bundle;
        }

        bundle.equips[candidateEquip.type] = candidateEquip.id;
        bundle.defense += candidateEquip.defense;

        if (null !== candidateEquip.setId) {
            if (undefined === bundle.sets[candidateEquip.setId]) {
                bundle.sets[candidateEquip.setId] = 0;
            }

            bundle.sets[candidateEquip.setId] += 1;
        }

        Object.keys(candidateEquip.skills).forEach((skillId) => {
            let skillLevel = candidateEquip.skills[skillId];

            if (undefined === bundle.skills[skillId]) {
                bundle.skills[skillId] = 0;
            }

            bundle.skills[skillId] += skillLevel;
        });

        for (let size = 1; size <= 3; size++) {
            bundle.meta.remainingSlotCount[size] += candidateEquip.ownSlotCount[size];
            bundle.meta.remainingSlotCount.all += candidateEquip.ownSlotCount[size];
        }

        // Increase Equip Count
        bundle.meta.equipCount += 1;

        // Increase Expected Value & Level
        bundle.meta.expectedValue += candidateEquip.expectedValue;
        bundle.meta.expectedLevel += candidateEquip.expectedLevel;

        return bundle;
    };

    /**
     * Complete Bundle By Skills
     */
    completeBundleBySkills = (bundle) => {
        let isSkip = false;

        Object.keys(this.conditionSkills).forEach((skillId) => {
            if (true === isSkip) {
                return;
            }

            let skillLevel = this.conditionSkills[skillId];

            if (undefined === bundle.skills[skillId]) {
                bundle.skills[skillId] = 0
            }

            // Add Jewel to Bundle
            bundle = this.addJewelToBundleBySpecificSkill(bundle, {
                id: skillId,
                level: skillLevel
            }, this.correspondJewels[skillId]);

            if (false === bundle) {
                isSkip = true;

                return;
            }

            if (skillLevel === bundle.skills[skillId]) {
                bundle.meta.completedSkills[skillId] = true;
            }
        });

        if (true === isSkip) {
            return false;
        }

        return bundle;
    };

    /**
     * Add Jewel To Bundle By Specific Skill
     */
    addJewelToBundleBySpecificSkill = (bundle, skill, jewel) => {
        let diffSkillLevel = skill.level - bundle.skills[skill.id];

        if (0 === diffSkillLevel) {
            return bundle;
        }

        // Failed - No Jewel
        if (null === jewel && 0 !== diffSkillLevel) {
            return false;
        }

        let currentSlotSize = jewel.size;
        let usedSlotCount = {
            1: 0,
            2: 0,
            3: 0
        };

        while (true) {
            if (0 !== bundle.meta.remainingSlotCount[currentSlotSize]) {
                if (diffSkillLevel > bundle.meta.remainingSlotCount[currentSlotSize]) {
                    usedSlotCount[currentSlotSize] = bundle.meta.remainingSlotCount[currentSlotSize];
                    diffSkillLevel -= bundle.meta.remainingSlotCount[currentSlotSize];
                } else {
                    usedSlotCount[currentSlotSize] = diffSkillLevel;
                    diffSkillLevel = 0;
                }
            }

            currentSlotSize += 1;

            if (0 === diffSkillLevel) {
                break;
            }

            // Failed - No Slots
            if (3 < currentSlotSize) {
                return false;
            }
        }

        if (undefined === bundle.skills[skill.id]) {
            bundle.skills[skill.id] = 0;
        }

        if (undefined === bundle.jewels[jewel.id]) {
            bundle.jewels[jewel.id] = 0;
        }

        diffSkillLevel = skill.level - bundle.skills[skill.id];

        bundle.skills[skill.id] += diffSkillLevel;
        bundle.jewels[jewel.id] += diffSkillLevel;

        Object.keys(usedSlotCount).forEach((slotSize) => {
            bundle.meta.remainingSlotCount[slotSize] -= usedSlotCount[slotSize];
            bundle.meta.remainingSlotCount.all -= usedSlotCount[slotSize];
        });

        return bundle;
    };
}

export default new FittingAlgorithm();
