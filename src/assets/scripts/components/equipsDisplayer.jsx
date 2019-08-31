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
    renderEnhanceBlock = (enhanceIndex, enhanceInfo) => {
        let selectorData = {
            equipType: 'weapon',
            enhanceIndex: enhanceIndex,
            enhanceId: (null !== enhanceInfo) ? enhanceInfo.id : null
        };

        let emptySelectorData = {
            equipType: 'weapon',
            enhanceIndex: enhanceIndex,
            enhanceId: null
        };

        if (null === enhanceInfo) {
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

    renderJewelBlock = (equipType, slotIndex, slotSize, jewelInfo) => {
        let selectorData = {
            equipType: equipType,
            slotIndex: slotIndex,
            slotSize: slotSize,
            slotId: (null !== jewelInfo) ? jewelInfo.id : null
        };

        let emptySelectorData = {
            equipType: equipType,
            slotIndex: slotIndex,
            slotSize: slotSize,
            slotId: null
        };

        if (null === jewelInfo) {
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

    renderWeaponBlock = (weaponInfo, isEquipLock) => {
        let selectorData = {
            equipType: 'weapon',
            equipId: (null !== weaponInfo) ? weaponInfo.id : null
        };

        let emptySelectorData = {
            equipType: 'weapon',
            equipId: null
        };

        if (null === weaponInfo) {
            return (
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <span>{_('weapon')}</span>
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="plus" altName={_('add')}
                                onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        </div>
                    </div>
                </div>
            );
        }

        let originalSharpness = null;
        let enhancedSharpness = null;

        if (null !== weaponInfo.sharpness) {
            originalSharpness = Helper.deepCopy(weaponInfo.sharpness);
            enhancedSharpness = Helper.deepCopy(weaponInfo.sharpness);
            enhancedSharpness.value += 50;
        }

        return (
            <div key="weapon" className="row mhwc-equip">
                <div className="col-12 mhwc-name">
                    <span>{_('weapon')}: {_(weaponInfo.name)}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isEquipLock ? 'lock' : 'unlock-alt'}
                            altName={isEquipLock ? _('unlock') : _('lock')}
                            onClick={() => {this.handleEquipLockToggle('weapon')}} />
                        <FunctionalIcon
                            iconName="exchange" altName={_('change')}
                            onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        <FunctionalIcon
                            iconName="times" altName={_('clean')}
                            onClick={() => {this.handleEquipEmpty(emptySelectorData)}} />
                    </div>
                </div>

                {(0 !== weaponInfo.enhances.length) ? (
                    <div className="col-12 mhwc-item mhwc-enhances">
                        {weaponInfo.enhances.map((data, index) => {
                            return this.renderEnhanceBlock(
                                index,
                                EnhanceDataset.getInfo(data.id)
                            );
                        })}
                    </div>
                ) : false}

                {(null !== weaponInfo.slots && 0 !== weaponInfo.slots.length) ? (
                    <div className="col-12 mhwc-item mhwc-slots">
                        {weaponInfo.slots.map((data, index) => {
                            return this.renderJewelBlock(
                                'weapon', index, data.size,
                                JewelDataset.getInfo(data.jewel.id)
                            );
                        })}
                    </div>
                ) : false}

                <div className="col-12 mhwc-item mhwc-properties">
                    <div className="col-12 mhwc-name">
                        <span>{_('property')}</span>
                    </div>
                    <div className="col-12 mhwc-value">
                        <div className="row">
                            {(null !== weaponInfo.sharpness) ? [(
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
                                    <span>{weaponInfo.attack}</span>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="mhwc-name">
                                    <span>{_('criticalRate')}</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="mhwc-value">
                                    <span>{weaponInfo.criticalRate}%</span>
                                </div>
                            </div>

                            {(null !== weaponInfo.element.attack) ? [(
                                <div key={'attackElement_1'} className="col-4">
                                    <div className="mhwc-name">
                                        <span>{_('element')}: {_(weaponInfo.element.attack.type)}</span>
                                    </div>
                                </div>
                            ), (
                                <div key={'attackElement_2'} className="col-2">
                                    <div className="mhwc-value">
                                        {weaponInfo.element.attack.isHidden ? (
                                            <span>({weaponInfo.element.attack.value})</span>
                                        ) : (
                                            <span>{weaponInfo.element.attack.value}</span>
                                        )}
                                    </div>
                                </div>
                            )] : false}

                            {(null !== weaponInfo.element.status) ? [(
                                <div key={'statusElement_1'} className="col-4">
                                    <div className="mhwc-name">
                                        <span>{_('element')}: {_(weaponInfo.element.status.type)}</span>
                                    </div>
                                </div>
                            ), (
                                <div key={'statusElement_2'} className="col-2">
                                    <div className="mhwc-value">
                                        {weaponInfo.element.status.isHidden ? (
                                            <span>({weaponInfo.element.status.value})</span>
                                        ) : (
                                            <span>{weaponInfo.element.status.value}</span>
                                        )}
                                    </div>
                                </div>
                            )] : false}

                            {(null !== weaponInfo.elderseal) ? [(
                                <div key={'elderseal_1'} className="col-4">
                                    <div className="mhwc-name">
                                        <span>{_('elderseal')}</span>
                                    </div>
                                </div>
                            ), (
                                <div key={'elderseal_2'} className="col-2">
                                    <div className="mhwc-value">
                                        <span>{_(weaponInfo.elderseal.affinity)}</span>
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
                                    <span>{weaponInfo.defense}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {(0 !== weaponInfo.skills.length) ? (
                    <div className="col-12 mhwc-item mhwc-skills">
                        <div className="col-12 mhwc-name">
                            <span>{_('skill')}</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            <div className="row">
                                {weaponInfo.skills.sort((skillA, skillB) => {
                                    return skillB.level - skillA.level;
                                }).map((data) => {
                                    let skillInfo = SkillDataset.getInfo(data.id);

                                    return (null !== skillInfo) ? (
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

    renderArmorBlock = (equipType, armorInfo, isEquipLock) => {
        let selectorData = {
            equipType: equipType,
            equipId: (null !== armorInfo) ? armorInfo.id : null
        };

        let emptySelectorData = {
            equipType: equipType,
            equipId: null
        };

        if (null === armorInfo) {
            return (
                <div key={'armor_' + equipType} className="row mhwc-equip">
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

        let setInfo = (null !== armorInfo.set)
            ? SetDataset.getInfo(armorInfo.set.id) : null;

        return (
            <div key={'armor_' + equipType} className="row mhwc-equip">
                <div className="col-12 mhwc-name">
                    <span>{_(equipType)}: {_(armorInfo.name)}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isEquipLock ? 'lock' : 'unlock-alt'}
                            altName={isEquipLock ? _('unlock') : _('unlock')}
                            onClick={() => {this.handleEquipLockToggle(equipType)}} />
                        <FunctionalIcon
                            iconName="exchange" altName={_('change')}
                            onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        <FunctionalIcon
                            iconName="times" altName={_('clean')}
                            onClick={() => {this.handleEquipEmpty(emptySelectorData)}} />
                    </div>
                </div>

                {(0 !== armorInfo.slots.length) ? (
                    <div className="col-12 mhwc-item mhwc-slots">
                        {armorInfo.slots.map((data, index) => {
                            return this.renderJewelBlock(
                                equipType, index, data.size,
                                JewelDataset.getInfo(data.jewel.id)
                            );
                        })}
                    </div>
                ) : false}

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
                                    <span>{armorInfo.defense}</span>
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
                                            <span>{armorInfo.resistance[resistanceType]}</span>
                                        </div>
                                    </div>
                                )];
                            })}
                        </div>
                    </div>
                </div>

                {(null !== setInfo) ? (
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

                {(0 !== armorInfo.skills.length) ? (
                    <div className="col-12 mhwc-item mhwc-skills">
                        <div className="col-12 mhwc-name">
                            <span>{_('skill')}</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            <div className="row">
                                {armorInfo.skills.sort((skillA, skillB) => {
                                    return skillB.level - skillA.level;
                                }).map((data) => {
                                    let skillInfo = SkillDataset.getInfo(data.id);

                                    return (null !== skillInfo) ? (
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

    renderCharmBlock = (charmInfo, isEquipLock) => {
        let selectorData = {
            equipType: 'charm',
            equipId: (null !== charmInfo) ? charmInfo.id : null
        };

        let emptySelectorData = {
            equipType: 'charm',
            equipId: null
        };

        if (null === charmInfo) {
            return (
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <span>{_('charm')}</span>
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
            <div key="charm" className="row mhwc-equip">
                <div className="col-12 mhwc-name">
                    <span>{_('charm')}: {_(charmInfo.name)}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isEquipLock ? 'lock' : 'unlock-alt'}
                            altName={isEquipLock ? _('unlock') : _('lock')}
                            onClick={() => {this.handleEquipLockToggle('charm')}} />
                        <FunctionalIcon
                            iconName="exchange" altName={_('change')}
                            onClick={() => {this.handleEquipSwitch(selectorData)}} />
                        <FunctionalIcon
                            iconName="times" altName={_('clean')}
                            onClick={() => {this.handleEquipEmpty(emptySelectorData)}} />
                    </div>
                </div>

                <div className="col-12 mhwc-item mhwc-skills">
                    <div className="col-12 mhwc-name">
                        <span>{_('skill')}</span>
                    </div>
                    <div className="col-12 mhwc-value">
                        <div className="row">
                            {charmInfo.skills.sort((skillA, skillB) => {
                                return skillB.level - skillA.level;
                            }).map((data) => {
                                let skillInfo = SkillDataset.getInfo(data.id);

                                return (null !== skillInfo) ? (
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
            </div>
        );
    };

    render () {
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;
        let ContentBlocks = [];

        ContentBlocks.push(this.renderWeaponBlock(
            CommonDataset.getAppliedWeaponInfo(equips.weapon),
            equipsLock.weapon
        ));

        ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
            ContentBlocks.push(this.renderArmorBlock(
                equipType,
                CommonDataset.getAppliedArmorInfo(equips[equipType]),
                equipsLock[equipType]
            ));
        });

        ContentBlocks.push(this.renderCharmBlock(
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
