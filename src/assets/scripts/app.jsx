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
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';
import JewelDataset from 'libraries/dataset/jewel';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

import EquipBundleSelector from 'components/modal/equipBundleSelector';
import SetItemSelector from 'components/modal/setItemSelector';
import SkillItemSelector from 'components/modal/skillItemSelector';
import EquipItemSelector from 'components/modal/equipItemSelector';

import CandidateBundles from 'components/candidateBundles';
import EquipsDisplayer from 'components/equipsDisplayer';
import CharacterStatus from 'components/characterStatus';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

// Load Json
import TestData from 'files/json/testData.json';

export default class Main extends Component {

    // Default Props
    static defaultProps = {
        hash: null
    };

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            isImportEquips: false,
            lang: Status.get('sys:lang'),
            sets: Status.get('app:sets') || Helper.deepCopy(TestData.requireList[0]).sets,
            skills: Status.get('app:skills') || Helper.deepCopy(TestData.requireList[0]).skills,
            equips: Status.get('app:equips') || Helper.deepCopy(TestData.equipsList[0]),
            equipsLock: Status.get('app:equipsLock') || Helper.deepCopy(Constant.defaultEquipsLock),
            ignoreEquips: Status.get('app:ignoreEquips') || {}
        };

        // Set Build Time
        Status.set('sys:buildTime', Config.buildTime);
    }

    /**
     * Handle Functions
     */
    handleBundleExport = () => {
        let equips = Helper.deepCopy(this.state.equips);
        let hash = Helper.base64Encode(JSON.stringify(equips));

        let protocol = window.location.protocol;
        let hostname = window.location.hostname;
        let pathname = window.location.pathname;

        window.open(`${protocol}//${hostname}${pathname}#/${hash}`, '_blank');
    };

    handleLangChange = () => {
        let lang = this.refs.lang.value;

        // Se Data to Status
        Status.set('sys:lang', lang);

        this.setState({
            lang: lang
        });
    };

    handleSetStepDown = (index) => {
        let sets = this.state.sets;

        if (1 === sets[index].step) {
            return false;
        }

        sets[index].step -= 1;

        // Set Data to Status
        Status.set('app:sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSetStepUp = (index) => {
        let sets = this.state.sets;
        let setInfo = SetDataset.getInfo(sets[index].id);

        if (Helper.isEmpty(setInfo)) {
            return false;
        }

        if (setInfo.skills.length === sets[index].step) {
            return false;
        }

        sets[index].step += 1;

        // Set Data to Status
        Status.set('app:sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSetItemSelectorPickUp = (data) => {
        let sets = this.state.sets;

        sets.push({
            id: data.setId,
            step: 1
        });

        // Set Data to Status
        Status.set('app:sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSetItemSelectorThrowDown = (data) => {
        let sets = this.state.sets;

        sets = sets.filter((set) => {
            return set.id !== data.setId;
        });

        // Set Data to Status
        Status.set('app:sets', sets);

        this.setState({
            sets: sets
        });
    };

    handleSetRemove = (index) => {
        let sets = this.state.sets;

        delete sets[index];

        sets = sets.filter((set) => {
            return (Helper.isNotEmpty(set));
        });

        // Set Data to Status
        Status.set('app:sets', sets);

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

        // Set Data to Status
        Status.set('app:skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleSkillLevelUp = (index) => {
        let skills = this.state.skills;
        let skillInfo = SkillDataset.getInfo(skills[index].id);

        if (Helper.isEmpty(skillInfo)) {
            return false;
        }

        if (skillInfo.list.length === skills[index].level) {
            return false;
        }

        skills[index].level += 1;

        // Set Data to Status
        Status.set('app:skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleSkillItemSelectorPickUp = (data) => {
        let skills = this.state.skills;

        skills.push({
            id: data.skillId,
            level: 1
        });

        // Set Data to Status
        Status.set('app:skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleSkillItemSelectorThrowDown = (data) => {
        let skills = this.state.skills;

        skills = skills.filter((skill) => {
            return skill.id !== data.skillId;
        });

        // Set Data to Status
        Status.set('app:skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleSkillRemove = (index) => {
        let skills = this.state.skills;

        delete skills[index];

        skills = skills.filter((skill) => {
            return (Helper.isNotEmpty(skill));
        });

        // Set Data to Status
        Status.set('app:skills', skills);

        this.setState({
            skills: skills
        });
    };

    handleCandidateBundlesSearch = () => {
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

        Event.trigger('SearchCandidateEquips', Helper.deepCopy({
            equips: currentEquips,
            ignoreEquips: this.state.ignoreEquips,
            sets: this.state.sets,
            skills: this.state.skills
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
            if (Helper.isEmpty(bundle.equips[equipType])) {
                return;
            }

            equips[equipType].id = bundle.equips[equipType];
            equips[equipType].slotIds = {};

            let equipInfo = null;

            if ('weapon' === equipType) {
                if (Helper.isNotEmpty(bundle.meta.weaponEnhanceIds)) {
                    equips.weapon.enhanceIds = bundle.meta.weaponEnhanceIds; // Restore Enhance
                }

                equipInfo = CommonDataset.getAppliedWeaponInfo(equips.weapon);
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType
            ) {
                equipInfo = CommonDataset.getAppliedArmorInfo(equips[equipType]);
            }

            if (Helper.isEmpty(equipInfo)) {
                return;
            }

            equipInfo.slots.forEach((data, index) => {
                slotMap[data.size].push({
                    type: equipType,
                    index: index
                });
            });
        });

        Object.keys(bundle.jewels).sort((jewelIdA, jewelIdB) => {
            let jewelInfoA = JewelDataset.getInfo(jewelIdA);
            let jewelInfoB = JewelDataset.getInfo(jewelIdB);

            if (Helper.isEmpty(jewelInfoA) || Helper.isEmpty(jewelInfoB)) {
                return 0;
            }

            return jewelInfoA.size - jewelInfoB.size;
        }).forEach((jewelId) => {
            let jewelInfo = JewelDataset.getInfo(jewelId);

            if (Helper.isEmpty(jewelInfo)) {
                return;
            }

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

        // Set Data to Status
        Status.set('app:equips', equips);

        this.setState({
            equips: equips
        });
    };

    handleEquipsLockToggle = (equipType) => {
        let equipsLock = this.state.equipsLock;

        equipsLock[equipType] = !equipsLock[equipType];

        // Set Data to Status
        Status.set('app:equipsLock', equipsLock);

        this.setState({
            equipsLock: equipsLock
        });
    };

    handleEquipItemSelectorPickUp = (data) => {
        let equips = this.state.equips;

        if (Helper.isNotEmpty(data.enhanceIndex)) {
            if (Helper.isEmpty(equips.weapon.enhanceIds)) {
                equips.weapon.enhanceIds = {};
            }

            equips.weapon.enhanceIds[data.enhanceIndex] = data.enhanceId;
        } else if (Helper.isNotEmpty(data.slotIndex)) {
            if (Helper.isEmpty(equips.weapon.slotIds)) {
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
            || 'leg' === data.equipType
        ) {
            equips[data.equipType] = {
                id: data.equipId,
                slotIds: {}
            };
        } else if ('charm' === data.equipType) {
            equips.charm = {
                id: data.equipId
            };
        }

        // Set Data to Status
        Status.set('app:equips', equips);

        this.setState({
            equips: equips
        });
    };

    handleEquipItemSelectorToggle = (data) => {
        let ignoreEquips = this.state.ignoreEquips;

        if (Helper.isEmpty(ignoreEquips[data.type])) {
            ignoreEquips[data.type] = {};
        }

        if (Helper.isEmpty(ignoreEquips[data.type][data.id])) {
            ignoreEquips[data.type][data.id] = true;
        } else {
            delete ignoreEquips[data.type][data.id];
        }

        // Set Data to Status
        Status.set('app:ignoreEquips', ignoreEquips);

        this.setState({
            ignoreEquips: ignoreEquips
        });
    };

    handleRequireConditionRefresh = () => {
        let sets = [];
        let skills = [];

        // Set Data to Status
        Status.set('app:sets', sets);
        Status.set('app:skills', skills);

        this.setState({
            sets: sets,
            skills: skills
        });
    };

    handleEquipsDisplayerRefresh = () => {
        let equips = Helper.deepCopy(Constant.defaultEquips);
        let equipsLock = Helper.deepCopy(Constant.defaultEquipsLock);

        // Set Data to Status
        Status.set('app:equips', equips);
        Status.set('app:equipsLock', equipsLock);

        this.setState({
            equips: equips,
            equipsLock: equipsLock
        });
    };

    handleEquipBundleSelectorPickUp = (equips) => {
        this.setState({
            equips: equips
        });
    };

    /**
     * Lifecycle Functions
     */
    static getDerivedStateFromProps (nextProps, prevState) {
        let hash = nextProps.match.params.hash;

        return (Helper.isNotEmpty(hash) && false === prevState.isImportEquips) ? {
            equips: JSON.parse(Helper.base64Decode(hash)),
            isImportEquips: true
        } : null;
    }

    componentDidMount () {
        // this.unsubscribe = ModalStates.store.subscribe(() => {
        //     this.setState({

        //     });
        // });
    }

    componentWillUnmount(){
        // this.unsubscribe();
    }

    /**
     * Render Functions
     */
    renderSelectedSetItems = () => {
        let sets = this.state.sets;

        return sets.map((data, index) => {
            let setInfo = SetDataset.getInfo(data.id);

            if (Helper.isEmpty(setInfo)) {
                return false;
            }

            let setRequire = setInfo.skills[data.step - 1].require;

            return (
                <div key={setInfo.id} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {_(setInfo.name)} x {setRequire}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="minus-circle" altName={_('down')}
                                onClick={() => {this.handleSetStepDown(index)}} />
                            <FunctionalIcon
                                iconName="plus-circle" altName={_('up')}
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

                            let skillInfo = SkillDataset.getInfo(skill.id);

                            return (Helper.isNotEmpty(skillInfo)) ? (
                                <div key={skill.id}>
                                    <span>({skill.require}) {_(skillInfo.name)}</span>
                                </div>
                            ) : false;
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

            return (Helper.isNotEmpty(skillInfo)) ? (
                <div key={skillInfo.id} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {_(skillInfo.name)} Lv.{data.level} / {skillInfo.list.length}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="minus-circle" altName={_('down')}
                                onClick={() => {this.handleSkillLevelDown(index)}} />
                            <FunctionalIcon
                                iconName="plus-circle" altName={_('up')}
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
            ) : false;
        });
    };

    render () {
        return (
            <div key={this.state.lang} id="mhwc-app" className="container-fluid">
                <div className="row mhwc-header">
                    <a className="mhwc-title" href="./">
                        <h1>{_('title')}</h1>
                    </a>

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="link" altName={_('exportBundle')}
                            onClick={this.handleBundleExport} />
                        <FunctionalIcon
                            iconName="info" altName={_('showChangelog')}
                            onClick={ModalStates.setters.showChangelog} />
                        <div className="mhwc-lang">
                            <div>
                                <i className="fa fa-globe"></i>
                                <select defaultValue={this.state.lang} ref="lang" onChange={this.handleLangChange}>
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
                            <span className="mhwc-title">{_('requireCondition')}</span>

                            <div className="mhwc-icons_bundle">
                                <FunctionalIcon
                                    iconName="refresh" altName={_('reset')}
                                    onClick={this.handleRequireConditionRefresh} />
                                <FunctionalIcon
                                    iconName="plus" altName={_('skill')}
                                    onClick={ModalStates.setters.showSkillItemSelector} />
                                <FunctionalIcon
                                    iconName="plus" altName={_('set')}
                                    onClick={ModalStates.setters.showSetItemSelector} />
                            </div>
                        </div>

                        <div className="mhwc-list">
                            {this.renderSelectedSetItems()}
                            {this.renderSelectedSkillItems()}
                        </div>
                    </div>

                    <div className="col mhwc-bundles">
                        <div className="mhwc-section_name">
                            <span className="mhwc-title">{_('candidateBundle')}</span>

                            <div className="mhwc-icons_bundle">
                                <FunctionalIcon
                                    iconName="refresh" altName={_('reset')}
                                    onClick={CommonStates.setters.cleanComputedBundles} />
                                <FunctionalIcon
                                    iconName="cog" altName={_('setting')}
                                    onClick={() => {}} />
                                <FunctionalIcon
                                    iconName="search" altName={_('search')}
                                    onClick={this.handleCandidateBundlesSearch} />
                            </div>
                        </div>

                        <CandidateBundles
                            onPickUp={this.handleCandidateBundlePickUp} />
                    </div>

                    <div className="col mhwc-equips">
                        <div className="mhwc-section_name">
                            <span className="mhwc-title">{_('equipBundle')}</span>

                            <div className="mhwc-icons_bundle">
                                <FunctionalIcon
                                    iconName="refresh" altName={_('reset')}
                                    onClick={this.handleEquipsDisplayerRefresh} />
                                <FunctionalIcon
                                    iconName="th-list" altName={_('bundleList')}
                                    onClick={ModalStates.setters.showEquipBundleSelector} />
                                <FunctionalIcon
                                    iconName="th-large" altName={_('inventorySetting')}
                                    onClick={ModalStates.setters.showInventorySetting} />
                            </div>
                        </div>

                        <EquipsDisplayer equips={this.state.equips}
                            equipsLock={this.state.equipsLock}
                            onToggleEquipsLock={this.handleEquipsLockToggle}
                            onOpenSelector={ModalStates.setters.showEquipItemSelector}
                            onPickUp={this.handleEquipItemSelectorPickUp} />
                    </div>

                    <div className="col mhwc-status">
                        <div className="mhwc-section_name">
                            <span className="mhwc-title">{_('status')}</span>
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

                <EquipBundleSelector
                    data={this.state.equips}
                    onPickUp={this.handleEquipBundleSelectorPickUp} />

                <SetItemSelector
                    data={this.state.sets}
                    onPickUp={this.handleSetItemSelectorPickUp}
                    onThrowDown={this.handleSetItemSelectorThrowDown} />

                <SkillItemSelector
                    data={this.state.skills}
                    onPickUp={this.handleSkillItemSelectorPickUp}
                    onThrowDown={this.handleSkillItemSelectorThrowDown} />

                <EquipItemSelector
                    ignoreEquips={this.state.ignoreEquips}
                    onPickUp={this.handleEquipItemSelectorPickUp}
                    onToggle={this.handleEquipItemSelectorToggle} />
            </div>
        );
    }
}
