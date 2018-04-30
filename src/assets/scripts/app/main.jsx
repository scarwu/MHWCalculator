'use strict';
/**
 * Main Module
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Load Core Libraries
import Status from 'core/status';
import Event from 'core/event';

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

// Load Components
import SetItemSelector from 'component/main/setItemSelector';
import SkillItemSelector from 'component/main/skillItemSelector';
import EquipItemSelector from 'component/main/equipItemSelector';
import CandidateBundles from 'component/main/candidateBundles';
import EquipsDisplayer from 'component/main/equipsDisplayer';
import CharacterStatus from 'component/main/characterStatus';

export default class Main extends Component {

    // Default Props
    static defaultProps = {
        hash: null
    };

    // Initial State
    state = {
        sets: [],
        skills: [],
        equips: Misc.deepCopy(Constant.defaultEquips),
        equipsLock: Misc.deepCopy(Constant.defaultEquipsLock),
        equipSelector: {},
        isShowSetSelector: false,
        isShowSkillSelector: false,
        isShowEquipSelector: false
    };

    /**
     * Handle Functions
     */
    handleSetLevelDown = (index) => {
        let sets = this.state.sets;

        if (1 === sets[index].step) {
            return false;
        }

        sets[index].step -= 1;

        this.setState({
            sets: sets
        });
    };

    handleSetLevelUp = (index) => {
        let sets = this.state.sets;
        let setInfo = DataSet.setHelper.getInfo(sets[index].name);

        if (setInfo.skills.length === sets[index].step) {
            return false;
        }

        sets[index].step += 1;

        this.setState({
            sets: sets
        });
    };

    handleSetSelectorOpen = (data) => {
        this.setState({
            isShowSetSelector: true
        });
    };

    handleSetSelectorClose = () => {
        this.setState({
            isShowSetSelector: false
        });
    };

    handleSetSelectorPickup = (data) => {
        let sets = this.state.sets;

        sets.push({
            name: data.setName,
            step: 1
        });

        this.setState({
            sets: sets
        });
    };

    handleSetRemove = (index) => {
        let sets = this.state.sets;

        delete sets[index];

        this.setState({
            sets: sets.filter((set) => {
                return (null !== set);
            })
        });
    };

    handleSkillLevelDown = (index) => {
        let skills = this.state.skills;

        if (1 === skills[index].level) {
            return false;
        }

        skills[index].level -= 1;

        this.setState({
            skills: skills
        });
    };

    handleSkillLevelUp = (index) => {
        let skills = this.state.skills;
        let skillInfo = DataSet.skillHelper.getInfo(skills[index].name);

        if (skillInfo.list.length === skills[index].level) {
            return false;
        }

        skills[index].level += 1;

        this.setState({
            skills: skills
        });
    };

    handleSkillSelectorOpen = (data) => {
        this.setState({
            isShowSkillSelector: true
        });
    };

    handleSkillSelectorClose = () => {
        this.setState({
            isShowSkillSelector: false
        });
    };

    handleSkillSelectorPickup = (data) => {
        let skills = this.state.skills;

        skills.push({
            name: data.skillName,
            level: 1
        });

        this.setState({
            skills: skills
        });
    };

    handleSkillRemove = (index) => {
        let skills = this.state.skills;

        delete skills[index];

        this.setState({
            skills: skills.filter((skill) => {
                return (null !== skill);
            })
        });
    };

    handleCandidateBundlesSearch = () => {
        let sets = this.state.sets;
        let skills = this.state.skills;
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;

        let currentEquips = {};

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (false === equipsLock[equipType]) {
                return;
            }

            currentEquips[equipType] = equips[equipType];
        });

        Event.trigger('SearchCandidateEquips', Misc.deepCopy({
            equips: currentEquips,
            sets: sets,
            skills: skills
        }));
    };

    handleCandidateBundlePickup = (bundle) => {

    };

    handleEquipsLockToggle = (equipType) => {
        let equipsLock = this.state.equipsLock;

        equipsLock[equipType] = !equipsLock[equipType];

        this.setState({
            equipsLock: equipsLock
        });
    };

    handleEquipSelectorOpen = (data) => {
        this.setState({
            isShowEquipSelector: true,
            equipSelector: data
        });
    };

    handleEquipSelectorClose = () => {
        this.setState({
            isShowEquipSelector: false
        });
    };

    handleEquipSelectorPickup = (data) => {
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;

        if (undefined !== data.enhanceIndex) {
            if ('object' !== typeof equips.weapon.enhanceNames
                || null === equips.weapon.enhanceNames) {

                equips.weapon.enhanceNames = {};
            }

            equips.weapon.enhanceNames[data.enhanceIndex] = data.enhanceName;
        } else if (undefined !== data.slotIndex) {
            if ('object' !== typeof equips[data.equipType].slotNames
                || null === equips.weapon.slotNames) {

                equips[data.equipType].slotNames = {};
            }

            equips[data.equipType].slotNames[data.slotIndex] = data.slotName;
        } else if ('weapon' === data.equipType) {
            equips.weapon = {
                name: data.equipName,
                enhanceNames: {},
                slotNames: {}
            };

            equipsLock.weapon = false;
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            equips[data.equipType] = {
                name: data.equipName,
                slotNames: {}
            };

            equipsLock[data.equipType] = false;
        } else if ('charm' === data.equipType) {
            equips.charm = {
                name: data.equipName
            };

            equipsLock.charm = false;
        }

        this.setState({
            equips: equips,
            equipsLock: equipsLock
        }, () => {
            this.refershUrlHash();
        });
    };

    handleRequireConditionRefresh = () => {
        this.setState({
            sets: [],
            skills: []
        });
    };

    handleEquipsDisplayerRefresh = () => {
        this.setState({
            equips: Misc.deepCopy(Constant.defaultEquips),
            equipsLock: Misc.deepCopy(Constant.defaultEquipsLock)
        }, () => {
            this.refershUrlHash();
        });
    };

    refershUrlHash = () => {
        let equips = Misc.deepCopy(this.state.equips);
        let base64 = Misc.base64.encode(JSON.stringify(equips));

        window.location.hash = `#/${base64}`;
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        let base64 = this.props.match.params.base64;
        let equips = (undefined !== base64)
            ? JSON.parse(Misc.base64.decode(base64))
            : Misc.deepCopy(Constant.testEquipsSetting[0]);
        let require = Misc.deepCopy(Constant.testRequireSetting[3]);

        this.setState({
            sets: require.sets,
            skills: require.skills,
            equips: equips
        }, () => {
            this.refershUrlHash();
        });
    }

    /**
     * Render Functions
     */
    renderSelectedSetItems = () => {
        let sets = this.state.sets;

        return sets.map((data, index) => {
            let setInfo = DataSet.setHelper.getInfo(data.name);
            let setRequire = setInfo.skills[data.step - 1].require;

            return (
                <div key={setInfo.name} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {setInfo.name} x {setRequire}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <a className="mhwc-icon" onClick={() => {this.handleSetLevelDown(index)}}>
                                <i className="fa fa-minus"></i>
                            </a>
                            <a className="mhwc-icon" onClick={() => {this.handleSetLevelUp(index)}}>
                                <i className="fa fa-plus"></i>
                            </a>
                            <a className="mhwc-icon" onClick={() => {this.handleSetRemove(index)}}>
                                <i className="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        {setInfo.skills.map((set) => {
                            if (setRequire < set.require) {
                                return false;
                            }

                            return (
                                <div key={set.name}>
                                    <span>({set.require}) {set.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    };

    renderSelectedSkillItems = () => {
        let skills = this.state.skills;

        return skills.map((data, index) => {
            let skillInfo = DataSet.skillHelper.getInfo(data.name);

            return (
                <div key={skillInfo.name} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {skillInfo.name}
                            &nbsp;
                            Lv.{data.level} / {skillInfo.list.length}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <a className="mhwc-icon" onClick={() => {this.handleSkillLevelDown(index)}}>
                                <i className="fa fa-minus"></i>
                            </a>
                            <a className="mhwc-icon" onClick={() => {this.handleSkillLevelUp(index)}}>
                                <i className="fa fa-plus"></i>
                            </a>
                            <a className="mhwc-icon" onClick={() => {this.handleSkillRemove(index)}}>
                                <i className="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        <span>{skillInfo.list[data.level - 1].description}</span>
                    </div>
                </div>
            );
        });
    };

    render () {
        return (
            <div id="main" className="container-fluid">
                <div className="row mhwc-header">
                    <a href="./">
                        <h1>Monster Hunter: World Calculator</h1>
                    </a>
                </div>

                <div className="row mhwc-container">
                    <div className="col mhwc-conditions">
                        <div className="mhwc-section_name">
                            <a className="fa fa-refresh" onClick={this.handleRequireConditionRefresh}></a>
                            &nbsp;
                            <span>需求條件</span>
                        </div>

                        <div className="row mhwc-function_bar">
                            <div className="col-4">
                                <a onClick={this.handleSetSelectorOpen}>
                                    <i className="fa fa-plus"></i> 套裝
                                </a>
                            </div>
                            <div className="col-4">
                                <a onClick={this.handleSkillSelectorOpen}>
                                    <i className="fa fa-plus"></i> 技能
                                </a>
                            </div>
                            <div className="col-4">
                                <a onClick={this.handleCandidateBundlesSearch}>
                                    <i className="fa fa-search"></i> 搜尋
                                </a>
                            </div>
                        </div>

                        <div className="mhwc-list">
                            {this.renderSelectedSetItems()}
                            {this.renderSelectedSkillItems()}
                        </div>
                    </div>

                    <div className="col mhwc-bundles">
                        <div className="mhwc-section_name">
                            <span>備選裝備</span>
                        </div>

                        <div className="mhwc-list">
                            <CandidateBundles
                                onPickup={this.handleCandidateBundlePickup} />
                        </div>
                    </div>

                    <div className="col mhwc-equips">
                        <div className="mhwc-section_name">
                            <a className="fa fa-refresh" onClick={this.handleEquipsDisplayerRefresh}></a>
                            &nbsp;
                            <span>已選裝備</span>
                        </div>

                        <div className="mhwc-list">
                            <EquipsDisplayer equips={this.state.equips}
                                equipsLock={this.state.equipsLock}
                                onToggleEquipsLock={this.handleEquipsLockToggle}
                                onOpenSelector={this.handleEquipSelectorOpen}
                                onPickup={this.handleEquipSelectorPickup} />
                        </div>
                    </div>

                    <div className="col mhwc-status">
                        <div className="mhwc-section_name">
                            <span>狀態</span>
                        </div>

                        <div className="mhwc-list">
                            <CharacterStatus equips={this.state.equips} />
                        </div>
                    </div>
                </div>

                <div className="row mhwc-footer">
                    <div className="col-12">
                        <span>Copyright (c) Scar Wu</span>
                    </div>

                    <div className="col-12">
                        <a href="//scar.tw" target="_blank">
                            <span>Blog</span>
                        </a>
                        &nbsp;|&nbsp;
                        <a href="https://github.com/scarwu/MHWCalculator" target="_blank">
                            <span>Github</span>
                        </a>
                    </div>
                </div>

                {this.state.isShowSetSelector ? (
                    <SetItemSelector data={this.state.sets}
                        onPickup={this.handleSetSelectorPickup}
                        onClose={this.handleSetSelectorClose} />
                ) : false}

                {this.state.isShowSkillSelector ? (
                    <SkillItemSelector data={this.state.skills}
                        onPickup={this.handleSkillSelectorPickup}
                        onClose={this.handleSkillSelectorClose} />
                ) : false}

                {this.state.isShowEquipSelector ? (
                    <EquipItemSelector data={this.state.equipSelector}
                        onPickup={this.handleEquipSelectorPickup}
                        onClose={this.handleEquipSelectorClose} />
                ) : false}
            </div>
        );
    }
}
