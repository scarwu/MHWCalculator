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
import JewelDataset from 'libraries/dataset/jewel';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

import EquipBundleSelector from 'components/modal/equipBundleSelector';
import EquipItemSelector from 'components/modal/equipItemSelector';

import ConditionOptions from 'components/conditionOptions';
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
        this.unsubscribe = CommonStates.store.subscribe(() => {
            this.setState({
                // sets: CommonStates.getters.getRequiredSets(),
                // skills: CommonStates.getters.getRequiredSkills()
            });
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    /**
     * Render Functions
     */
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
                    <ConditionOptions />

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

                <EquipItemSelector
                    ignoreEquips={this.state.ignoreEquips}
                    onPickUp={this.handleEquipItemSelectorPickUp}
                    onToggle={this.handleEquipItemSelectorToggle} />
            </div>
        );
    }
}
