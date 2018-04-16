'use strict';
/**
 * Equipments Displayer
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
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class EquipsDisplayer extends Component {

    // Default Props
    static defaultProps = {
        equips: Misc.deepCopy(Constant.defaultEquips),
        onOpenSelector: (data) => {},
        onPickup: (data) => {}
    };

    // Initial State
    state = {
        equips: Misc.deepCopy(Constant.defaultEquips)
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

    handleEquipSwitch = (data) => {
        this.props.onOpenSelector(data);
    };

    handleEquipEmpty = (data) => {
        this.props.onPickup(data);
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
            equips: nextProps.equips
        });
    }

    /**
     * Render Functions
     */
    render () {
        let equips = this.state.equips;
        let ContentBlocks = [];

        // Weapon
        let weaponSelectorData = {
            equipType: 'weapon',
            equipKey: null
        };

        if (null !== equips.weapon) {
            let weaponInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);

            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a onClick={() => {this.handleEquipSwitch(weaponSelectorData)}}>
                            <span>{weaponInfo.name}</span>
                        </a>

                        <a onClick={() => {this.handleEquipLockToggle('weapon')}}>
                            {equips.weapon.isLock ? (
                                <i className="fa fa-lock"></i>
                            ) : (
                                <i className="fa fa-unlock-alt"></i>
                            )}
                        </a>
                        <a onClick={() => {this.handleEquipEmpty(weaponSelectorData)}}>
                            <span><i className="fa fa-times"></i></span>
                        </a>
                    </div>

                    {0 !== weaponInfo.enhances.length ? (
                        <div className="col-12 mhwc-enhances">
                            {weaponInfo.enhances.map((data, index) => {
                                let enhanceSelectorData = {
                                    equipType: 'weapon',
                                    enhanceIndex: index,
                                    enhanceKey: null
                                };

                                return (
                                    <div key={data.key + '_' + index} className="row mhwc-enhance">
                                        <div className="col-4 mhwc-name">
                                            <span>強化 {index + 1}</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            <a onClick={() => {this.handleEquipSwitch(enhanceSelectorData)}}>
                                                {null !== data.key ? (
                                                    <span>{data.key}</span>
                                                ) : (
                                                    <span><i className="fa fa-plus"></i></span>
                                                )}
                                            </a>

                                            {null !== data.key ? (
                                                <a onClick={() => {this.handleEquipEmpty(enhanceSelectorData)}}>
                                                    <span><i className="fa fa-times"></i></span>
                                                </a>
                                            ) : false}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : false}

                    {0 !== weaponInfo.slots.length ? (
                        <div className="col-12 mhwc-slots">
                            {weaponInfo.slots.map((data, index) => {
                                let jewelSelectorData = {
                                    equipType: 'weapon',
                                    slotSize: data.size,
                                    slotIndex: index,
                                    slotKey: null
                                };

                                return (
                                    <div key={data.key + '_' + index} className="row mhwc-jewel">
                                        <div className="col-4 mhwc-name">
                                            <span>插槽 {index + 1} - [{data.size}]</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            <a onClick={() => {this.handleEquipSwitch(jewelSelectorData)}}>
                                                {null !== data.key ? (
                                                    <span>[{data.size}] {data.key}</span>
                                                ) : (
                                                    <span><i className="fa fa-plus"></i></span>
                                                )}
                                            </a>

                                            {null !== data.key ? (
                                                <a onClick={() => {this.handleEquipEmpty(jewelSelectorData)}}>
                                                    <span><i className="fa fa-times"></i></span>
                                                </a>
                                            ) : false}
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
                        <a onClick={() => {this.handleEquipSwitch(weaponSelectorData)}}>
                            <span><i className="fa fa-plus"></i></span>
                        </a>
                    </div>
                </div>
            ));
        }

        // Armors
        ['helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            let equipSelectorData = {
                equipType: equipType,
                equipKey: null
            };

            if (null !== equips[equipType]) {
                let equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            <a onClick={() => {this.handleEquipSwitch(equipSelectorData)}}>
                                <span>{equipInfo.name}</span>
                            </a>

                            <a onClick={() => {this.handleEquipLockToggle(equipType)}}>
                                {equips[equipType].isLock ? (
                                    <i className="fa fa-lock"></i>
                                ) : (
                                    <i className="fa fa-unlock-alt"></i>
                                )}
                            </a>
                            <a onClick={() => {this.handleEquipEmpty(equipSelectorData)}}>
                                <span><i className="fa fa-times"></i></span>
                            </a>
                        </div>

                        {0 !== equipInfo.slots.length ? (
                            <div className="col-12 mhwc-slots">
                                {equipInfo.slots.map((data, index) => {
                                    let jewelSelectorData = {
                                        equipType: equipType,
                                        slotSize: data.size,
                                        slotIndex: index,
                                        slotKey: null
                                    };

                                    return (
                                        <div key={data.key + '_' + index} className="row mhwc-jewel">
                                            <div className="col-4 mhwc-name">
                                                <span>插槽 {index + 1} - [{data.size}]</span>
                                            </div>
                                            <div className="col-8 mhwc-value">
                                                <a onClick={() => {this.handleEquipSwitch(jewelSelectorData)}}>
                                                    {null !== data.key ? (
                                                        <span>[{data.size}] {data.key}</span>
                                                    ) : (
                                                        <span><i className="fa fa-plus"></i></span>
                                                    )}
                                                </a>

                                                {null !== data.key ? (
                                                    <a onClick={() => {this.handleEquipEmpty(jewelSelectorData)}}>
                                                        <span><i className="fa fa-times"></i></span>
                                                    </a>
                                                ) : false}
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
                            <a onClick={() => {this.handleEquipSwitch(equipSelectorData)}}>
                                <span><i className="fa fa-plus"></i></span>
                            </a>
                        </div>
                    </div>
                ));
            }
        });

        // Charm
        let charmSelectorData = {
            equipType: 'charm',
            equipKey: null
        };

        if (null !== equips.charm) {
            let charmInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a onClick={() => {this.handleEquipSwitch(charmSelectorData)}}>
                            <span>{charmInfo.name}</span>
                        </a>

                        <a onClick={() => {this.handleEquipLockToggle('charm')}}>
                            {equips.charm.isLock ? (
                                <i className="fa fa-lock"></i>
                            ) : (
                                <i className="fa fa-unlock-alt"></i>
                            )}
                        </a>
                        <a onClick={() => {this.handleEquipEmpty(charmSelectorData)}}>
                            <span><i className="fa fa-times"></i></span>
                        </a>
                    </div>
                </div>
            ));
        } else {
            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a onClick={() => {this.handleEquipSwitch(charmSelectorData)}}>
                            <span><i className="fa fa-plus"></i></span>
                        </a>
                    </div>
                </div>
            ));
        }

        return ContentBlocks;
    }
}
