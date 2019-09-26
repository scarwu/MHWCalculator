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
    search = (requiredSets, requiredSkills, requiredEquips, algorithmParams) => {
        if (0 === requiredSets.length
            && 0 === requiredSkills.length
        ) {
            return [];
        }

        Helper.log('Input: Required Sets', requiredSets);
        Helper.log('Input: Required Skills', requiredSkills);
        Helper.log('Input: Required Equips', requiredEquips);
        Helper.log('Input: Algorithm Params', algorithmParams);

        this.algorithmParams = algorithmParams;
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

        // Create Info by Sets
        requiredSets.sort((setA, setB) => {
            let setInfoA = SetDataset.getInfo(setA.id);
            let setInfoB = SetDataset.getInfo(setB.id);

            if (Helper.isEmpty(setInfoA) || Helper.isEmpty(setInfoB)) {
                return 0;
            }

            return setInfoB.skills.pop().require - setInfoA.skills.pop().require;
        }).forEach((set) => {
            let setInfo = SetDataset.getInfo(set.id);

            if (Helper.isEmpty(setInfo)) {
                return;
            }

            this.conditionSets[set.id] = setInfo.skills[set.step - 1].require;
        });

        // Create Info by Skills
        requiredSkills.sort((skillA, skillB) => {
            return skillB.level - skillA.level;
        }).forEach((skill) => {
            if (0 === skill.level) {
                this.skipSkills[skill.id] = true;

                return;
            }

            this.conditionSkills[skill.id] = skill.level;

            let minJewelSize = 5;

            JewelDataset.hasSkill(skill.id).getItems().forEach((jewelInfo) => {
                if (minJewelSize > jewelInfo.size) {
                    minJewelSize = jewelInfo.size;
                }

                if (Helper.isEmpty(this.correspondJewels[skill.id])) {
                    this.correspondJewels[skill.id] = []
                }

                this.correspondJewels[skill.id].push({
                    id: jewelInfo.id,
                    size: jewelInfo.size,
                    skills: jewelInfo.skills.map((skill) => {
                        return {
                            id: skill.id,
                            level: skill.level
                        };
                    })
                });
            });

            // Increase Expected Value & Level
            this.conditionExpectedValue += skill.level * minJewelSize;
            this.conditionExpectedLevel += skill.level;
        });

        let defaultBundle = Helper.deepCopy(Constant.defaultBundle);

        // Create First Bundle
        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (Helper.isEmpty(requiredEquips[equipType])) {
                if ('weapon' !== equipType) {
                    this.conditionEquips.push(equipType);
                }

                return;
            }

            // Get Equip Info
            let equipInfo = null;

            if ('weapon' === equipType) {
                equipInfo = CommonDataset.getAppliedWeaponInfo(requiredEquips.weapon);
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType
            ) {
                equipInfo = CommonDataset.getAppliedArmorInfo(requiredEquips[equipType]);
            } else if ('charm' === equipType) {
                equipInfo = CommonDataset.getAppliedCharmInfo(requiredEquips.charm);
            }

            // Check Equip Info
            if (Helper.isEmpty(equipInfo)) {
                return;
            }

            // Convert Equip to Candidate Equip
            let candidateEquip = this.convertEquipInfoToCandidateEquip(equipInfo, equipType);

            // Add Candidate Equip to Bundle
            defaultBundle = this.addCandidateEquipToBundle(defaultBundle, candidateEquip);

            // Add Jewels info to Bundle
            if (Helper.isNotEmpty(equipInfo.slots)) {
                equipInfo.slots.forEach((slot) => {
                    if (Helper.isEmpty(slot.jewel.id)) {
                        return;
                    }

                    if (Helper.isEmpty(defaultBundle.jewels[slot.jewel.id])) {
                        defaultBundle.jewels[slot.jewel.id] = 0;
                    }

                    defaultBundle.jewels[slot.jewel.id] += 1;
                    defaultBundle.meta.remainingSlotCount[slot.size] -= 1;
                    defaultBundle.meta.remainingSlotCount.all -= 1;
                });
            }

            // Set Used Candidate Equip
            this.usedEquips[candidateEquip.id] = true;
        });

        // Reset Equip Count
        defaultBundle.meta.equipCount = 0;

        this.requireEquipCount = this.conditionEquips.length;
        this.requireSkillCount = Object.keys(this.conditionSkills).length;

        Helper.log('Init: Condition Skills:', this.conditionSkills);
        Helper.log('Init: Condition Sets:', this.conditionSets);
        Helper.log('Init: Condition Equips:', this.conditionEquips);
        Helper.log('Init: Correspond Jewels:', this.correspondJewels);
        Helper.log('Init: Condition Expected Value:', this.conditionExpectedValue);
        Helper.log('Init: Condition Expected Level:', this.conditionExpectedLevel);

        let bundlePool = {};

        // Init Prev Bundle Pool
        bundlePool[this.generateBundleHash(defaultBundle)] = defaultBundle;

        Helper.log('First: Bundle Pool:', bundlePool);

        // Create Bundle Pool with Set Equips
        if (0 !== Object.keys(this.conditionSets).length) {
            bundlePool = this.createBundlePoolWithSetEquips(bundlePool);

            // Sets Require Equips is Overflow
            if (0 === Object.keys(bundlePool).length) {
                return [];
            }
        }

        // Reset Completed Skills
        bundlePool = this.resetBundlePoolCompletedSkills(bundlePool);

        // Create Bundle Pool with Set Equips
        if (0 !== Object.keys(this.conditionSkills).length) {
            bundlePool = this.createBundlePoolWithSkillEquips(bundlePool);

            // Sets Require Equips is Overflow
            if (0 === Object.keys(bundlePool).length) {
                return [];
            }
        }

        // Create Sorted Bundle List & Limit Quantity
        return this.createSortedBundleList(bundlePool)
            .slice(0, this.algorithmParams.limit);
    };

    /**
     * Generate Bundle Hash
     */
    generateBundleHash = (bundle) => {
        let equips = {};
        let jewels = {};

        Object.keys(bundle.equips).forEach((equipType) => {
            if (Helper.isEmpty(bundle.equips[equipType])) {
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
     * Create Bundle Pool with Set Equips
     */
    createBundlePoolWithSetEquips = (prevBundlePool) => {
        let candidateEquipPool = {};
        let nextBundlePool = {};

        this.conditionEquips.forEach((equipType) => {
            if ('charm' === equipType) {
                return;
            }

            if (Helper.isEmpty(candidateEquipPool[equipType])) {
                candidateEquipPool[equipType] = {};
            }

            // Create Candidate Equips
            Object.keys(this.conditionSets).forEach((setId) => {
                let equipInfos = ArmorDataset.typeIs(equipType).setIs(setId).getItems();

                // Merge Candidate Equips
                candidateEquipPool[equipType] = Object.assign(
                    candidateEquipPool[equipType],
                    this.createCandidateEquips(equipInfos, equipType)
                );
            });

            // Append Empty Candidate Equip
            candidateEquipPool[equipType]['empty'] = this.getEmptyCandidateEquip(equipType);

            Helper.log('BundleList: With Sets: Equip', equipType, Object.keys(candidateEquipPool[equipType]).length, candidateEquipPool[equipType]);
        });

        this.conditionEquips.forEach((equipType) => {
            if ('charm' === equipType) {
                return;
            }

            nextBundlePool = {};

            Object.values(candidateEquipPool[equipType]).forEach((candidateEquip) => {
                Object.keys(prevBundlePool).forEach((hash) => {
                    let bundle = Helper.deepCopy(prevBundlePool[hash]);

                    // Check Equip Part is Used
                    if (Helper.isNotEmpty(bundle.equips[equipType])) {
                        nextBundlePool[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // Check Candidate Equip Id
                    if (Helper.isEmpty(candidateEquip.id)) {
                        nextBundlePool[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // Add Candidate Equip to Bundle
                    bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                    // Sets
                    let setRequire = this.conditionSets[candidateEquip.setId];

                    if (Helper.isEmpty(bundle.sets[candidateEquip.setId])) {
                        bundle.sets[candidateEquip.setId] = 0;
                    }

                    if (setRequire < bundle.sets[candidateEquip.setId]) {
                        bundle = Helper.deepCopy(prevBundlePool[hash]);
                        nextBundlePool[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    nextBundlePool[this.generateBundleHash(bundle)] = bundle;
                });
            });

            prevBundlePool = nextBundlePool;
        });

        Object.keys(this.conditionSets).forEach((setId) => {
            nextBundlePool = {};

            Object.keys(prevBundlePool).forEach((hash) => {
                let bundle = Helper.deepCopy(prevBundlePool[hash]);

                if (this.conditionSets[setId] !== bundle.sets[setId]) {
                    return;
                }

                nextBundlePool[this.generateBundleHash(bundle)] = bundle;
            });

            prevBundlePool = nextBundlePool;
        });

        Helper.log('BundleList: With Sets: Count', Object.keys(prevBundlePool).length);

        return prevBundlePool;
    };

    /**
     * Create Bundle Pool with Skill Equips
     */
    createBundlePoolWithSkillEquips = (prevBundlePool) => {
        let candidateEquipPool = {};
        let nextBundlePool = {};
        let lastBundlePool = {};

        this.conditionEquips.forEach((equipType) => {
            if (Helper.isEmpty(candidateEquipPool[equipType])) {
                candidateEquipPool[equipType] = {};
            }

            // Create Candidate Equips
            Object.keys(this.conditionSkills).forEach((skillId) => {
                let equipInfos = null;

                if ('helm' === equipType
                    || 'chest' === equipType
                    || 'arm' === equipType
                    || 'waist' === equipType
                    || 'leg' === equipType
                ) {
                    equipInfos = ArmorDataset.typeIs(equipType).hasSkill(skillId).getItems();
                } else if ('charm' === equipType) {
                    equipInfos = CharmDataset.hasSkill(skillId).getItems();
                }

                // Merge Candidate Equips
                candidateEquipPool[equipType] = Object.assign(
                    candidateEquipPool[equipType],
                    this.createCandidateEquips(equipInfos, equipType)
                );

                if ('charm' !== equipType) {
                    equipInfos = ArmorDataset.typeIs(equipType).rareIs(0).getItems();

                    // Merge Candidate Equips
                    candidateEquipPool[equipType] = Object.assign(
                        candidateEquipPool[equipType],
                        this.createCandidateEquips(equipInfos, equipType)
                    );
                }
            });

            // Append Empty Candidate Equip
            candidateEquipPool[equipType]['empty'] = this.getEmptyCandidateEquip(equipType);

            Helper.log('BundleList: With Skills: Equip', equipType, Object.keys(candidateEquipPool[equipType]).length, candidateEquipPool[equipType]);
        });

        // Get Maximum Equips EV & EL
        Object.keys(candidateEquipPool).forEach((equipType) => {
            if (Helper.isEmpty(this.maxEquipsExpectedValue[equipType])) {
                this.maxEquipsExpectedValue[equipType] = 0;
            }

            if (Helper.isEmpty(this.maxEquipsExpectedLevel[equipType])) {
                this.maxEquipsExpectedLevel[equipType] = 0;
            }

            Object.values(candidateEquipPool[equipType]).forEach((candidateEquip) => {
                if (this.maxEquipsExpectedValue[equipType] <= candidateEquip.expectedValue) {
                    this.maxEquipsExpectedValue[equipType] = candidateEquip.expectedValue;
                }

                if (this.maxEquipsExpectedLevel[equipType] <= candidateEquip.expectedLevel) {
                    this.maxEquipsExpectedLevel[equipType] = candidateEquip.expectedLevel;
                }
            });
        });

        Helper.log('Equips Expected Value:', this.maxEquipsExpectedValue);
        Helper.log('Equips Expected Level:', this.maxEquipsExpectedLevel);

        // Create Next BundleList
        Helper.log('Create Next BundleList');

        this.conditionEquips.forEach((equipType) => {
            Helper.log('Bundle Count:', equipType, Object.keys(prevBundlePool).length);

            this.usedEquipTypes[equipType] = true;

            nextBundlePool = {};

            Object.values(candidateEquipPool[equipType]).forEach((candidateEquip) => {
                Object.keys(prevBundlePool).forEach((hash) => {
                    let bundle = Helper.deepCopy(prevBundlePool[hash]);

                    // Check Equip Part is Used
                    if (Helper.isNotEmpty(bundle.equips[equipType])) {
                        nextBundlePool[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // Check Candidate Equip Id
                    if (Helper.isEmpty(candidateEquip.id)) {
                        nextBundlePool[this.generateBundleHash(bundle)] = bundle;

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

                        if (Helper.isEmpty(this.conditionSkills[skillId])) {
                            return;
                        }

                        let skillLevel = this.conditionSkills[skillId];

                        if (skillLevel < bundle.skills[skillId]) {
                            bundle = Helper.deepCopy(prevBundlePool[hash]);
                            nextBundlePool[this.generateBundleHash(bundle)] = bundle;

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

                    if (this.requireSkillCount === Object.keys(bundle.meta.completedSkills).length) {
                        lastBundlePool[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // If Equips Is Full Then Do Fully Check
                    if (this.requireEquipCount === bundle.meta.equipCount) {

                        // Create Completed Bundles By Skills
                        this.createCompletedBundlesBySkills(bundle).forEach((bundle) => {
                            if (this.requireSkillCount !== Object.keys(bundle.meta.completedSkills).length) {
                                return;
                            }

                            lastBundlePool[this.generateBundleHash(bundle)] = bundle;
                        });

                        return;
                    }

                    nextBundlePool[this.generateBundleHash(bundle)] = bundle;
                });
            });

            prevBundlePool = nextBundlePool;

            Helper.log('Result: Bundle Count (Pre):', Object.keys(lastBundlePool).length);
        });

        Helper.log('Bundle Pool:', Object.keys(prevBundlePool).length);

        // Find Completed Bundle into Last BundleList
        Helper.log('Find Completed Bundles');

        nextBundlePool = {};

        Object.keys(prevBundlePool).forEach((hash) => {
            let bundle = Helper.deepCopy(prevBundlePool[hash]);

            // Completed Bundles By Skills
            this.createCompletedBundlesBySkills(bundle).forEach((bundle) => {
                if (this.requireSkillCount !== Object.keys(bundle.meta.completedSkills).length) {
                    return;
                }

                lastBundlePool[this.generateBundleHash(bundle)] = bundle;
            });
        });

        Helper.log('Result: Bundle Count (Final):', Object.keys(lastBundlePool).length);

        return lastBundlePool;
    }

    /**
     * Reset Bundle Pool Compeleted Skills
     */
    resetBundlePoolCompletedSkills = (prevBundlePool) => {
        Helper.log('Bundle Pool: Reset Completed Skills');

        let nextBundlePool = {};

        Object.keys(prevBundlePool).forEach((hash) => {
            let bundle = Helper.deepCopy(prevBundlePool[hash]);

            bundle.meta.completedSkills = {};

            Object.keys(bundle.skills).forEach((skillId) => {
                if (Helper.isEmpty(this.conditionSkills[skillId])) {
                    return;
                }

                let skillLevel = this.conditionSkills[skillId];

                if (skillLevel === bundle.skills[skillId]) {
                    bundle.meta.completedSkills[skillId] = true;
                }
            });

            nextBundlePool[this.generateBundleHash(bundle)] = bundle;
        });

        return nextBundlePool;
    };

    /**
     * Create Sorted Bundle List
     */
    createSortedBundleList = (bundlePool) => {
        switch (this.algorithmParams.sort) {
        case 'complex':
            return Object.values(bundlePool).sort((bundleA, bundleB) => {
                let valueA = (8 - bundleA.meta.equipCount) * 1000 + bundleA.meta.defense;
                let valueB = (8 - bundleB.meta.equipCount) * 1000 + bundleB.meta.defense;

                return ('asc' === this.algorithmParams.order)
                    ? (valueA - valueB) : (valueB - valueA);
            }).map((bundle) => {
                bundle.sortedBy = {
                    key: this.algorithmParams.sort,
                    value: (8 - bundle.meta.equipCount) * 1000 + bundle.meta.defense
                };
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            });
        case 'defense':
            return Object.values(bundlePool).sort((bundleA, bundleB) => {
                let valueA = bundleA.meta.defense;
                let valueB = bundleB.meta.defense;

                return ('asc' === this.algorithmParams.order)
                    ? (valueA - valueB) : (valueB - valueA);
            }).map((bundle) => {
                bundle.sortedBy = {
                    key: this.algorithmParams.sort,
                    value: bundle.meta.defense
                };
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            });
        case 'fire':
        case 'water':
        case 'thunder':
        case 'ice':
        case 'dragon':
            return Object.values(bundlePool).sort((bundleA, bundleB) => {
                let valueA = bundleA.meta.resistance[this.algorithmParams.sort];
                let valueB = bundleB.meta.resistance[this.algorithmParams.sort];

                return ('asc' === this.algorithmParams.order)
                    ? (valueA - valueB) : (valueB - valueA);
            }).map((bundle) => {
                bundle.sortedBy = {
                    key: this.algorithmParams.sort,
                    value: bundle.meta.resistance[this.algorithmParams.sort]
                };
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            });
        case 'amount':
            return Object.values(bundlePool).sort((bundleA, bundleB) => {
                let valueA = bundleA.meta.equipCount;
                let valueB = bundleB.meta.equipCount;

                return ('asc' === this.algorithmParams.order)
                    ? (valueA - valueB) : (valueB - valueA);
            }).map((bundle) => {
                bundle.sortedBy = {
                    key: this.algorithmParams.sort,
                    value: bundle.meta.equipCount
                };
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            });
        case 'slot':
            return Object.values(bundlePool).sort((bundleA, bundleB) => {
                let valueA = bundleA.meta.remainingSlotCount.all;
                let valueB = bundleB.meta.remainingSlotCount.all;

                return ('asc' === this.algorithmParams.order)
                    ? (valueA - valueB) : (valueB - valueA);
            }).map((bundle) => {
                bundle.sortedBy = {
                    key: this.algorithmParams.sort,
                    value: bundle.meta.remainingSlotCount.all
                };
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            });
        case 'expectedValue':
            return Object.values(bundlePool).sort((bundleA, bundleB) => {
                let valueA = bundleA.meta.expectedValue;
                let valueB = bundleB.meta.expectedValue;

                return ('asc' === this.algorithmParams.order)
                    ? (valueA - valueB) : (valueB - valueA);
            }).map((bundle) => {
                bundle.sortedBy = {
                    key: this.algorithmParams.sort,
                    value: bundle.meta.expectedValue
                };
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            });
        case 'expectedLevel':
            return Object.values(bundlePool).sort((bundleA, bundleB) => {
                let valueA = bundleA.meta.expectedLevel;
                let valueB = bundleB.meta.expectedLevel;

                return ('asc' === this.algorithmParams.order)
                    ? (valueA - valueB) : (valueB - valueA);
            }).map((bundle) => {
                bundle.sortedBy = {
                    key: this.algorithmParams.sort,
                    value: bundle.meta.expectedLevel
                };
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            });
        default:
            return Object.map((bundle) => {
                bundle.hash = this.generateBundleHash(bundle);

                return bundle;
            }).values(bundlePool);
        }
    };

    /**
     * Add Candidate Equip To Bundle
     */
    addCandidateEquipToBundle = (bundle, candidateEquip) => {
        if (Helper.isEmpty(candidateEquip.id)) {
            return bundle;
        }

        if (Helper.isNotEmpty(bundle.equips[candidateEquip.type])) {
            return bundle;
        }

        bundle.equips[candidateEquip.type] = candidateEquip.id;
        bundle.meta.defense += candidateEquip.defense;
        bundle.meta.resistance.fire += candidateEquip.resistance.fire;
        bundle.meta.resistance.water += candidateEquip.resistance.water;
        bundle.meta.resistance.thunder += candidateEquip.resistance.thunder;
        bundle.meta.resistance.ice += candidateEquip.resistance.ice;
        bundle.meta.resistance.dragon += candidateEquip.resistance.dragon;

        if (Helper.isNotEmpty(candidateEquip.setId)) {
            if (Helper.isEmpty(bundle.sets[candidateEquip.setId])) {
                bundle.sets[candidateEquip.setId] = 0;
            }

            bundle.sets[candidateEquip.setId] += 1;
        }

        Object.keys(candidateEquip.skills).forEach((skillId) => {
            let skillLevel = candidateEquip.skills[skillId];

            if (Helper.isEmpty(bundle.skills[skillId])) {
                bundle.skills[skillId] = 0;
            }

            bundle.skills[skillId] += skillLevel;
        });

        for (let size = 1; size <= 4; size++) {
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
     * Create Candidate Equips
     */
    createCandidateEquips = (equipInfos, equipType) => {
        let candidateEquipPool = {};

        equipInfos.forEach((equipInfo) => {

            // Check is Armor Factor
            if (false === this.algorithmParams.armorFactor[equipInfo.rare]) {
                return;
            }

            let candidateEquip = this.convertEquipInfoToCandidateEquip(equipInfo, equipType);

            // Check is Skip Equips
            if (true === this.isCandidateEquipSkip(candidateEquip)) {
                return;
            }

            // Check Used Equips
            if (true === this.usedEquips[candidateEquip.id]) {
                return;
            }

            // Set Used Candidate Equip Id
            this.usedEquips[candidateEquip.id] = true;

            // Set Candidate Equip
            candidateEquipPool[candidateEquip.id] = candidateEquip;
        });

        return candidateEquipPool;
    };

    /**
     * Convert Equip Info To Candidate Equip
     */
    convertEquipInfoToCandidateEquip = (equipInfo, equipType) => {
        let candidateEquip = Helper.deepCopy(Constant.defaultCandidateEquip);

        // Set Id, Type & Defense
        candidateEquip.id = equipInfo.id;
        candidateEquip.type = ('charm' !== equipType) ? equipInfo.type : equipType;
        candidateEquip.defense = Helper.isNotEmpty(equipInfo.defense) ? equipInfo.defense : 0;
        candidateEquip.resistance = Helper.isNotEmpty(equipInfo.resistance) ? equipInfo.resistance : 0;
        candidateEquip.setId = Helper.isNotEmpty(equipInfo.set) ? equipInfo.set.id : null;

        if (Helper.isEmpty(equipInfo.skills)) {
            equipInfo.skills = [];
        }

        if (Helper.isEmpty(equipInfo.slots)) {
            equipInfo.slots = [];
        }

        equipInfo.skills.forEach((skill) => {
            candidateEquip.skills[skill.id] = skill.level;

            // Increase Expected Value & Level
            if (Helper.isNotEmpty(this.correspondJewels[skill.id])) {
                let minJewelSize = 5;

                this.correspondJewels[skill.id].forEach((jewel) => {
                    if (minJewelSize > jewel.size) {
                        minJewelSize = jewel.size;
                    }
                });

                candidateEquip.expectedValue += skill.level * minJewelSize;
                candidateEquip.expectedLevel += skill.level;
            }
        });

        equipInfo.slots.forEach((slot) => {
            candidateEquip.ownSlotCount[slot.size] += 1;

            // Increase Expected Value & Level
            candidateEquip.expectedValue += slot.size;
            candidateEquip.expectedLevel += 1;
        });

        return candidateEquip;
    };

    /**
     * Get Empty Candidate Equip
     */
    getEmptyCandidateEquip = (equipType) => {
        let candidateEquip = Helper.deepCopy(Constant.defaultCandidateEquip);

        candidateEquip.type = equipType;

        return candidateEquip;
    };

    /**
     * Create Completed Bundles By Skills
     */
    createCompletedBundlesBySkills = (bundle) => {
        let prevBundlePool = {};
        let nextBundlePool = {};

        prevBundlePool[this.generateBundleHash(bundle)] = bundle;

        Object.keys(this.conditionSkills).forEach((skillId) => {
            if (Helper.isEmpty(this.correspondJewels[skillId])) {
                return;
            }

            nextBundlePool = {};

            Object.keys(prevBundlePool).forEach((hash) => {
                this.correspondJewels[skillId].forEach((jewel) => {
                    let bundle = Helper.deepCopy(prevBundlePool[hash]);

                    if (Helper.isEmpty(bundle.skills[skillId])) {
                        bundle.skills[skillId] = 0;
                    }

                    if (this.conditionSkills[skillId] < bundle.skills[skillId]) {
                        return false;
                    }

                    // Add Jewel to Bundle
                    if (this.conditionSkills[skillId] > bundle.skills[skillId]) {
                        bundle = this.addJewelToBundleBySpecificSkill(bundle, jewel, {
                            id: skillId,
                            level: this.conditionSkills[skillId]
                        });

                        if (false === bundle) {
                            return;
                        }
                    }

                    nextBundlePool[this.generateBundleHash(bundle)] = bundle;
                });
            })

            prevBundlePool = nextBundlePool;
        });

        return Object.values(prevBundlePool);
    };

    /**
     * Add Jewel To Bundle By Specific Skill
     */
    addJewelToBundleBySpecificSkill = (bundle, jewel) => {
        let currentSlotSize = jewel.size;
        let isComplete = false;
        let isOverflow = false;
        let bundleBackup = null;

        if (0 === bundle.meta.remainingSlotCount.all) {
            return bundle;
        }

        // 已透過技能選出了裝飾珠 再用裝飾珠有的技能 id & level 來 completed skill
        // 加入裝飾珠 同時計算洞數以及技能等級
        while (true) {
            if (0 === bundle.meta.remainingSlotCount[currentSlotSize]) {
                currentSlotSize += 1;
            }

            if (4 < currentSlotSize) {
                break;
            }

            // Reset Flags
            isComplete = false;
            isOverflow = false;

            // Decrease Slot Counts
            bundle.meta.remainingSlotCount[currentSlotSize]--;
            bundle.meta.remainingSlotCount.all--;

            // Check Skill is Completed
            jewel.skills.forEach((skill) => {
                if (Helper.isEmpty(this.conditionSkills[skill.id])){
                    return;
                }

                if (Helper.isEmpty(bundle.skills[skill.id])) {
                    bundle.skills[skill.id] = 0;
                }

                if (this.conditionSkills[skill.id] === bundle.skills[skill.id]) {
                    bundle.meta.completedSkills[skill.id] = true;
                    isComplete = true;
                }
            });

            if (true === isComplete) {
                return bundle;
            }

            // Bundle Backup
            bundleBackup = Helper.deepCopy(bundle);

            // Add Jewel
            if (Helper.isEmpty(bundle.jewels[jewel.id])) {
                bundle.jewels[jewel.id] = 0;
            }

            bundle.jewels[jewel.id]++;

            // Add Skills
            jewel.skills.forEach((skill) => {
                if (Helper.isEmpty(bundle.skills[skill.id])) {
                    bundle.skills[skill.id] = 0;
                }

                bundle.skills[skill.id] += skill.level;

                // Check Skill is Completed
                if (Helper.isNotEmpty(this.conditionSkills[skill.id])) {
                    if (this.conditionSkills[skill.id] < bundle.skills[skill.id]) {
                        isOverflow = true;
                    }

                    if (this.conditionSkills[skill.id] === bundle.skills[skill.id]) {
                        bundle.meta.completedSkills[skill.id] = true;
                        isComplete = true;
                    }
                }
            });

            if (true === isOverflow) {
                return bundleBackup;
            }

            if (true === isComplete) {
                return bundle;
            }

            if (0 === bundle.meta.remainingSlotCount.all) {
                break;
            }
        }

        return bundle;
    };

    /**
     * Is Skip Candidate Equip
     */
    isCandidateEquipSkip = (candidateEquip) => {
        let isSkip = false;

        Object.keys(candidateEquip.skills).forEach((skillId) => {
            if (true === isSkip) {
                return;
            }

            if (Helper.isNotEmpty(this.skipSkills[skillId])
                && true === this.skipSkills[skillId]
            ) {
                isSkip = true;
            }
        });

        return isSkip;
    };

    /**
     * Is Bundle Have Future
     *
     * This is magic function, which is see through the future
     */
    isBundleHaveFuture = (bundle) => {
        let currentExpectedValue = bundle.meta.expectedValue;
        let currentExpectedLevel = bundle.meta.expectedLevel;

        if (currentExpectedValue >= this.conditionExpectedValue
            && currentExpectedLevel >= this.conditionExpectedLevel
        ) {
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

            currentExpectedValue += this.maxEquipsExpectedValue[equipType];
            currentExpectedLevel += this.maxEquipsExpectedLevel[equipType];

            if (currentExpectedValue >= this.conditionExpectedValue
                && currentExpectedLevel >= this.conditionExpectedLevel
            ) {
                haveFuture = true;
            }
        });

        return haveFuture;
    };
}

export default new FittingAlgorithm();
