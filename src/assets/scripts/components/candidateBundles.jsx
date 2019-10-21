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
import FunctionalButton from 'components/common/functionalButton';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Load Worker
const worker = new Worker('assets/scripts/worker.min.js');

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

/**
 * Render Functions
 */
const renderBundleItem = (bundle, index, totalIndex) => {
    return (
        <div key={bundle.hash} className="mhwc-item mhwc-item-3-step">
            <div className="col-12 mhwc-name">
                <span>{_('bundle')}: {index + 1} / {totalIndex}</span>
                <div className="mhwc-icons_bundle">
                    <FunctionalButton
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
                                    <span>{_(equipInfo.name)}</span>
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
    const requiredSkills = CommonState.getter.getRequiredSkills();



    return useMemo(() => {
        Helper.log('Component: CandidateBundles -> BundleList');

        return data.map((bundle, index) => {
            return renderBundleItem(bundle, index, data.length);
        });
    }, [data]);
};

export default function CandidateBundles(props) {

    /**
     * Hooks
     */
    const [stateComputedBundles, updateComputedBundles] = useState(CommonState.getter.getComputedBundles());
    const [stateIsSearching, updateIsSearching] = useState(false);
    const [stateBundleCount, updateBundleCount] = useState(0);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateComputedBundles(CommonState.getter.getComputedBundles());
        });

        worker.onmessage = (e) => {
            let action = e.data.action;
            let payload = e.data.payload;

            switch (action) {
            case 'progress':
                updateBundleCount(payload.bundleCount);

                break;
            case 'result':
                CommonState.setter.saveComputedBundles(payload.computedBundles);

                updateIsSearching(false);

                break;
            default:
                break;
            }
        };

        return () => {
            unsubscribe();
            worker.terminate();
        };
    }, []);

    /**
     * Handle Functions
     */
    const handleCandidateBundlesSearch = useCallback(() => {
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

        updateIsSearching(true);
        updateBundleCount(0);

        worker.postMessage({
            action: 'search',
            payload: {
                requiredSets: requiredSets,
                requiredSkills: requiredSkills,
                requiredEquips: requiredEquips,
                algorithmParams: algorithmParams
            }
        });
    }, []);

    return (
        <div className="col mhwc-bundles">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('candidateBundle')}</span>

                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="refresh" altName={_('reset')}
                        onClick={CommonState.setter.cleanComputedBundles} />
                    <FunctionalButton
                        iconName="cog" altName={_('setting')}
                        onClick={ModalState.setter.showAlgorithmSetting} />
                    <FunctionalButton
                        iconName="search" altName={_('search')}
                        onClick={handleCandidateBundlesSearch} />
                </div>
            </div>

            <div key="list" className="mhwc-list">
                {true === stateIsSearching ? (
                    <div className="mhwc-loading">
                        <i className="fa fa-spin fa-spinner"></i>
                    </div>
                ) : false}

                <BundleList data={stateComputedBundles} />
            </div>
        </div>
    );
}
