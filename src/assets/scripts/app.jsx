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
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import Base64 from 'libraries/base64';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';
import JewelDataset from 'libraries/dataset/jewel';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

import EquipBundleSelector from 'components/dialog/equipBundleSelector';
import SetItemSelector from 'components/dialog/setItemSelector';
import SkillItemSelector from 'components/dialog/skillItemSelector';
import EquipItemSelector from 'components/dialog/equipItemSelector';
import ChangeLog from 'components/dialog/changeLog';

import CandidateBundles from 'components/candidateBundles';
import EquipsDisplayer from 'components/equipsDisplayer';
import CharacterStatus from 'components/characterStatus';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Load Json
import TestData from 'json/testData.json';

export default class Main extends Component {

    // Default Props
    static defaultProps = {
        hash: null
    };

    // Initial State
    state = {
        lang: Status.get('lang'),
        sets: [],
        skills: [],
        equips: Helper.deepCopy(Constant.defaultEquips),
        equipsLock: Helper.deepCopy(Constant.defaultEquipsLock),
        equipSelector: {},
        isShowEquipBundleSelector: false,
        isShowSetSelector: false,
        isShowSkillSelector: false,
        isShowEquipSelector: false,
        isShowChangeLog: false
    };

    /**
     * Handle Functions
     */
    handleBundleImport = () => {
        let hash = this.props.match.params.hash;

        if (undefined !== hash) {
            this.setState({
                equips: JSON.parse(Base64.decode(hash))
            });
        }
    };

    handleBundleExport = () => {
        let equips = Helper.deepCopy(this.state.equips);
        let hash = Base64.encode(JSON.stringify(equips));

        let protocol = window.location.protocol;
        let hostname = window.location.hostname;
        let pathname = window.location.pathname;

        window.open(`${protocol}//${hostname}${pathname}#/${hash}`, '_blank');
    };

    handleLangChange = () => {
        Status.set('lang', this.refs.lang.value);

        this.setState({
            lang: Status.get('lang')
        });
    };

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
        let setInfo = SetDataset.getInfo(sets[index].id);

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
            id: data.setId,
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
            return set.id !== data.setId;
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
        let skillInfo = SkillDataset.getInfo(skills[index].id);

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
            id: data.skillId,
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
            return skill.id !== data.skillId;
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

        Event.trigger('SearchCandidateEquips', Helper.deepCopy({
            equips: currentEquips,
            ignoreEquips: ignoreEquips,
            sets: sets,
            skills: skills
        }));
    };

    handleCandidateBundlePickUp = (bundle) => {
        let equips = Helper.deepCopy(this.state.equips);
        let slotMap = {
            1: [],
            2: [],
            3: []
        };

        Object.keys(bundle.equips).forEach((equipType) => {
            if (null === bundle.equips[equipType]) {
                return;
            }

            equips[equipType].id = bundle.equips[equipType];
            equips[equipType].slotIds = {};

            let equipInfo = null;

            if ('weapon' === equipType) {
                equipInfo = CommonDataset.getAppliedWeaponInfo(equips.weapon);
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

                equipInfo = CommonDataset.getAppliedArmorInfo(equips[equipType]);
                equipInfo.slots.forEach((data, index) => {
                    slotMap[data.size].push({
                        type: equipType,
                        index: index
                    });
                });
            }
        });

        Object.keys(bundle.jewels).sort((jewelIdA, jewelIdB) => {
            let jewelInfoA = JewelDataset.getInfo(jewelIdA);
            let jewelInfoB = JewelDataset.getInfo(jewelIdB);

            return jewelInfoA.size - jewelInfoB.size;
        }).forEach((jewelId) => {
            let jewelInfo = JewelDataset.getInfo(jewelId);
            let currentSize = jewelInfo.size;

            let jewelCount = bundle.jewels[jewelId];
            let data = null

            let jewelIndex = 0;

            while (jewelIndex < jewelCount) {
                if (0 === slotMap[currentSize].length) {
                    currentSize++;

                    continue;
                }

                data = slotMap[currentSize].shift();

                equips[data.type].slotIds[data.index] = jewelId;

                jewelIndex++;
            }
        });

        // Set Equips Data to Status
        Status.set('equips', equips);

        this.setState({
            equips: equips
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
            if ('object' !== typeof equips.weapon.enhanceIds
                || null === equips.weapon.enhanceIds) {

                equips.weapon.enhanceIds = {};
            }

            equips.weapon.enhanceIds[data.enhanceIndex] = data.enhanceId;
        } else if (undefined !== data.slotIndex) {
            if ('object' !== typeof equips[data.equipType].slotIds
                || null === equips.weapon.slotIds) {

                equips[data.equipType].slotIds = {};
            }

            equips[data.equipType].slotIds[data.slotIndex] = data.slotId;
        } else if ('weapon' === data.equipType) {
            equips.weapon = {
                id: data.equipId,
                enhanceIds: {},
                slotIds: {}
            };
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            equips[data.equipType] = {
                id: data.equipId,
                slotIds: {}
            };
        } else if ('charm' === data.equipType) {
            equips.charm = {
                id: data.equipId
            };
        }

        // Set Equips Data to Status
        Status.set('equips', equips);

        this.setState({
            equips: equips
        });
    };

    handleEquipSelectorToggle = (data) => {
        let ignoreEquips = Status.get('ignoreEquips');

        if (undefined === ignoreEquips) {
            ignoreEquips = {};
        }

        if (undefined === ignoreEquips[data.type]) {
            ignoreEquips[data.type] = {};
        }

        if (undefined === ignoreEquips[data.type][data.id]) {
            ignoreEquips[data.type][data.id] = true;
        } else {
            delete ignoreEquips[data.type][data.id];
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
        let equips = Helper.deepCopy(Constant.defaultEquips);
        let equipsLock = Helper.deepCopy(Constant.defaultEquipsLock);

        // Set Equips Data to Status
        Status.set('equips', equips);

        this.setState({
            equips: equips,
            equipsLock: equipsLock
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
        });
    };

    handleChangeLogOpen = () => {
        this.setState({
            isShowChangeLog: true
        });
    };

    handleChangeLogClose = () => {
        this.setState({
            isShowChangeLog: false
        });
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {

        // Get Sets, Skills & Equips Data from Status
        let sets = Status.get('sets');
        let skills = Status.get('skills');
        let equips = Status.get('equips');

        if (undefined === sets) {
            sets = Helper.deepCopy(TestData.requireList[0]).sets;
        }

        if (undefined === skills) {
            skills = Helper.deepCopy(TestData.requireList[0]).skills;
        }

        if (undefined === equips) {
            equips = Helper.deepCopy(TestData.equipsList[0]);
        }

        // Is Show ChangeLog
        let isShowChangeLog = ('production' === Config.env)
            ? (Config.buildTime !== parseInt(Status.get('buildTime'))) : false;

        Status.set('buildTime', Config.buildTime);

        // Set State
        this.setState({
            sets: sets,
            skills: skills,
            equips: equips,
            isShowChangeLog: isShowChangeLog
        }, () => {
            this.handleBundleImport();
        });
    }

    /**
     * Render Functions
     */
    renderSelectedSetItems = () => {
        let sets = this.state.sets;

        return sets.map((data, index) => {
            let setInfo = SetDataset.getInfo(data.id);
            let setRequire = setInfo.skills[data.step - 1].require;

            return (
                <div key={setInfo.id} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {_(setInfo.name)} x {setRequire}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="minus" altName={_('down')}
                                onClick={() => {this.handleSetStepDown(index)}} />
                            <FunctionalIcon
                                iconName="plus" altName={_('up')}
                                onClick={() => {this.handleSetStepUp(index)}} />
                            <FunctionalIcon
                                iconName="times" altName={_('clean')}
                                onClick={() => {this.handleSetRemove(index)}} />
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        {setInfo.skills.map((skill) => {
                            if (setRequire < skill.require) {
                                return false;
                            }

                            let skillName = SkillDataset.getInfo(skill.id).name;

                            return (
                                <div key={skill.id}>
                                    <span>({skill.require}) {_(skillName)}</span>
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
            let skillInfo = SkillDataset.getInfo(data.id);

            return (
                <div key={skillInfo.id} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {_(skillInfo.name)}
                            &nbsp;
                            Lv.{data.level} / {skillInfo.list.length}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="minus" altName={_('down')}
                                onClick={() => {this.handleSkillLevelDown(index)}} />
                            <FunctionalIcon
                                iconName="plus" altName={_('up')}
                                onClick={() => {this.handleSkillLevelUp(index)}} />
                            <FunctionalIcon
                                iconName="times" altName={_('clean')}
                                onClick={() => {this.handleSkillRemove(index)}} />
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        <span>
                            {(0 !== data.level)
                                ? _(skillInfo.list[data.level - 1].description)
                                : _('skillLevelZero')}
                        </span>
                    </div>
                </div>
            );
        });
    };

    render () {
        return (
            <div key={this.state.lang} id="main" className="container-fluid">
                <div className="row mhwc-header">
                    <a href="./">
                        <h1>{_('title')}</h1>
                    </a>

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="link" altName={_('exportBundle')}
                            onClick={this.handleBundleExport} />
                        <FunctionalIcon
                            iconName="info" altName={_('showChangelog')}
                            onClick={this.handleChangeLogOpen} />
                        <div className="mhwc-lang">
                            <div>
                                <i className="fa fa-globe"></i>
                                <select defaultValue={Status.get('lang')} ref="lang" onChange={this.handleLangChange}>
                                    {Object.keys(Constant.langs).map((lang) => {
                                        return (
                                            <option key={lang} value={lang}>{Constant.langs[lang]}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mhwc-container">
                    <div className="col mhwc-conditions">
                        <div className="mhwc-section_name">
                            <span>{_('requireCondition')}</span>
                        </div>

                        <div className="row mhwc-panel">
                            <div className="col-3">
                                <a onClick={this.handleRequireConditionRefresh}>
                                    <i className="fa fa-refresh"></i> {_('reset')}
                                </a>
                            </div>
                            <div className="col-3">
                                <a onClick={this.handleSkillSelectorOpen}>
                                    <i className="fa fa-plus"></i> {_('skill')}
                                </a>
                            </div>
                            <div className="col-3">
                                <a onClick={this.handleSetSelectorOpen}>
                                    <i className="fa fa-plus"></i> {_('set')}
                                </a>
                            </div>
                            <div className="col-3">
                                <a onClick={this.handleCandidateBundlesSearch}>
                                    <i className="fa fa-search"></i> {_('search')}
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
                            <span>{_('candidateBundle')}</span>
                        </div>

                        <CandidateBundles
                            onPickUp={this.handleCandidateBundlePickUp} />
                    </div>

                    <div className="col mhwc-equips">
                        <div className="mhwc-section_name">
                            <span>{_('equipBundle')}</span>
                        </div>

                        <div className="row mhwc-panel">
                            <div className="col-6">
                                <a onClick={this.handleEquipsDisplayerRefresh}>
                                    <i className="fa fa-refresh"></i> {_('reset')}
                                </a>
                            </div>
                            <div className="col-6">
                                <a onClick={this.handleEquipBundleSelectorOpen}>
                                    <i className="fa fa-th-list"></i> {_('list')}
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
                            <span>{_('status')}</span>
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

                {this.state.isShowChangeLog ? (
                    <ChangeLog
                        onClose={this.handleChangeLogClose} />
                ) : false}
            </div>
        );
    }
}
