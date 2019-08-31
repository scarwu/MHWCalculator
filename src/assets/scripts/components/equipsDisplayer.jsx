'use strict';
/**
 * Equips Displayer
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
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import JewelDataset from 'libraries/dataset/jewel';
import EnhanceDataset from 'libraries/dataset/enhance';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';
import SharpnessBar from 'components/common/sharpnessBar';

// Load Constant
import Constant from 'constant';

export default class EquipsDisplayer extends Component {

    // Default Props
    static defaultProps = {
        equips: Helper.deepCopy(Constant.defaultEquips),
        equipsLock: Helper.deepCopy(Constant.defaultEquipsLock),
        onToggleEquipsLock: (equipType) => {},
        onOpenSelector: (data) => {},
        onPickUp: (data) => {}
    };

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            equips: Helper.deepCopy(Constant.defaultEquips),
            equipsLock: Helper.deepCopy(Constant.defaultEquipsLock)
        };
    }

    /**
     * Handle Functions
     */
    handleEquipLockToggle = (equipType) => {
        this.props.onToggleEquipsLock(equipType);
    };

    handleEquipSwitch = (data) => {
        this.props.onOpenSelector(data);
    };

    handleEquipEmpty = (data) => {
        this.props.onPickUp(data);
    };

    /**
     * Lifecycle Functions
     */
    static getDerivedStateFromProps (nextProps, prevState) {
        return {
            equips: nextProps.equips,
            equipsLock: nextProps.equipsLock
        };
    }

    /**
     * Render Functions
     */
    renderEnhanceOption = (equipType, enhanceIndex, enhanceInfo) => {
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
                <div key={'enhance_' + enhanceIndex} className="row mhwc-enhance">
                    <div className="col-4 mhwc-name">
                        <span>{_('enhance')}: {enhanceIndex + 1}</span>
                    </div>
                    <div className="col-8 mhwc-value">
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="plus" altName={_('add')}
                                onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={'enhance_' + enhanceIndex} className="row mhwc-enhance">
                <div className="col-4 mhwc-name">
                    <span>{_('enhance')}: {enhanceIndex + 1}</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{_(enhanceInfo.name)}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="exchange" altName={_('change')}
                            onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        <FunctionalIcon
                            iconName="times" altName={_('clean')}
                            onClick={() => {this.handleEquipEmpty(emptySelectorData)}} />
                    </div>
                </div>
            </div>
        );
    };

    renderJewelOption = (equipType, slotIndex, slotSize, jewelInfo) => {
        let selectorData = {
            equipType: equipType,
            slotIndex: slotIndex,
            slotSize: slotSize,
            slotId: (Helper.isNotEmpty(jewelInfo)) ? jewelInfo.id : null
        };

        let emptySelectorData = {
            equipType: equipType,
            slotIndex: slotIndex,
            slotSize: slotSize,
            slotId: null
        };

        if (Helper.isEmpty(jewelInfo)) {
            return (
                <div key={'jewel_' + equipType + '_' + slotIndex} className="row mhwc-jewel">
                    <div className="col-4 mhwc-name">
                        <span>{_('slot')}: {slotIndex + 1} [{slotSize}]</span>
                    </div>
                    <div className="col-8 mhwc-value">
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="plus" altName={_('add')}
                                onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={'jewel_' + equipType + '_' + slotIndex} className="row mhwc-jewel">
                <div className="col-4 mhwc-name">
                    <span>{_('slot')}: {slotIndex + 1} [{slotSize}]</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>[{jewelInfo.size}] {_(jewelInfo.name)}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="exchange" altName={_('change')}
                            onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        <FunctionalIcon
                            iconName="times" altName={_('clean')}
                            onClick={() => {this.handleEquipEmpty(emptySelectorData)}} />
                    </div>
                </div>
            </div>
        );
    };

    renderWeaponProperties = (equipInfo) => {
        let originalSharpness = null;
        let enhancedSharpness = null;

        if (Helper.isNotEmpty(equipInfo.sharpness)) {
            originalSharpness = Helper.deepCopy(equipInfo.sharpness);
            enhancedSharpness = Helper.deepCopy(equipInfo.sharpness);
            enhancedSharpness.value += 50;
        }

        return (
            <div className="col-12 mhwc-item mhwc-properties">
                <div className="col-12 mhwc-name">
                    <span>{_('property')}</span>
                </div>
                <div className="col-12 mhwc-value">
                    <div className="row">
                        {(Helper.isNotEmpty(equipInfo.sharpness)) ? [(
                            <div key={'sharpness_1'} className="col-4">
                                <div className="mhwc-name">
                                    <span>{_('sharpness')}</span>
                                </div>
                            </div>
                        ), (
                            <div key={'sharpness_2'} className="col-8">
                                <div className="mhwc-value mhwc-sharpness">
                                    <SharpnessBar data={originalSharpness} />
                                    <SharpnessBar data={enhancedSharpness} />
                                </div>
                            </div>
                        )] : false}

                        <div className="col-4">
                            <div className="mhwc-name">
                                <span>{_('attack')}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="mhwc-value">
                                <span>{equipInfo.attack}</span>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="mhwc-name">
                                <span>{_('criticalRate')}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="mhwc-value">
                                <span>{equipInfo.criticalRate}%</span>
                            </div>
                        </div>

                        {(Helper.isNotEmpty(equipInfo.element)
                            && Helper.isNotEmpty(equipInfo.element.attack))
                        ? [(
                            <div key={'attackElement_1'} className="col-4">
                                <div className="mhwc-name">
                                    <span>{_('element')}: {_(equipInfo.element.attack.type)}</span>
                                </div>
                            </div>
                        ), (
                            <div key={'attackElement_2'} className="col-2">
                                <div className="mhwc-value">
                                    {equipInfo.element.attack.isHidden ? (
                                        <span>({equipInfo.element.attack.value})</span>
                                    ) : (
                                        <span>{equipInfo.element.attack.value}</span>
                                    )}
                                </div>
                            </div>
                        )] : false}

                        {(Helper.isNotEmpty(equipInfo.element)
                            && Helper.isNotEmpty(equipInfo.element.status))
                        ? [(
                            <div key={'statusElement_1'} className="col-4">
                                <div className="mhwc-name">
                                    <span>{_('element')}: {_(equipInfo.element.status.type)}</span>
                                </div>
                            </div>
                        ), (
                            <div key={'statusElement_2'} className="col-2">
                                <div className="mhwc-value">
                                    {equipInfo.element.status.isHidden ? (
                                        <span>({equipInfo.element.status.value})</span>
                                    ) : (
                                        <span>{equipInfo.element.status.value}</span>
                                    )}
                                </div>
                            </div>
                        )] : false}

                        {(Helper.isNotEmpty(equipInfo.elderseal)) ? [(
                            <div key={'elderseal_1'} className="col-4">
                                <div className="mhwc-name">
                                    <span>{_('elderseal')}</span>
                                </div>
                            </div>
                        ), (
                            <div key={'elderseal_2'} className="col-2">
                                <div className="mhwc-value">
                                    <span>{_(equipInfo.elderseal.affinity)}</span>
                                </div>
                            </div>
                        )] : false}

                        <div className="col-4">
                            <div className="mhwc-name">
                                <span>{_('defense')}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="mhwc-value">
                                <span>{equipInfo.defense}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderArmorProperties = (equipInfo) => {
        return (
            <div className="col-12 mhwc-item mhwc-properties">
                <div className="col-12 mhwc-name">
                    <span>{_('property')}</span>
                </div>
                <div className="col-12 mhwc-value">
                    <div className="row">
                        <div className="col-4">
                            <div className="mhwc-name">
                                <span>{_('defense')}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="mhwc-value">
                                <span>{equipInfo.defense}</span>
                            </div>
                        </div>

                        {Constant.resistances.map((resistanceType) => {
                            return [(
                                <div key={resistanceType + '_1'} className="col-4">
                                    <div className="mhwc-name">
                                        <span>{_('resistance')}: {_(resistanceType)}</span>
                                    </div>
                                </div>
                            ),(
                                <div key={resistanceType + '_2'} className="col-2">
                                    <div className="mhwc-value">
                                        <span>{equipInfo.resistance[resistanceType]}</span>
                                    </div>
                                </div>
                            )];
                        })}
                    </div>
                </div>
            </div>
        );
    };

    renderEquipBlock = (equipType, equipInfo, isEquipLock) => {
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
                <div key={'equip_' + equipType} className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <span>{_(equipType)}</span>
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="plus" altName={_('add')}
                                onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        </div>
                    </div>
                </div>
            );
        }

        let setInfo = (Helper.isNotEmpty(equipInfo.set))
            ? SetDataset.getInfo(equipInfo.set.id) : null;

        return (
            <div key={'equip_' + equipType} className="row mhwc-equip">
                <div className="col-12 mhwc-name">
                    <span>{_(equipType)}: {_(equipInfo.name)}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isEquipLock ? 'lock' : 'unlock-alt'}
                            altName={isEquipLock ? _('unlock') : _('lock')}
                            onClick={() => {this.handleEquipLockToggle(equipType)}} />
                        <FunctionalIcon
                            iconName="exchange" altName={_('change')}
                            onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        <FunctionalIcon
                            iconName="times" altName={_('clean')}
                            onClick={() => {this.handleEquipEmpty(emptySelectorData)}} />
                    </div>
                </div>

                {(Helper.isNotEmpty(equipInfo.enhances)
                    && 0 !== equipInfo.enhances.length)
                ? (
                    <div className="col-12 mhwc-item mhwc-enhances">
                        {equipInfo.enhances.map((data, index) => {
                            return this.renderEnhanceOption(
                                equipType, index,
                                EnhanceDataset.getInfo(data.id)
                            );
                        })}
                    </div>
                ) : false}

                {(Helper.isNotEmpty(equipInfo.slots)
                    && 0 !== equipInfo.slots.length)
                ? (
                    <div className="col-12 mhwc-item mhwc-slots">
                        {equipInfo.slots.map((data, index) => {
                            return this.renderJewelOption(
                                equipType, index, data.size,
                                JewelDataset.getInfo(data.jewel.id)
                            );
                        })}
                    </div>
                ) : false}

                {('weapon' === equipType)
                    ? this.renderWeaponProperties(equipInfo) : false}

                {('weapon' !== equipType && 'charm' !== equipType)
                    ? this.renderArmorProperties(equipInfo) : false}

                {(Helper.isNotEmpty(setInfo)) ? (
                    <div className="col-12 mhwc-item mhwc-set">
                        <div className="row">
                            <div className="col-4 mhwc-name">
                                <span>{_('set')}</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{_(setInfo.name)}</span>
                            </div>
                        </div>
                    </div>
                ) : false}

                {(Helper.isNotEmpty(equipInfo.skills)
                    && 0 !== equipInfo.skills.length)
                ? (
                    <div className="col-12 mhwc-item mhwc-skills">
                        <div className="col-12 mhwc-name">
                            <span>{_('skill')}</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            <div className="row">
                                {equipInfo.skills.sort((skillA, skillB) => {
                                    return skillB.level - skillA.level;
                                }).map((data) => {
                                    let skillInfo = SkillDataset.getInfo(data.id);

                                    return (Helper.isNotEmpty(skillInfo)) ? (
                                        <div key={data.id} className="col-6">
                                            <div className="mhwc-value">
                                                <span>{_(skillInfo.name)} Lv.{data.level}</span>
                                            </div>
                                        </div>
                                    ) : false;
                                })}
                            </div>
                        </div>
                    </div>
                ) : false}
            </div>
        );
    };

    render () {
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;
        let ContentBlocks = [];

        ContentBlocks.push(this.renderEquipBlock(
            'weapon',
            CommonDataset.getAppliedWeaponInfo(equips.weapon),
            equipsLock.weapon
        ));

        ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
            ContentBlocks.push(this.renderEquipBlock(
                equipType,
                CommonDataset.getAppliedArmorInfo(equips[equipType]),
                equipsLock[equipType]
            ));
        });

        ContentBlocks.push(this.renderEquipBlock(
            'charm',
            CommonDataset.getAppliedCharmInfo(equips.charm),
            equipsLock.charm
        ));

        return (
            <div className="mhwc-list">
                {ContentBlocks}
            </div>
        );
    }
}
