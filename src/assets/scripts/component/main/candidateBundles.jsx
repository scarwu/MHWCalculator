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
        data: {},
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
        let generation = [];
        let bundle = Misc.deepCopy(Constant.defaultBundle);

        skills.sort((a, b) => {
            return b.level - a.level;
        }).map((skill) => {
            requireSkills[skill.name] = skill.level;
        });

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].map((equipType) => {
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

                equipInfo.skills.map((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });

                equipInfo.slots.map((slot) => {
                    bundle.slots[slot.size] += 1;

                    if (undefined === bundle.jewels[slot.name]) {
                        bundle.jewels[slot.name] = 0;
                    }

                    bundle.jewels[slot.name] += 1;
                });
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.map((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });

                equipInfo.slots.map((slot) => {
                    bundle.slots[slot.size] += 1;

                    if (undefined === bundle.jewels[slot.name]) {
                        bundle.jewels[slot.name] = 0;
                    }

                    bundle.jewels[slot.name] += 1;
                });
            } else if ('charm' === equipType) {
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.map((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });
            }
        });

        generation.push(bundle);

        console.log(requireSkills);
        console.log(requireEquips);
        console.log(generation);

        // let dataMap = {};

        // skills.sort((a, b) => {
        //     return b.level - a.level;
        // }).map((data) => {
        //     dataMap[data.name] = {
        //         level: data.level,
        //         equips: {
        //             helm: {},
        //             chest: {},
        //             arm: {},
        //             waist: {},
        //             leg: {},
        //             charm: {},
        //             jewel: {}
        //         }
        //     };

        //     DataSet.armorHelper.hasSkill(data.name).getItems().map((equip) => {
        //         equip.skills.map((skill) => {
        //             if (skill.name !== data.name) {
        //                 return false;
        //             }

        //             dataMap[data.name].equips[equip.type][equip.name] = skill.level;
        //         });
        //     });

        //     DataSet.charmHelper.hasSkill(data.name).getItems().map((equip) => {
        //         equip.skills.map((skill) => {
        //             if (skill.name !== data.name) {
        //                 return false;
        //             }

        //             dataMap[data.name].equips.charm[equip.name] = skill.level;
        //         });
        //     });

        //     DataSet.jewelHelper.hasSkill(data.name).getItems().map((equip) => {
        //         dataMap[data.name].equips.jewel[equip.name] = equip.skill.level;
        //     });
        // });

        // console.log(equipsLock);
        // console.log(dataMap);

        // Object.names(equips).map((equipType) => {
        //     let equip = equips[equipType];
        //     let isLock = equipsLock[equipType];

        //     if (null === equip.name) {
        //         return false;
        //     }

        //     if (false === isLock) {
        //         return false;
        //     }

        //     let equipInfo = null;

        //     if ('weapon' === equipType) {
        //         equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);
        //         equipInfo.skills.map((skill) => {
        //             if (undefined === dataMap[skill.name]) {
        //                 return false;
        //             }

        //             dataMap[skill.name].level -= skill.level;

        //             if (0 >= dataMap[skill.name].level) {
        //                 delete dataMap[skill.name];
        //             }
        //         });
        //     } else if ('helm' === equipType
        //         || 'chest' === equipType
        //         || 'arm' === equipType
        //         || 'waist' === equipType
        //         || 'leg' === equipType) {

        //         equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

        //         Object.names(dataMap).map((skillName) => {
        //             delete dataMap[skillName].equips[equipType];
        //         });

        //         equipInfo.skills.map((skill) => {
        //             if (undefined === dataMap[skill.name]) {
        //                 return false;
        //             }

        //             dataMap[skill.name].level -= skill.level;

        //             if (0 >= dataMap[skill.name].level) {
        //                 delete dataMap[skill.name];
        //             }
        //         });
        //     } else if ('charm' === equipType) {
        //         equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

        //         Object.names(dataMap).map((skillName) => {
        //             delete dataMap[skillName][equipType];
        //         });

        //         equipInfo.skills.map((skill) => {
        //             delete dataMap[skill.name].equips[equipType];
        //         });
        //     }
        // });

        // console.log(dataMap);
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
