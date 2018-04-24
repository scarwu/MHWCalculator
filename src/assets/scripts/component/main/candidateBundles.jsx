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

        let requireEquips = [];
        let requireSkills = {};
        let pervGeneration = {};
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

            if ('weapon' === equipType) {
                equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skillLevel[skill.name]) {
                        bundle.skillLevel[skill.name] = 0
                    }

                    bundle.skillLevel[skill.name] += skill.level;
                });

                equipInfo.slots.forEach((slot) => {
                    bundle.slotSizeCount[slot.size] += 1;

                    if (undefined === bundle.jewelCount[slot.name]) {
                        bundle.jewelCount[slot.name] = 0;
                    }

                    bundle.jewelCount[slot.name] += 1;
                });
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skillLevel[skill.name]) {
                        bundle.skillLevel[skill.name] = 0
                    }

                    bundle.skillLevel[skill.name] += skill.level;
                });

                equipInfo.slots.forEach((slot) => {
                    bundle.slotSizeCount[slot.size] += 1;

                    if (undefined === bundle.jewelCount[slot.name]) {
                        bundle.jewelCount[slot.name] = 0;
                    }

                    bundle.jewelCount[slot.name] += 1;
                });
            } else if ('charm' === equipType) {
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skillLevel[skill.name]) {
                        bundle.skillLevel[skill.name] = 0
                    }

                    bundle.skillLevel[skill.name] += skill.level;
                });
            }
        });

        pervGeneration[this.generateBundleHash(bundle)] = bundle;

        console.log(requireSkills);
        console.log(requireEquips);
        console.log(pervGeneration);

        Object.keys(requireSkills).forEach((skillName) => {
            let skillLevel = requireSkills[skillName];

            requireEquips.forEach((equipType) => {
                let candidateEquips = []

                if ('helm' === equipType
                    || 'chest' === equipType
                    || 'arm' === equipType
                    || 'waist' === equipType
                    || 'leg' === equipType) {

                    DataSet.armorHelper.typeIs(equipType).hasSkill(skillName).getItems().forEach((equip) => {
                        let candidateEquip = {
                            name: equip.name,
                            skillLevel: 0,
                            slotSizeCount: {
                                1: 0,
                                2: 0,
                                3: 0
                            }
                        };

                        equip.skills.forEach((skill) => {
                            if (skill.name !== skillName) {
                                return false;
                            }

                            candidateEquip.skillLevel = skill.level;
                        });

                        equip.slots.forEach((slot) => {
                            candidateEquip.slotSizeCount[slot.size] += 1;
                        });

                        candidateEquips.push(candidateEquip);
                    });
                } else if ('charm' === equipType) {
                    DataSet.charmHelper.hasSkill(skillName).getItems().forEach((equip) => {
                        let candidateEquip = {
                            name: equip.name,
                            skillLevel: 0,
                            slotSizeCount: {
                                1: 0,
                                2: 0,
                                3: 0
                            }
                        };

                        equip.skills.forEach((skill) => {
                            if (skill.name !== skillName) {
                                return false;
                            }

                            candidateEquip.skillLevel = skill.level;
                        });

                        candidateEquips.push(candidateEquip);
                    });
                }

                candidateEquips.push({
                    name: null,
                    skillLevel: 0,
                    slotSizeCount: {
                        1: 0,
                        2: 0,
                        3: 0
                    }
                });

                if (0 === candidateEquips.length) {
                    return false;
                }

                console.log(skillName, equipType, candidateEquips);

                let nextGeneration = {};

                candidateEquips.forEach((equip) => {
                    let equipName = equip.name;
                    let skillLevel = equip.skillLevel;
                    let slotSizeCount = equip.slotSizeCount;

                    Object.keys(pervGeneration).forEach((hash) => {
                        let bundle = Misc.deepCopy(pervGeneration[hash]);
                        // let bundle = pervGeneration[hash];

                        if (undefined === bundle.equips[equipType]) {
                            bundle.equips[equipType] = null;
                        }

                        if (undefined === bundle.skillLevel[skillName]
                            || bundle.skillLevel[skillName] < skillLevel) {

                            if (null !== bundle.equips[equipType]) {
                                return false;
                            }

                            bundle.equips[equipType] = equipName;

                            if (undefined === bundle.skillLevel[skillName]) {
                                bundle.skillLevel[skillName] = 0
                            }

                            bundle.skillLevel[skillName] += skillLevel;

                            for (let size = 1; size <= 3; size++) {
                                bundle.slotSizeCount[size] += slotSizeCount[size];
                            }
                        }

                        if (undefined !== bundle.skillLevel[skillName]
                            && bundle.skillLevel[skillName] <= skillLevel) {

                            console.log(bundle);

                            nextGeneration[this.generateBundleHash(bundle)] = bundle;
                        }
                    });
                });

                if (0 < Object.keys(nextGeneration).length) {
                    pervGeneration = Misc.deepCopy(nextGeneration);
                }
            });
        });

        console.log(pervGeneration);
    };

    generateBundleHash = (bundle) => {
        return MD5(JSON.stringify({
            equips: bundle.equips,
            jewelCount: bundle.jewelCount
        }));
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            data: this.props.data
        }, () => {
            this.bundleSearch();
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            data: nextProps.data
        }, () => {
            this.bundleSearch();
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
