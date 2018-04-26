'use strict';
/**
 * Candidate Bundles
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Component } from 'react';
import MD5 from 'md5';

// Load Core Libraries
import Event from 'core/event';

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class CandidateBundles extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickup: (data) => {}
    };

    // Initial State
    state = {
        data: null,
        bundleList: []
    };

    /**
     * Handle Functions
     */
    handleBundlePickup = (index) => {
        this.props.onPickup(bundleList[index]);
    };

    bundleSearch = () => {
        let data = this.state.data;

        if (null === data) {
            return false;
        }

        let skills = data.skills;
        let equips = data.equips;
        let equipsLock = data.equipsLock;

        // Create 1st BundleList & Extra Info
        let requireEquips = [];
        let requireSkills = {};
        let pervBundleList = {};
        let bundle = Misc.deepCopy(Constant.defaultBundle);

        skills.sort((a, b) => {
            return b.level - a.level;
        }).forEach((skill) => {
            requireSkills[skill.name] = skill.level;
        });

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (false === equipsLock[equipType]) {
                if ('weapon' !== equipType) {
                    requireEquips.push(equipType);
                }

                return false;
            }

            let equipInfo = null;
            let candidateEquip = null;

            if ('weapon' === equipType) {

                // Get Equipment Info
                equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);

                // Convert Equip to Candidate Equip
                candidateEquip = this.convertEquipToCandidateEquip(equipInfo);

                // Add Candidate Equip to Bundle
                bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                // Add Jewels info to Bundle
                equipInfo.slots.forEach((slot) => {
                    if (null === slot.name) {
                        return false;
                    }

                    if (undefined === bundle.jewels[slot.name]) {
                        bundle.jewels[slot.name] = 0;
                    }

                    bundle.remainingSlotCount[slot.size] -= 1;
                    bundle.jewels[slot.name] += 1;
                });
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                // Get Equipment Info
                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                // Convert Equip to Candidate Equip
                candidateEquip = this.convertEquipToCandidateEquip(equipInfo);

                // Add Candidate Equip to Bundle
                bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                // Add Jewels info to Bundle
                equipInfo.slots.forEach((slot) => {
                    if (null === slot.name) {
                        return false;
                    }

                    if (undefined === bundle.jewels[slot.name]) {
                        bundle.jewels[slot.name] = 0;
                    }

                    bundle.remainingSlotCount[slot.size] -= 1;
                    bundle.jewels[slot.name] += 1;
                });
            } else if ('charm' === equipType) {

                // Get Equipment Info
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);
                equipInfo.type = equipType;

                // Convert Equip to Candidate Equip
                candidateEquip = this.convertEquipToCandidateEquip(equipInfo);

                // Add Candidate Equip to Bundle
                bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);
            }
        });

        // Reset Equip Count & Completed Skill Count
        bundle.euqipCount = 0;
        bundle = this.resetCompletedSkillCount(bundle, requireSkills);

        pervBundleList[this.generateBundleHash(bundle)] = bundle;

        let requireEquipsCount = requireEquips.length;
        let requireSkillsCount = Object.keys(requireSkills).length;

        console.log(requireSkills);
        console.log(requireEquips);
        console.log(pervBundleList);

        // Create Next BundleList with Skill Equips
        console.log('Create Next BundleList with Skill Equips');

        let firstSkillName = Object.keys(requireSkills).shift();
        let lastSkillName = Object.keys(requireSkills).pop();
        let usedSkills = {};

        Object.keys(requireSkills).forEach((skillName, index) => {
            let skillLevel = requireSkills[skillName];

            // Set Past Skills
            usedSkills[skillName] = skillLevel;

            requireEquips.forEach((equipType) => {

                // Get Candidate Equips
                let equips = null;

                if ('helm' === equipType
                    || 'chest' === equipType
                    || 'arm' === equipType
                    || 'waist' === equipType
                    || 'leg' === equipType) {

                    equips = DataSet.armorHelper.typeIs(equipType).hasSkill(skillName).getItems();
                } else if ('charm' === equipType) {
                    equips = DataSet.charmHelper.hasSkill(skillName).getItems();
                }

                let candidateEquips = this.createCandidateEquips(equips, equipType);

                // Add Empty Equip
                let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);
                candidateEquip.type = equipType;

                candidateEquips.push(candidateEquip);

                if (0 === candidateEquips.length) {
                    return false;
                }

                // Create Next BundleList By Skill Equips
                pervBundleList = Misc.deepCopy(this.createNextBundleListBySkillEquips(
                    pervBundleList, equipType, candidateEquips,
                    skillName, skillLevel
                ));

                // let nextBundleList = {};

                // Object.keys(pervBundleList).forEach((hash) => {
                //     let bundle = Misc.deepCopy(pervBundleList[hash]);

                //     if (undefined === bundle.skills[skillName]) {
                //         bundle.skills[skillName] = 0;
                //     }

                //     if (skillLevel === bundle.skills[skillName]) {
                //         bundle.completedSkillCount += 1;
                //     }

                //     nextBundleList[hash] = bundle;
                // });

                // pervBundleList = Misc.deepCopy(nextBundleList);

                // console.log(pervBundleList);

                // Create Next BundleList By Skills
                // pervBundleList = Misc.deepCopy(this.createNextBundleListBySkills(
                //     pervBundleList, usedSkills, requireEquipsCount
                // ));
            });

            // Create Next BundleList By Skills
            // pervBundleList = Misc.deepCopy(this.createNextBundleListBySkills(
            //     pervBundleList, usedSkills
            // ));

            // console.log(Object.keys(pervBundleList).length, pervBundleList);
            // console.log('BundleCount', Object.keys(pervBundleList).length);
        });

        // Create Next BundleList By Skills
        pervBundleList = Misc.deepCopy(this.createNextBundleListBySkills(
            pervBundleList, usedSkills
        ));

        // console.log('AllBundleCount', Object.keys(pervBundleList).length);

        console.log(pervBundleList);

        // Devide BundleList
        console.log('Devide BundleList');

        let completedBundleList = {};
        let incompletedBundleList = {};

        Object.keys(pervBundleList).forEach((hash) => {
            let bundle = Misc.deepCopy(pervBundleList[hash]);

            if (Object.keys(usedSkills).length === bundle.completedSkillCount) {
                completedBundleList[hash] = bundle;
            } else {
                incompletedBundleList[hash] = bundle;
            }
        });

        if (0 === Object.keys(completedBundleList).length) {
            pervBundleList = Misc.deepCopy(incompletedBundleList);

            // Create Next BundleList with Slot Equips
            requireEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return false;
                }

                // Get Candidate Equips
                let equips = DataSet.armorHelper.typeIs(equipType).rareIs(0).getItems();
                let candidateEquips = this.createCandidateEquips(equips, equipType);

                if (0 === candidateEquips.length) {
                    return false;
                }

                // Create Next BundleList By Slot Equips
                pervBundleList = Misc.deepCopy(this.createNextBundleListBySlotEquips(
                    pervBundleList, equipType, candidateEquips
                ));

                // Create Next BundleList By Skills
                pervBundleList = Misc.deepCopy(this.createNextBundleListBySkills(
                    pervBundleList, usedSkills, requireEquipsCount
                ));
            });

            // Create Next BundleList By Skills
            pervBundleList = Misc.deepCopy(this.createNextBundleListBySkills(
                pervBundleList, usedSkills
            ));

            Object.keys(pervBundleList).forEach((hash) => {
                let bundle = Misc.deepCopy(pervBundleList[hash]);

                if (Object.keys(usedSkills).length === bundle.completedSkillCount) {
                    completedBundleList[hash] = bundle;
                }
            });
        }

        console.log('Completed BundleList:', Object.keys(completedBundleList).length);
        console.log('In-Completed BundleList:', Object.keys(incompletedBundleList).length);

        pervBundleList = Misc.deepCopy(completedBundleList);

        console.log('Final BundleLists:', Object.keys(pervBundleList).length)

        let lastBundleList = Object.values(pervBundleList).sort((a, b) => {
            let valueA = (7 - a.euqipCount) * 1000 + a.defense;
            let valueB = (7 - b.euqipCount) * 1000 + b.defense;

            return valueB - valueA;
        }).slice(0, 100);

        console.log(lastBundleList);
    };

    generateBundleHash = (bundle) => {
        return MD5(JSON.stringify({
            equips: bundle.equips,
            jewels: bundle.jewels
        }));
    };

    convertEquipToCandidateEquip = (equip) => {
        let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);

        // Set Name, Type & Defense
        candidateEquip.name = equip.name;
        candidateEquip.type = equip.type;
        candidateEquip.defense = (undefined !== equip.defense) ? equip.defense : 0;

        // Set Skills
        if (undefined === equip.skills) {
            equip.skills = [];
        }

        equip.skills.forEach((skill) => {
            candidateEquip.skills[skill.name] = skill.level;
        });

        // Set Slots
        if (undefined === equip.slots) {
            equip.slots = [];
        }

        equip.slots.forEach((slot) => {
            candidateEquip.ownSlotCount[slot.size] += 1;
        });

        return candidateEquip;
    };

    addCandidateEquipToBundle = (bundle, candidateEquip) => {
        if (null === candidateEquip.name) {
            return bundle;
        }

        if (undefined !== bundle.equips[candidateEquip.type]
            && null !== bundle.equips[candidateEquip.type]) {

            return bundle;
        }

        bundle.equips[candidateEquip.type] = candidateEquip.name;
        bundle.defense += candidateEquip.defense;

        Object.keys(candidateEquip.skills).forEach((skillName) => {
            let skillLevel = candidateEquip.skills[skillName];

            if (undefined === bundle.skills[skillName]) {
                bundle.skills[skillName] = 0;
            }

            bundle.skills[skillName] += skillLevel;
        });

        for (let size = 1; size <= 3; size++) {
            bundle.remainingSlotCount[size] += candidateEquip.ownSlotCount[size];
        }

        bundle.euqipCount += 1;

        return bundle;
    };

    resetCompletedSkillCount = (bundle, skills) => {
        bundle.completedSkillCount = 0;

        Object.keys(skills).forEach((skillName, index) => {
            let skillLevel = skills[skillName];

            if (undefined === bundle.skills[skillName]) {
                bundle.skills[skillName] = 0;
            }

            if (skillLevel === bundle.skills[skillName]) {
                bundle.completedSkillCount += 1;
            }
        });

        return bundle;
    };

    createCandidateEquips = (equips, equipType) => {
        let candidateEquips = [];

        equips.forEach((equip) => {
            equip.type = equipType;

            // Convert Equip to Candidate Equip
            let candidateEquip = this.convertEquipToCandidateEquip(equip);

            candidateEquips.push(candidateEquip);
        });

        return candidateEquips;
    };

    createNextBundleListBySkillEquips = (pervBundleList, equipType, candidateEquips, skillName, skillLevel) => {
        let nextBundleList = {};

        console.log(
            'CreateNextBundleListBySkillEquips:',
            Object.keys(pervBundleList).length,
            equipType,
            candidateEquips,
            skillName,
            skillLevel
        );

        candidateEquips.forEach((candidateEquip) => {
            Object.keys(pervBundleList).forEach((hash) => {
                let bundle = Misc.deepCopy(pervBundleList[hash]);

                if (undefined === bundle.equips[equipType]) {
                    bundle.equips[equipType] = null;
                }

                if (undefined === bundle.skills[skillName]) {
                    bundle.skills[skillName] = 0;
                }

                if (null !== bundle.equips[equipType]
                    || skillLevel === bundle.skills[skillName]) {

                    nextBundleList[hash] = bundle;

                    return false;
                }

                // Add Candidate Equip to Bundle
                bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                if (skillLevel < bundle.skills[skillName]) {
                    bundle = Misc.deepCopy(pervBundleList[hash]);
                }

                if (skillLevel === bundle.skills[skillName]) {
                    bundle.completedSkillCount += 1;
                }

                nextBundleList[this.generateBundleHash(bundle)] = bundle;
            });
        });

        return nextBundleList;
    };

    createNextBundleListBySlotEquips = (pervBundleList, equipType, candidateEquips) => {
        let nextBundleList = {};

        console.log(
            'CreateNextBundleListBySlotEquips:',
            Object.keys(pervBundleList).length,
            equipType,
            candidateEquips
        );

        candidateEquips.forEach((candidateEquip) => {
            Object.keys(pervBundleList).forEach((hash) => {
                let bundle = Misc.deepCopy(pervBundleList[hash]);

                if (undefined === bundle.equips[equipType]) {
                    bundle.equips[equipType] = null;
                }

                if (null !== bundle.equips[equipType]) {
                    nextBundleList[hash] = bundle;

                    return false;
                }

                // Add Candidate Equip to Bundle
                bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                nextBundleList[this.generateBundleHash(bundle)] = bundle;
            });
        });

        return nextBundleList;
    };

    addJewelToBundleBySpecificSkill = (bundle, skillName, skillLevel) => {
        let skillDiffLevel = skillLevel - bundle.skills[skillName];

        if (0 === skillDiffLevel) {
            return bundle;
        }

        // Get Jewel
        let jewel = DataSet.jewelHelper.hasSkill(skillName).getItems();
        jewel = (0 !== jewel.length) ? jewel[0] : null;

        if (null === jewel && 0 !== skillDiffLevel) {
            // console.log('無法提昇: 沒珠');

            return false;
        }

        if (skillDiffLevel > bundle.remainingSlotCount[jewel.size]) {
            // console.log('無法提昇: 沒槽');

            return false;
        }

        if (undefined === bundle.skills[skillName]) {
            bundle.skills[skillName] = 0;
        }

        if (undefined === bundle.jewels[jewel.name]) {
            bundle.jewels[jewel.name] = 0;
        }

        bundle.skills[skillName] += skillDiffLevel;
        bundle.jewels[jewel.name] += skillDiffLevel;
        bundle.remainingSlotCount[jewel.size] -= skillDiffLevel;

        if (skillLevel === bundle.skills[skillName]) {
            bundle.completedSkillCount += 1;
        }

        return bundle;
    };

    createNextBundleListBySkills = (pervBundleList, skills, requireEquipsCount = null) => {
        let nextBundleList = {};

        console.log(
            'CreateNextBundleListBySkills:',
            Object.keys(pervBundleList).length,
            Object.keys(skills).join(' '),
            requireEquipsCount
        );

        Object.keys(pervBundleList).forEach((hash) => {
            let bundle = Misc.deepCopy(pervBundleList[hash]);
            bundle = this.resetCompletedSkillCount(bundle, skills);

            // In-completed Bundle force into Next BundleList
            if (null !== requireEquipsCount
                && requireEquipsCount !== bundle.euqipCount) {

                nextBundleList[hash] = bundle;

                return false;
            }

            let isSkip = false;

            Object.keys(skills).forEach((skillName) => {
                if (true === isSkip) {
                    return false;
                }

                let skillLevel = skills[skillName];

                bundle = this.addJewelToBundleBySpecificSkill(bundle, skillName, skillLevel);

                if (false === bundle) {
                    isSkip = true;
                }
            });

            if (false === isSkip) {
                nextBundleList[this.generateBundleHash(bundle)] = bundle;
            }
        });

        return nextBundleList;
    };

    /**
     * Lifecycle Functions
     */
    componentDidMount () {
        Event.on('SearchCandidateEquips', 'CandidateBundles', (data) => {
            this.setState({
                data: data
            }, () => {
                this.bundleSearch();
            });
        });
    }

    /**
     * Render Functions
     */
    render () {
        return (
            <div className="mhwc-candidate_bundles">

            </div>
        );
    }
}
