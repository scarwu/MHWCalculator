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

// Load Core Libraries
import Event from 'core/event';

// Load Custom Libraries
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class EquipsDisplayer extends Component {

    // Default Props
    static defaultProps = {
        equips: Constant.defaultEquips
    };

    // Initial State
    state = {
        equips: Constant.defaultEquips
    };

    /**
     * Handle Functions
     */
    handleEquipLockToggle = (equipType) => {
        let equips = this.state.equips;

        equips[equipType].isLock = !equips[equipType].isLock;

        this.setState({
            equips: equips
        });
    };

    handleEquipSwitch = (equipType) => {
        console.log('EquipSwitch', equipType);
    };

    handleEquipSlotSwitch = (equipType, index) => {
        console.log('EquipSlotSwitch', equipType, index);
    };

    handleWeaponEnhanceSwitch = (index) => {
        console.log('WeaponEnhanceSwitch', index);
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: this.props.equips
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            equips: this.props.equips
        });
    }

    /**
     * Render Functions
     */
    render () {
        let equips = this.state.equips;
        let ContentBlocks = [];

        console.log(DataSet.weaponHelper.getApplyedInfo(equips.weapon));
        console.log(DataSet.armorHelper.getApplyedInfo(equips.helm));
        console.log(DataSet.armorHelper.getApplyedInfo(equips.chest));
        console.log(DataSet.armorHelper.getApplyedInfo(equips.arm));
        console.log(DataSet.armorHelper.getApplyedInfo(equips.waist));
        console.log(DataSet.armorHelper.getApplyedInfo(equips.leg));
        console.log(DataSet.charmHelper.getApplyedInfo(equips.charm));

        // Weapon
        if (null !== equips.weapon) {
            let weaponInfo = DataSet.weaponHelper.getInfo(equips.weapon.key);
            let weaponEnhances = null;

            if (8 === weaponInfo.rare) {
                weaponEnhances = [...Array(1).keys()];
            } else if (7 === weaponInfo.rare) {
                weaponEnhances = [...Array(2).keys()];
            } else if (6 === weaponInfo.rare) {
                weaponEnhances = [...Array(3).keys()];
            }

            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        {equips.weapon.isLock ? (
                            <a className="fa fa-lock" onClick={() => {this.handleEquipLockToggle('weapon')}}></a>
                        ) : (
                            <a className="fa fa-unlock-alt" onClick={() => {this.handleEquipLockToggle('weapon')}}></a>
                        )}
                        &nbsp;
                        <span>{weaponInfo.name}</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('weapon')}}></a>
                    </div>

                    {null !== weaponEnhances ? (
                        <div className="col-12 mhwc-enhances">
                            {weaponEnhances.map((data, index) => {
                                let enhance = null;

                                if (null !== equips.weapon.enhanceKeys
                                    && null !== equips.weapon.enhanceKeys[index]) {

                                    enhance = DataSet.enhanceHelper.getInfo(equips.weapon.enhanceKeys[index]);
                                }

                                return (
                                    <div key={data.key + '_' + index} className="row mhwc-enhance">
                                        <div className="col-4 mhwc-name">
                                            <span>強化 {index + 1}</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            {null !== enhance ? (
                                                <span>{enhance.name}</span>
                                            ) : (
                                                <span>&nbsp;-&nbsp;</span>
                                            )}

                                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleWeaponEnhanceSwitch(index)}}></a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : false}

                    {null !== equips.weapon.slotKeys ? (
                        <div className="col-12 mhwc-slots">
                            {weaponInfo.slots.sort((a, b) => {
                                return a.size < b.size;
                            }).map((data, index) => {
                                let jewel = null;

                                if (null !== equips.weapon.slotKeys
                                    && null !== equips.weapon.slotKeys[index]) {

                                    jewel = DataSet.jewelHelper.getInfo(equips.weapon.slotKeys[index]);
                                }

                                return (
                                    <div key={data.key + '_' + index} className="row mhwc-jewel">
                                        <div className="col-4 mhwc-name">
                                            <span>插槽 {index + 1} - [{data.size}]</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            {null !== jewel ? (
                                                <span>[{jewel.size}] {jewel.name}</span>
                                            ) : (
                                                <span>&nbsp;-&nbsp;</span>
                                            )}

                                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSlotSwitch('weapon', index)}}></a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : false}
                </div>
            ));
        } else {
            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <span>&nbsp;-&nbsp;</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('weapon')}}></a>
                    </div>
                </div>
            ));
        }

        // Armors
        ['helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            if (null !== equips[equipType]) {
                let equipInfo = DataSet.armorHelper.getInfo(equips[equipType].key);

                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            {equips[equipType].isLock ? (
                                <a className="fa fa-lock" onClick={() => {this.handleEquipLockToggle(equipType)}}></a>
                            ) : (
                                <a className="fa fa-unlock-alt" onClick={() => {this.handleEquipLockToggle(equipType)}}></a>
                            )}
                            &nbsp;
                            <span>{equipInfo.name}</span>

                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch(equipType)}}></a>
                        </div>

                        {null !== equips[equipType].slotKeys ? (
                            <div className="col-12 mhwc-slots">
                                {equipInfo.slots.sort((a, b) => {
                                    return a.size < b.size;
                                }).map((data, index) => {
                                    let jewel = null;

                                    if (null !== equips[equipType].slotKeys
                                        && null !== equips[equipType].slotKeys[index]) {

                                        jewel = DataSet.jewelHelper.getInfo(equips[equipType].slotKeys[index])
                                    }

                                    return (
                                        <div key={data.key + '_' + index} className="row mhwc-jewel">
                                            <div className="col-4 mhwc-name">
                                                <span>插槽 {index + 1} - [{data.size}]</span>
                                            </div>
                                            <div className="col-8 mhwc-value">
                                                {null !== jewel ? (
                                                    <span>[{jewel.size}] {jewel.name}</span>
                                                ) : (
                                                    <span>&nbsp;-&nbsp;</span>
                                                )}

                                                <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSlotSwitch(equipType, index)}}></a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : false}
                    </div>
                ) );
            } else {
                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            <span>&nbsp;-&nbsp;</span>

                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch(equipType)}}></a>
                        </div>
                    </div>
                ));
            }
        });

        // Charm
        if (null !== equips.charm) {
            let charmInfo = DataSet.charmHelper.getInfo(equips.charm.key);

            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        {equips.charm.isLock ? (
                            <a className="fa fa-lock" onClick={() => {this.handleEquipLockToggle('charm')}}></a>
                        ) : (
                            <a className="fa fa-unlock-alt" onClick={() => {this.handleEquipLockToggle('charm')}}></a>
                        )}
                        &nbsp;
                        <span>{charmInfo.name}</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('charm')}}></a>
                    </div>
                </div>
            ));
        } else {
            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <span>&nbsp;-&nbsp;</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('charm')}}></a>
                    </div>
                </div>
            ));
        }

        return ContentBlocks;
    }
}
