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
import FunctionalIcon from 'component/main/functionalIcon';
import EquipBundleSelector from 'component/main/equipBundleSelector';
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
        isShowEquipBundleSelector: false,
        isShowSetSelector: false,
        isShowSkillSelector: false,
        isShowEquipSelector: false
    };

    /**
     * Handle Functions
     */
    handleSetStepDown = (index) => {
        let sets = this.state.sets;

        if (1 === sets[index].step) {
            return false;
        }

        sets[index].step -= 1;

        // Set Sets Data to Status
        Status.set('sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSetStepUp = (index) => {
        let sets = this.state.sets;
        let setInfo = DataSet.setHelper.getInfo(sets[index].name);

        if (setInfo.skills.length === sets[index].step) {
            return false;
        }

        sets[index].step += 1;

        // Set Sets Data to Status
        Status.set('sets', sets);

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

    handleSetSelectorPickUp = (data) => {
        let sets = this.state.sets;

        sets.push({
            name: data.setName,
            step: 1
        });

        // Set Sets Data to Status
        Status.set('sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSetSelectorThrowDown = (data) => {
        let sets = this.state.sets;

        sets = sets.filter((set) => {
            return set.name !== data.setName;
        });

        // Set Sets Data to Status
        Status.set('sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSetRemove = (index) => {
        let sets = this.state.sets;

        delete sets[index];

        sets = sets.filter((set) => {
            return (null !== set);
        });

        // Set Sets Data to Status
        Status.set('sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSkillLevelDown = (index) => {
        let skills = this.state.skills;

        if (0 === skills[index].level) {
            return false;
        }

        skills[index].level -= 1;

        // Set Sets Data to Status
        Status.set('skills', skills);

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

        // Set Sets Data to Status
        Status.set('skills', skills);

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

    handleSkillSelectorPickUp = (data) => {
        let skills = this.state.skills;

        skills.push({
            name: data.skillName,
            level: 1
        });

        // Set Sets Data to Status
        Status.set('skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleSkillSelectorThrowDown = (data) => {
        let skills = this.state.skills;

        skills = skills.filter((skill) => {
            return skill.name !== data.skillName;
        });

        // Set Sets Data to Status
        Status.set('skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleSkillRemove = (index) => {
        let skills = this.state.skills;

        delete skills[index];

        skills = skills.filter((skill) => {
            return (null !== skill);
        });

        // Set Sets Data to Status
        Status.set('skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleCandidateBundlesSearch = () => {
        let sets = this.state.sets;
        let skills = this.state.skills;
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;

        // Create Current Equips
        let currentEquips = {};

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (false === equipsLock[equipType]) {
                return;
            }

            currentEquips[equipType] = equips[equipType];
        });

        // Get Ignore Equips
        let ignoreEquips = Status.get('ignoreEquips');

        if (undefined === ignoreEquips) {
            ignoreEquips = {};
        }

        Event.trigger('SearchCandidateEquips', Misc.deepCopy({
            equips: currentEquips,
            ignoreEquips: ignoreEquips,
            sets: sets,
            skills: skills
        }));
    };

    handleCandidateBundlePickUp = (bundle) => {
        let equips = Misc.deepCopy(this.state.equips);
        let slotMap = {
            1: [],
            2: [],
            3: []
        }

        Object.keys(bundle.equips).forEach((equipType) => {
            if (null === bundle.equips[equipType]) {
                return;
            }

            equips[equipType].name = bundle.equips[equipType];
            equips[equipType].slotNames = {};

            let equipInfo = null;

            if ('weapon' === equipType) {
                equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);
                equipInfo.slots.forEach((data, index) => {
                    slotMap[data.size].push({
                        type: equipType,
                        index: index
                    });
                });
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);
                equipInfo.slots.forEach((data, index) => {
                    slotMap[data.size].push({
                        type: equipType,
                        index: index
                    });
                });
            }
        });

        Object.keys(bundle.jewels).sort((a, b) => {
            let jewelInfoA = DataSet.jewelHelper.getInfo(a);
            let jewelInfoB = DataSet.jewelHelper.getInfo(b);

            return jewelInfoA.size - jewelInfoB.size;
        }).forEach((jewelName) => {
            let jewelInfo = DataSet.jewelHelper.getInfo(jewelName);
            let currentSize = jewelInfo.size;

            let jewelCount = bundle.jewels[jewelName];
            let data = null

            let jewelIndex = 0;

            while (jewelIndex < jewelCount) {
                if (0 === slotMap[currentSize].length) {
                    currentSize++;

                    continue;
                }

                data = slotMap[currentSize].shift();

                equips[data.type].slotNames[data.index] = jewelName;

                jewelIndex++;
            }
        });

        // Set Equips Data to Status
        Status.set('equips', equips);

        this.setState({
            equips: equips
        }, () => {
            this.refershUrlHash();
        });
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

    handleEquipSelectorPickUp = (data) => {
        let equips = this.state.equips;

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
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            equips[data.equipType] = {
                name: data.equipName,
                slotNames: {}
            };
        } else if ('charm' === data.equipType) {
            equips.charm = {
                name: data.equipName
            };
        }

        // Set Equips Data to Status
        Status.set('equips', equips);

        this.setState({
            equips: equips
        }, () => {
            this.refershUrlHash();
        });
    };handleEquipSelectorPickUp

    handleEquipSelectorToggle = (data) => {
        console.log(data);

        let ignoreEquips = Status.get('ignoreEquips');

        if (undefined === ignoreEquips) {
            ignoreEquips = {};
        }

        if (undefined === ignoreEquips[data.type]) {
            ignoreEquips[data.type] = {};
        }

        if (undefined === ignoreEquips[data.type][data.name]) {
            ignoreEquips[data.type][data.name] = true;
        } else {
            delete ignoreEquips[data.type][data.name];
        }

        // Set Ignore Equips Data to Status
        Status.set('ignoreEquips', ignoreEquips);

        this.forceUpdate();
    };

    handleRequireConditionRefresh = () => {
        let sets = [];
        let skills = [];

        // Set Sets & Skills Data to Status
        Status.set('sets', sets);
        Status.set('skills', skills);

        this.setState({
            sets: sets,
            skills: skills
        });
    };

    handleEquipsDisplayerRefresh = () => {
        let equips = Misc.deepCopy(Constant.defaultEquips);
        let equipsLock = Misc.deepCopy(Constant.defaultEquipsLock);

        // Set Equips Data to Status
        Status.set('equips', equips);

        this.setState({
            equips: equips,
            equipsLock: equipsLock
        }, () => {
            this.refershUrlHash();
        });
    };

    handleEquipBundleSelectorOpen = () => {
        this.setState({
            isShowEquipBundleSelector: true
        });
    };

    handleEquipBundleSelectorClose = () => {
        this.setState({
            isShowEquipBundleSelector: false
        });
    };

    handleEquipBundlePickUp = (equips) => {
        this.setState({
            equips: equips
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

        // Get Sets & Skills Data from Status
        let require = Misc.deepCopy(Constant.testRequireSetting[0]);
        let sets = Status.get('sets');
        let skills = Status.get('skills');

        if (undefined === sets) {
            sets = require.sets;
        }

        if (undefined === skills) {
            skills = require.skills;
        }

        // Get Equips Data from URL Base64
        let base64 = this.props.match.params.base64;
        let equips = Status.get('equips');

        equips = (undefined !== base64)
            ? JSON.parse(Misc.base64.decode(base64))
            : (undefined !== equips)
                ? equips
                : Misc.deepCopy(Constant.testEquipsSetting[0]);

        this.setState({
            sets: sets,
            skills: skills,
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
                            <FunctionalIcon
                                iconName="minus" altName="降低"
                                onClick={() => {this.handleSetStepDown(index)}} />
                            <FunctionalIcon
                                iconName="plus" altName="提升"
                                onClick={() => {this.handleSetStepUp(index)}} />
                            <FunctionalIcon
                                iconName="times" altName="清除"
                                onClick={() => {this.handleSetRemove(index)}} />
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
                            <FunctionalIcon
                                iconName="minus" altName="降低"
                                onClick={() => {this.handleSkillLevelDown(index)}} />
                            <FunctionalIcon
                                iconName="plus" altName="提升"
                                onClick={() => {this.handleSkillLevelUp(index)}} />
                            <FunctionalIcon
                                iconName="times" altName="清除"
                                onClick={() => {this.handleSkillRemove(index)}} />
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        <span>
                            {(0 !== data.level)
                                ? skillInfo.list[data.level - 1].description
                                : '此技能將不會出現在備選中'}
                        </span>
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
                        <h1>Monster Hunter: World - Calculator</h1>
                    </a>
                </div>

                <div className="row mhwc-container">
                    <div className="col mhwc-conditions">
                        <div className="mhwc-section_name">
                            <span>需求條件</span>
                        </div>

                        <div className="row mhwc-panel">
                            <div className="col-3">
                                <a onClick={this.handleRequireConditionRefresh}>
                                    <i className="fa fa-refresh"></i> 重置
                                </a>
                            </div>
                            <div className="col-3">
                                <a onClick={this.handleSkillSelectorOpen}>
                                    <i className="fa fa-plus"></i> 技能
                                </a>
                            </div>
                            <div className="col-3">
                                <a onClick={this.handleSetSelectorOpen}>
                                    <i className="fa fa-plus"></i> 套裝
                                </a>
                            </div>
                            <div className="col-3">
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

                        <CandidateBundles
                            onPickUp={this.handleCandidateBundlePickUp} />
                    </div>

                    <div className="col mhwc-equips">
                        <div className="mhwc-section_name">
                            <span>已選裝備</span>
                        </div>

                        <div className="row mhwc-panel">
                            <div className="col-6">
                                <a onClick={this.handleEquipsDisplayerRefresh}>
                                    <i className="fa fa-refresh"></i> 重置
                                </a>
                            </div>
                            <div className="col-6">
                                <a onClick={this.handleEquipBundleSelectorOpen}>
                                    <i className="fa fa-th-list"></i> 列表
                                </a>
                            </div>
                        </div>

                        <EquipsDisplayer equips={this.state.equips}
                            equipsLock={this.state.equipsLock}
                            onToggleEquipsLock={this.handleEquipsLockToggle}
                            onOpenSelector={this.handleEquipSelectorOpen}
                            onPickUp={this.handleEquipSelectorPickUp} />
                    </div>

                    <div className="col mhwc-status">
                        <div className="mhwc-section_name">
                            <span>狀態</span>
                        </div>

                        <CharacterStatus equips={this.state.equips} />
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

                {this.state.isShowEquipBundleSelector ? (
                    <EquipBundleSelector
                        data={this.state.equips}
                        onPickUp={this.handleEquipBundlePickUp}
                        onClose={this.handleEquipBundleSelectorClose} />
                ) : false}

                {this.state.isShowSetSelector ? (
                    <SetItemSelector
                        data={this.state.sets}
                        onPickUp={this.handleSetSelectorPickUp}
                        onThrowDown={this.handleSetSelectorThrowDown}
                        onClose={this.handleSetSelectorClose} />
                ) : false}

                {this.state.isShowSkillSelector ? (
                    <SkillItemSelector
                        data={this.state.skills}
                        onPickUp={this.handleSkillSelectorPickUp}
                        onThrowDown={this.handleSkillSelectorThrowDown}
                        onClose={this.handleSkillSelectorClose} />
                ) : false}

                {this.state.isShowEquipSelector ? (
                    <EquipItemSelector
                        data={this.state.equipSelector}
                        onPickUp={this.handleEquipSelectorPickUp}
                        onToggle={this.handleEquipSelectorToggle}
                        onClose={this.handleEquipSelectorClose} />
                ) : false}
            </div>
        );
    }
}
