/**
 * Candidate Bundles
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import SkillDataset from 'libraries/dataset/skill';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import IconButton from 'components/common/iconButton';
import IconTab from 'components/common/iconTab';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Variables
let worker = undefined;

/**
 * Handle Functions
 */
const handleBundlePickUp = (bundle) => {
    let equips = Helper.deepCopy(CommonState.getter.getCurrentEquips());
    let slotMap = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    Object.keys(bundle.equips).forEach((equipType) => {
        if (Helper.isEmpty(bundle.equips[equipType])) {
            return;
        }

        if (Helper.isEmpty(equips[equipType])) {
            equips[equipType] = {};
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
        let data = null;

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

    CommonState.setter.replaceCurrentEquips(equips);
};

const handleSwitchTempData = (index) => {
    CommonState.setter.switchTempData('candidateBundles', index);
};

/**
 * Render Functions
 */
const renderBundleItem = (bundle, index, totalIndex, requiredSkillIds) => {
    return (
        <div key={bundle.hash} className="mhwc-item mhwc-item-3-step">
            <div className="col-12 mhwc-name">
                <span>{_('bundle')}: {index + 1} / {totalIndex}</span>
                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="check" altName={_('equip')}
                        onClick={() => {handleBundlePickUp(bundle)}} />
                </div>
            </div>

            {Helper.isNotEmpty(bundle.sortedBy) ? (
                <div className="col-12 mhwc-content">
                    <div className="col-4 mhwc-name">
                        <span>{_(bundle.sortedBy.key + 'Sort')}</span>
                    </div>
                    <div className="col-8 mhwc-value">
                        <span>{bundle.sortedBy.value}</span>
                    </div>
                </div>
            ) : false}

            <div className="col-12 mhwc-content">
                <div className="col-12 mhwc-name">
                    <span>{_('equip')}</span>
                </div>
                <div className="col-12 mhwc-content">
                    {Object.keys(bundle.equips).map((equipType, index) => {
                        if (Helper.isEmpty(bundle.equips[equipType])) {
                            return false;
                        }

                        let equipInfo = null;

                        if ('weapon' === equipType) {
                            equipInfo = WeaponDataset.getInfo(bundle.equips[equipType]);
                        } else if ('helm' === equipType
                            || 'chest' === equipType
                            || 'arm' === equipType
                            || 'waist' === equipType
                            || 'leg' === equipType
                        ) {
                            equipInfo = ArmorDataset.getInfo(bundle.equips[equipType]);
                        } else if ('charm' === equipType) {
                            equipInfo = CharmDataset.getInfo(bundle.equips[equipType]);
                        }

                        return Helper.isNotEmpty(equipInfo) ? (
                            <Fragment key={equipType}>
                                <div className="col-6 mhwc-value">
                                    <span>(R{equipInfo.rare}) {_(equipInfo.name)}</span>
                                </div>
                            </Fragment>
                        ) : false;
                    })}
                </div>
            </div>

            {(0 < bundle.meta.remainingSlotCount.all) ? (
                <div className="col-12 mhwc-content">
                    <div className="col-12 mhwc-name">
                        <span>{_('remainingSlot')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        {Object.keys(bundle.meta.remainingSlotCount).map((slotSize) => {
                            if ('all' === slotSize) {
                                return;
                            }

                            let slotCount = bundle.meta.remainingSlotCount[slotSize];

                            return (slotCount > 0) ? (
                                <div key={slotSize} className="col-4 mhwc-value">
                                    <span>{`[${slotSize}] x ${slotCount}`}</span>
                                </div>
                            ) : false;
                        })}
                    </div>
                </div>
            ) : false}

            {(0 !== Object.keys(bundle.jewels).length) ? (
                <div className="col-12 mhwc-content">
                    <div className="col-12 mhwc-name">
                        <span>{_('jewel')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        {Object.keys(bundle.jewels).sort((jewelIdA, jewelIdB) => {
                            return bundle.jewels[jewelIdB] - bundle.jewels[jewelIdA];
                        }).map((jewelId) => {
                            let jewelCount = bundle.jewels[jewelId];
                            let jewelInfo = JewelDataset.getInfo(jewelId);

                            return (Helper.isNotEmpty(jewelInfo)) ? (
                                <div key={jewelId} className="col-4 mhwc-value">
                                    <span>{`[${jewelInfo.size}] ${_(jewelInfo.name)} x ${jewelCount}`}</span>
                                </div>
                            ) : false;
                        })}
                    </div>
                </div>
            ) : false}

            {(0 !== Object.keys(bundle.skills).length) ? (
                <div className="col-12 mhwc-content">
                    <div className="col-12 mhwc-name">
                        <span>{_('skill')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        {Object.keys(bundle.skills).sort((skillIdA, skillIdB) => {
                            return bundle.skills[skillIdB] - bundle.skills[skillIdA];
                        }).map((skillId) => {
                            let skillCount = bundle.skills[skillId];
                            let skillInfo = SkillDataset.getInfo(skillId);;

                            return (Helper.isNotEmpty(skillInfo)) ? (
                                <div key={skillId} className="col-6 mhwc-value">
                                    <span>{`${_(skillInfo.name)} Lv.${skillCount}`}</span>
                                    {(-1 === requiredSkillIds.indexOf(skillInfo.id)) ? (
                                        <div className="mhwc-icons_bundle">
                                            <IconButton
                                                iconName="arrow-left" altName={_('include')}
                                                onClick={() => {CommonState.setter.addRequiredSkill(skillInfo.id)}} />
                                        </div>
                                    ) : false}
                                </div>
                            ) : false;
                        })}
                    </div>
                </div>
            ) : false}
        </div>
    );
};

/**
 * Sub Components
 */
const BundleList = (props) => {
    const {data} = props;

    /**
     * Hooks
     */
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: CandidateBundles -> BundleList');

        const requiredSkillIds = stateRequiredSkills.map((skill) => {
            return skill.id;
        });

        return data.map((bundle, index) => {
            return renderBundleItem(bundle, index, data.length, requiredSkillIds);
        });
    }, [data, stateRequiredSkills]);
};

const convertTimeFormat = (seconds) => {
    let text = '';

    if (seconds > 3600) {
        let hours = parseInt(seconds / 3600);

        seconds -= hours * 3600;
        text += hours + ' ' + _('hour') + ' ';
    }

    if (seconds > 60) {
        let minutes = parseInt(seconds / 60);

        seconds -= minutes * 60;
        text += minutes + ' ' + _('minute') + ' ';
    }

    text += seconds + ' ' + _('second');

    return text;
};

export default function CandidateBundles(props) {

    /**
     * Hooks
     */
    const [stateTempData, updateTempData] = useState(CommonState.getter.getTempData());
    const [stateComputedBundles, updateComputedBundles] = useState(CommonState.getter.getComputedBundles());
    const [stateIsSearching, updateIsSearching] = useState(false);
    const [stateSearchingTabIndex, updateSearchingTabIndex] = useState(null);
    const [stateBundleCount, updateBundleCount] = useState(0);
    const [stateSearchPercent, updateSearchPercent] = useState(0);
    const [stateTimeRemaining, updateTimeRemaining] = useState(0);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateTempData(CommonState.getter.getTempData());
            updateComputedBundles(CommonState.getter.getComputedBundles());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Search Remaining Timer
    useEffect(() => {
        if (false === stateIsSearching) {
            return;
        }

        let timerId = setInterval(() => {
            if (0 === stateTimeRemaining) {
                return;
            }

            updateTimeRemaining(stateTimeRemaining - 1);
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [stateIsSearching, stateTimeRemaining])

    /**
     * Handle Functions
     */
    const handleCandidateBundlesSearch = useCallback(() => {
        if (undefined !== worker) {
            return;
        }

        let tempData = CommonState.getter.getTempData();
        let requiredSets = CommonState.getter.getRequiredSets();
        let requiredSkills = CommonState.getter.getRequiredSkills();
        let requiredEquipPins = CommonState.getter.getRequiredEquipPins();
        let currentEquips = CommonState.getter.getCurrentEquips();
        let algorithmParams = CommonState.getter.getAlgorithmParams();

        // Create Required Equips
        let requiredEquips = {};

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (false === requiredEquipPins[equipType]) {
                return;
            }

            requiredEquips[equipType] = currentEquips[equipType];
        });

        let currentSearchingTabIndex = tempData.candidateBundles.index;

        updateIsSearching(true);
        updateSearchingTabIndex(currentSearchingTabIndex);
        updateBundleCount(0);
        updateSearchPercent(0);
        updateTimeRemaining(0);

        if (undefined === worker) {
            worker = new Worker('assets/scripts/worker.min.js')
            worker.onmessage = (event) => {
                const action = event.data.action;
                const payload = event.data.payload;

                switch (action) {
                case 'progress':
                    if (Helper.isNotEmpty(payload.bundleCount)) {
                        updateBundleCount(payload.bundleCount);
                    }

                    if (Helper.isNotEmpty(payload.searchPercent)) {
                        updateSearchPercent(payload.searchPercent);
                    }

                    if (Helper.isNotEmpty(payload.timeRemaining)) {
                        updateTimeRemaining(payload.timeRemaining);
                    }

                    break;
                case 'result':
                    handleSwitchTempData(currentSearchingTabIndex);

                    CommonState.setter.saveComputedBundles(payload.computedBundles);

                    worker.terminate();
                    worker = undefined;

                    updateIsSearching(false);
                    updateSearchingTabIndex(null);

                    break;
                default:
                    break;
                }
            };
        }

        worker.postMessage({
            requiredSets: requiredSets,
            requiredSkills: requiredSkills,
            requiredEquips: requiredEquips,
            algorithmParams: algorithmParams
        });
    }, []);

    const handleCandidateBundlesCancel = useCallback(() => {
        worker.terminate();
        worker = undefined;

        updateIsSearching(false);
        updateSearchingTabIndex(null);
    }, []);

    return (
        <div className="col mhwc-bundles">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('candidateBundle')}</span>

                <div className="mhwc-icons_bundle-left">
                    <IconTab
                        iconName={stateSearchingTabIndex === 0 ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 1'}
                        isActive={0 === stateTempData.candidateBundles.index}
                        onClick={() => {handleSwitchTempData(0)}} />
                    <IconTab
                        iconName={stateSearchingTabIndex === 1 ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 2'}
                        isActive={1 === stateTempData.candidateBundles.index}
                        onClick={() => {handleSwitchTempData(1)}} />
                    <IconTab
                        iconName={stateSearchingTabIndex === 2 ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 3'}
                        isActive={2 === stateTempData.candidateBundles.index}
                        onClick={() => {handleSwitchTempData(2)}} />
                </div>

                <div className="mhwc-icons_bundle-right">
                    <IconButton
                        iconName="refresh" altName={_('reset')}
                        onClick={CommonState.setter.cleanComputedBundles} />
                    <IconButton
                        iconName="cog" altName={_('setting')}
                        onClick={ModalState.setter.showAlgorithmSetting} />
                    <IconButton
                        iconName="search" altName={_('search')}
                        onClick={handleCandidateBundlesSearch} />
                </div>
            </div>

            <div key="list" className="mhwc-list">
                {(true === stateIsSearching
                    && stateTempData.candidateBundles.index == stateSearchingTabIndex
                ) ? (
                    <div className="mhwc-item mhwc-item-3-step">
                        <div className="col-12 mhwc-name">
                            <span>{_('searching')} ...</span>
                            <div className="mhwc-icons_bundle">
                                <IconButton
                                    iconName="times" altName={_('cancel')}
                                    onClick={handleCandidateBundlesCancel} />
                            </div>
                        </div>
                        <div className="col-12 mhwc-content">
                            <div className="col-3 mhwc-name">
                                <span>{_('bundleCount')}</span>
                            </div>
                            <div className="col-3 mhwc-value">
                                <span>{stateBundleCount}</span>
                            </div>
                            <div className="col-3 mhwc-name">
                                <span>{_('searchPercent')}</span>
                            </div>
                            <div className="col-3 mhwc-value">
                                <span>{stateSearchPercent} %</span>
                            </div>
                            <div className="col-3 mhwc-name">
                                <span>{_('timeRemaining')}</span>
                            </div>
                            <div className="col-9 mhwc-value">
                                <span>{convertTimeFormat(stateTimeRemaining)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <BundleList data={stateComputedBundles} />
                )}
            </div>
        </div>
    );
}
