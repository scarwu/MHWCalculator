/**
 * Equips Displayer
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import JewelDataset from 'libraries/dataset/jewel';
import EnhanceDataset from 'libraries/dataset/enhance';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import FunctionalButton from 'components/common/functionalButton';
import SharpnessBar from 'components/common/sharpnessBar';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

/**
 * Handle Functions
 */
const handleEquipsDisplayerRefresh = () => {
    CommonState.setter.cleanRequiredEquipPins();
    CommonState.setter.cleanCurrentEquips();
};

/**
 * Render Functions
 */
const renderEnhanceOption = (equipType, enhanceIndex, enhanceInfo) => {
    let selectorData = {
        equipType: equipType,
        enhanceIndex: enhanceIndex,
        enhanceId: (Helper.isNotEmpty(enhanceInfo)) ? enhanceInfo.id : null
    };

    let emptySelectorData = {
        equipType: equipType,
        enhanceIndex: enhanceIndex,
        enhanceId: null
    };

    if (Helper.isEmpty(enhanceInfo)) {
        return (
            <Fragment key={`${equipType}:${enhanceIndex}`}>
                <div className="col-3 mhwc-name">
                    <span>{_('enhance')}: {enhanceIndex + 1}</span>
                </div>

                <div className="col-9 mhwc-value">
                    <div className="mhwc-icons_bundle">
                        <FunctionalButton
                            iconName="plus" altName={_('add')}
                            onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
                    </div>
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment key={`${equipType}:${enhanceIndex}`}>
            <div className="col-3 mhwc-name">
                <span>{_('enhance')}: {enhanceIndex + 1}</span>
            </div>
            <div className="col-9 mhwc-value">
                <span>{_(enhanceInfo.name)}</span>
                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="exchange" altName={_('change')}
                        onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
                    <FunctionalButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.setCurrentEquip(emptySelectorData)}} />
                </div>
            </div>
        </Fragment>
    );
};

const renderJewelOption = (equipType, slotIndex, slotSize, jewelInfo) => {
    let selectorData = {
        equipType: equipType,
        slotIndex: slotIndex,
        slotSize: slotSize,
        jewelId: (Helper.isNotEmpty(jewelInfo)) ? jewelInfo.id : null
    };

    let emptySelectorData = {
        equipType: equipType,
        slotIndex: slotIndex,
        slotSize: slotSize,
        jewelId: null
    };

    if (Helper.isEmpty(jewelInfo)) {
        return (
            <Fragment key={`${equipType}:${slotIndex}`}>
                <div className="col-3 mhwc-name">
                    <span>{_('slot')}: {slotIndex + 1} [{slotSize}]</span>
                </div>
                <div className="col-9 mhwc-value">
                    <div className="mhwc-icons_bundle">
                        <FunctionalButton
                            iconName="plus" altName={_('add')}
                            onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
                    </div>
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment key={`${equipType}:${slotIndex}`}>
            <div className="col-3 mhwc-name">
                <span>{_('slot')}: {slotIndex + 1} [{slotSize}]</span>
            </div>
            <div className="col-9 mhwc-value">
                <span>[{jewelInfo.size}] {_(jewelInfo.name)}</span>
                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="exchange" altName={_('change')}
                        onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
                    <FunctionalButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.setCurrentEquip(emptySelectorData)}} />
                </div>
            </div>
        </Fragment>
    );
};

const renderWeaponProperties = (equipInfo) => {
    let originalSharpness = null;
    let enhancedSharpness = null;

    if (Helper.isNotEmpty(equipInfo.sharpness)) {
        originalSharpness = Helper.deepCopy(equipInfo.sharpness);
        enhancedSharpness = Helper.deepCopy(equipInfo.sharpness);
        enhancedSharpness.value += 50;
    }

    return (
        <div className="col-12 mhwc-content">
            <div className="col-12 mhwc-name">
                <span>{_('property')}</span>
            </div>
            <div className="col-12 mhwc-content">
                {Helper.isNotEmpty(equipInfo.sharpness) ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_('sharpness')}</span>
                        </div>
                        <div className="col-9 mhwc-value mhwc-sharpness">
                            <SharpnessBar data={originalSharpness} />
                            <SharpnessBar data={enhancedSharpness} />
                        </div>
                    </Fragment>
                ) : false}

                <div className="col-3 mhwc-name">
                    <span>{_('attack')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{equipInfo.attack}</span>
                </div>

                <div className="col-3 mhwc-name">
                    <span>{_('criticalRate')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{equipInfo.criticalRate}%</span>
                </div>

                {(Helper.isNotEmpty(equipInfo.element)
                    && Helper.isNotEmpty(equipInfo.element.attack))
                ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_('element')}: {_(equipInfo.element.attack.type)}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            {equipInfo.element.attack.isHidden ? (
                                <span>({equipInfo.element.attack.value})</span>
                            ) : (
                                <span>{equipInfo.element.attack.value}</span>
                            )}
                        </div>
                    </Fragment>
                ) : false}

                {(Helper.isNotEmpty(equipInfo.element)
                    && Helper.isNotEmpty(equipInfo.element.status))
                ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_('element')}: {_(equipInfo.element.status.type)}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            {equipInfo.element.status.isHidden ? (
                                <span>({equipInfo.element.status.value})</span>
                            ) : (
                                <span>{equipInfo.element.status.value}</span>
                            )}
                        </div>
                    </Fragment>
                ) : false}

                {(Helper.isNotEmpty(equipInfo.elderseal)) ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_('elderseal')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{_(equipInfo.elderseal.affinity)}</span>
                        </div>
                    </Fragment>
                ) : false}

                <div className="col-3 mhwc-name">
                    <span>{_('defense')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{equipInfo.defense}</span>
                </div>
            </div>
        </div>
    );
};

const renderArmorProperties = (equipInfo) => {
    return (
        <div className="col-12 mhwc-content">
            <div className="col-12 mhwc-name">
                <span>{_('property')}</span>
            </div>
            <div className="col-12 mhwc-content">
                <div className="col-3 mhwc-name">
                    <span>{_('defense')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{equipInfo.defense}</span>
                </div>

                {Constant.resistances.map((resistanceType) => {
                    return (
                        <Fragment key={resistanceType}>
                            <div className="col-3 mhwc-name">
                                <span>{_('resistance')}: {_(resistanceType)}</span>
                            </div>
                            <div className="col-3 mhwc-value">
                                <span>{equipInfo.resistance[resistanceType]}</span>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const renderEquipBlock = (equipType, equipInfo, isEquipLock) => {
    let selectorData = {
        equipType: equipType,
        equipId: (Helper.isNotEmpty(equipInfo)) ? equipInfo.id : null
    };

    let emptySelectorData = {
        equipType: equipType,
        equipId: null
    };

    if (Helper.isEmpty(equipInfo)) {
        return (
            <div key={equipType} className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_(equipType)}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalButton
                            iconName="plus" altName={_('add')}
                            onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
                    </div>
                </div>
            </div>
        );
    }

    let setInfo = (Helper.isNotEmpty(equipInfo.set))
        ? SetDataset.getInfo(equipInfo.set.id) : null;

    return (
        <div key={selectorData.equipId} className="mhwc-item mhwc-item-3-step">
            <div className="col-12 mhwc-name">
                <span>{_(equipType)}: {_(equipInfo.name)}</span>
                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName={isEquipLock ? 'lock' : 'unlock-alt'}
                        altName={isEquipLock ? _('unlock') : _('lock')}
                        onClick={() => {CommonState.setter.toggleRequiredEquipPins(equipType)}} />
                    <FunctionalButton
                        iconName="exchange" altName={_('change')}
                        onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
                    <FunctionalButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.setCurrentEquip(emptySelectorData)}} />
                </div>
            </div>

            {(Helper.isNotEmpty(equipInfo.enhances)
                && 0 !== equipInfo.enhances.length)
            ? (
                <div className="col-12 mhwc-content">
                    {equipInfo.enhances.map((data, index) => {
                        return renderEnhanceOption(
                            equipType, index,
                            EnhanceDataset.getInfo(data.id)
                        );
                    })}
                </div>
            ) : false}

            {(Helper.isNotEmpty(equipInfo.slots)
                && 0 !== equipInfo.slots.length)
            ? (
                <div className="col-12 mhwc-content">
                    {equipInfo.slots.map((data, index) => {
                        return renderJewelOption(
                            equipType, index, data.size,
                            JewelDataset.getInfo(data.jewel.id)
                        );
                    })}
                </div>
            ) : false}

            {('weapon' === equipType)
                ? renderWeaponProperties(equipInfo) : false}

            {('weapon' !== equipType && 'charm' !== equipType)
                ? renderArmorProperties(equipInfo) : false}

            {(Helper.isNotEmpty(setInfo)) ? (
                <div className="col-12 mhwc-content">
                    <div className="col-3 mhwc-name">
                        <span>{_('set')}</span>
                    </div>
                    <div className="col-9 mhwc-value">
                        <span>{_(setInfo.name)}</span>
                    </div>
                </div>
            ) : false}

            {(Helper.isNotEmpty(equipInfo.skills)
                && 0 !== equipInfo.skills.length)
            ? (
                <div className="col-12 mhwc-content">
                    <div className="col-12 mhwc-name">
                        <span>{_('skill')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        {equipInfo.skills.sort((skillA, skillB) => {
                            return skillB.level - skillA.level;
                        }).map((data) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            return (Helper.isNotEmpty(skillInfo)) ? (
                                <div key={data.id} className="col-6 mhwc-value">
                                    <span>{_(skillInfo.name)} Lv.{data.level}</span>
                                </div>
                            ) : false;
                        })}
                    </div>
                </div>
            ) : false}
        </div>
    );
};

export default function EquipsDisplayer(props) {

    /**
     * Hooks
     */
    const [stateCurrentEquips, updateCurrentEquips] = useState(CommonState.getter.getCurrentEquips());
    const [stateRequiredEquipPins, updateRequiredEquipPins] = useState(CommonState.getter.getRequiredEquipPins());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateCurrentEquips(CommonState.getter.getCurrentEquips());
            updateRequiredEquipPins(CommonState.getter.getRequiredEquipPins());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const getContent = useMemo(() => {
        let blocks = [];

        blocks.push(renderEquipBlock(
            'weapon',
            CommonDataset.getAppliedWeaponInfo(stateCurrentEquips.weapon),
            stateRequiredEquipPins.weapon
        ));

        ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
            blocks.push(renderEquipBlock(
                equipType,
                CommonDataset.getAppliedArmorInfo(stateCurrentEquips[equipType]),
                stateRequiredEquipPins[equipType]
            ));
        });

        blocks.push(renderEquipBlock(
            'charm',
            CommonDataset.getAppliedCharmInfo(stateCurrentEquips.charm),
            stateRequiredEquipPins.charm
        ));

        return blocks;
    }, [stateCurrentEquips, stateRequiredEquipPins]);

    return (
        <div className="col mhwc-equips">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('equipBundle')}</span>

                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="refresh" altName={_('reset')}
                        onClick={handleEquipsDisplayerRefresh} />
                    <FunctionalButton
                        iconName="th-list" altName={_('bundleList')}
                        onClick={ModalState.setter.showBundleItemSelector} />
                </div>
            </div>

            <div className="mhwc-list">
                {getContent}
            </div>
        </div>
    );
}
