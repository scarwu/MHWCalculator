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
        equipsLock: Misc.deepCopy(Constant.defaultEquipsLock),
        onToggleEquipsLock: (equipType) => {},
        onOpenSelector: (data) => {},
        onPickup: (data) => {}
    };

    // Initial State
    state = {
        equips: Misc.deepCopy(Constant.defaultEquips),
        equipsLock: Misc.deepCopy(Constant.defaultEquipsLock)
    };

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
        this.props.onPickup(data);
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: this.props.equips,
            equipsLock: this.props.equipsLock
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            equips: nextProps.equips,
            equipsLock: nextProps.equipsLock
        });
    }

    /**
     * Render Functions
     */
    renderSharpnessBar = (data) => {
        return (
            <div className="mhwc-bar">
                <div className="mhwc-steps">
                    {['red', 'orange', 'yellow', 'green', 'blue', 'white'].map((step) => {
                        return (
                            <div key={'sharpness_' + step} className="mhwc-step" style={{
                                width: (data.steps[step] / 4) + '%'
                            }}></div>
                        );
                    })}
                </div>

                <div className="mhwc-mask" style={{
                    width: ((400 - data.value) / 4) + '%'
                }}></div>
            </div>
        );
    };

    render () {
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;
        let ContentBlocks = [];

        // Weapon
        let weaponSelectorData = {
            equipType: 'weapon',
            equipName: null
        };

        if (null !== equips.weapon.name) {
            let weaponInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);

            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a className="mhwc-equip_name" onClick={() => {this.handleEquipSwitch(weaponSelectorData)}}>
                            <span>{Lang['weapon']} - {weaponInfo.name}</span>
                        </a>

                        <a className="mhwc-icon" onClick={() => {this.handleEquipEmpty(weaponSelectorData)}}>
                            <i className="fa fa-times"></i>
                        </a>
                        <a className="mhwc-icon" onClick={() => {this.handleEquipLockToggle('weapon')}}>
                            {equipsLock.weapon ? (
                                <i className="fa fa-lock"></i>
                            ) : (
                                <i className="fa fa-unlock-alt"></i>
                            )}
                        </a>
                    </div>

                    {0 !== weaponInfo.enhances.length ? (
                        <div className="col-12 mhwc-item mhwc-enhances">
                            {weaponInfo.enhances.map((data, index) => {
                                let enhanceSelectorData = {
                                    equipType: 'weapon',
                                    enhanceIndex: index,
                                    enhanceName: null
                                };

                                return (
                                    <div key={data.name + '_' + index} className="row mhwc-enhance">
                                        <div className="col-4 mhwc-name">
                                            <span>強化 {index + 1}</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            <a onClick={() => {this.handleEquipSwitch(enhanceSelectorData)}}>
                                                {null !== data.name ? (
                                                    <span>{data.name}</span>
                                                ) : (
                                                    <span>---</span>
                                                )}
                                            </a>

                                            {null !== data.name ? (
                                                <a className="mhwc-icon" onClick={() => {this.handleEquipEmpty(enhanceSelectorData)}}>
                                                    <i className="fa fa-times"></i>
                                                </a>
                                            ) : false}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : false}

                    {0 !== weaponInfo.slots.length ? (
                        <div className="col-12 mhwc-item mhwc-slots">
                            {weaponInfo.slots.map((data, index) => {
                                let jewelSelectorData = {
                                    equipType: 'weapon',
                                    slotSize: data.size,
                                    slotIndex: index,
                                    slotName: null
                                };

                                return (
                                    <div key={data.name + '_' + index} className="row mhwc-jewel">
                                        <div className="col-4 mhwc-name">
                                            <span>插槽 {index + 1} - [{data.size}]</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            <a onClick={() => {this.handleEquipSwitch(jewelSelectorData)}}>
                                                {null !== data.jewel.name ? (
                                                    <span>[{data.jewel.size}] {data.jewel.name}</span>
                                                ) : (
                                                    <span>---</span>
                                                )}
                                            </a>

                                            {null !== data.name ? (
                                                <a className="mhwc-icon" onClick={() => {this.handleEquipEmpty(jewelSelectorData)}}>
                                                    <i className="fa fa-times"></i>
                                                </a>
                                            ) : false}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : false}

                    <div className="col-12 mhwc-item mhwc-properties">
                        <div className="col-12 mhwc-name">
                            <span>數值</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            <div className="row">
                                <div className="col-4 mhwc-name">
                                    <span>攻擊力</span>
                                </div>
                                <div className="col-8 mhwc-value">
                                    <span>{weaponInfo.attack}</span>
                                </div>
                            </div>

                            {(null !== weaponInfo.sharpness) ? (
                                <div className="row mhwc-sharpness">
                                    <div className="col-4 mhwc-name">
                                        <span>銳利度</span>
                                    </div>
                                    <div className="col-8 mhwc-value">
                                        {this.renderSharpnessBar(weaponInfo.sharpness)}
                                    </div>
                                </div>
                            ) : false}

                            <div className="row">
                                <div className="col-4 mhwc-name">
                                    <span>會心率</span>
                                </div>
                                <div className="col-8 mhwc-value">
                                    <span>{weaponInfo.criticalRate}%</span>
                                </div>
                            </div>

                            {(null !== weaponInfo.element.attack) ? (
                                <div className="row">
                                    <div className="col-4 mhwc-name">
                                        <span>{Lang[weaponInfo.element.attack.type]}屬性</span>
                                    </div>
                                    <div className="col-8 mhwc-value">
                                        {weaponInfo.element.attack.isHidden ? (
                                            <span>({weaponInfo.element.attack.value})</span>
                                        ) : (
                                            <span>{weaponInfo.element.attack.value}</span>
                                        )}
                                    </div>
                                </div>
                            ) : false}

                            {(null !== weaponInfo.element.status) ? (
                                <div className="row">
                                    <div className="col-4 mhwc-name">
                                        <span>{Lang[weaponInfo.element.status.type]}屬性</span>
                                    </div>
                                    <div className="col-8 mhwc-value">
                                        {weaponInfo.element.status.isHidden ? (
                                            <span>({weaponInfo.element.status.value})</span>
                                        ) : (
                                            <span>{weaponInfo.element.status.value}</span>
                                        )}
                                    </div>
                                </div>
                            ) : false}

                            {(null !== weaponInfo.elderseal) ? (
                                <div className="row">
                                    <div className="col-4 mhwc-name">
                                        <span>龍封力</span>
                                    </div>
                                    <div className="col-8 mhwc-value">
                                        <span>{Lang[weaponInfo.elderseal.affinity]}</span>
                                    </div>
                                </div>
                            ) : false}

                            <div className="row">
                                <div className="col-4 mhwc-name">
                                    <span>防禦力</span>
                                </div>
                                <div className="col-8 mhwc-value">
                                    <span>{weaponInfo.defense}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {0 !== weaponInfo.skills.length ? (
                        <div className="col-12 mhwc-skills">
                            <div className="col-12 mhwc-name">
                                <span>技能</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                {weaponInfo.skills.sort((a, b) => {
                                    return b.level - a.level;
                                }).map((data) => {
                                    return (
                                        <div key={data.name} className="row mhwc-skill">
                                            <div className="col-12 mhwc-name">
                                                <span>{data.name} Lv.{data.level}</span>
                                            </div>
                                            <div className="col-12 mhwc-value">
                                                <span>{data.description}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : false}
                </div>
            ));
        } else {
            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a onClick={() => {this.handleEquipSwitch(weaponSelectorData)}}>
                            <span>{Lang['weapon']} ---</span>
                        </a>
                    </div>
                </div>
            ));
        }

        // Armors
        ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
            let equipSelectorData = {
                equipType: equipType,
                equipName: null
            };

            if (null !== equips[equipType].name) {
                let equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            <a className="mhwc-equip_name" onClick={() => {this.handleEquipSwitch(equipSelectorData)}}>
                                <span>{Lang[equipType]} - {equipInfo.name}</span>
                            </a>

                            <a className="mhwc-icon" onClick={() => {this.handleEquipEmpty(equipSelectorData)}}>
                                <i className="fa fa-times"></i>
                            </a>
                            <a className="mhwc-icon" onClick={() => {this.handleEquipLockToggle(equipType)}}>
                                {equipsLock[equipType] ? (
                                    <i className="fa fa-lock"></i>
                                ) : (
                                    <i className="fa fa-unlock-alt"></i>
                                )}
                            </a>
                        </div>

                        {0 !== equipInfo.slots.length ? (
                            <div className="col-12 mhwc-item mhwc-slots">
                                {equipInfo.slots.map((data, index) => {
                                    let jewelSelectorData = {
                                        equipType: equipType,
                                        slotSize: data.size,
                                        slotIndex: index,
                                        slotName: null
                                    };

                                    return (
                                        <div key={data.name + '_' + index} className="row mhwc-jewel">
                                            <div className="col-4 mhwc-name">
                                                <span>插槽 {index + 1} - [{data.size}]</span>
                                            </div>
                                            <div className="col-8 mhwc-value">
                                                <a onClick={() => {this.handleEquipSwitch(jewelSelectorData)}}>
                                                    {null !== data.jewel.name ? (
                                                        <span>[{data.jewel.size}] {data.jewel.name}</span>
                                                    ) : (
                                                        <span>---</span>
                                                    )}
                                                </a>

                                                {null !== data.name ? (
                                                    <a className="mhwc-icon" onClick={() => {this.handleEquipEmpty(jewelSelectorData)}}>
                                                        <i className="fa fa-times"></i>
                                                    </a>
                                                ) : false}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : false}

                        <div className="col-12 mhwc-item mhwc-properties">
                            <div className="col-12 mhwc-name">
                                <span>數值</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                <div className="row mhwc-defense">
                                    <div className="col-4 mhwc-name">
                                        <span>防禦力</span>
                                    </div>
                                    <div className="col-8 mhwc-value">
                                        <span>{equipInfo.defense}</span>
                                    </div>
                                </div>

                                {Constant.elements.map((elementType) => {
                                    return (
                                        <div key={elementType} className="row mhwc-resistance">
                                            <div className="col-4 mhwc-name">
                                                <span>{Lang[elementType]}抗性</span>
                                            </div>
                                            <div className="col-8 mhwc-value">
                                                <span>{equipInfo.resistance[elementType]}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {null !== equipInfo.set ? (
                            <div className="col-12 mhwc-item mhwc-set">
                                <div className="row">
                                    <div className="col-4 mhwc-name">
                                        <span>套裝</span>
                                    </div>
                                    <div className="col-8 mhwc-value">
                                        <span>{equipInfo.set.name}</span>
                                    </div>
                                </div>
                            </div>
                        ) : false}

                        {0 !== equipInfo.skills.length ? (
                            <div className="col-12 mhwc-item mhwc-skills">
                                <div className="col-12 mhwc-name">
                                    <span>技能</span>
                                </div>
                                <div className="col-12 mhwc-value">
                                    {equipInfo.skills.sort((a, b) => {
                                        return b.level - a.level;
                                    }).map((data) => {
                                        return (
                                            <div key={data.name} className="row mhwc-skill">
                                                <div className="col-12 mhwc-name">
                                                    <span>{data.name} Lv.{data.level}</span>
                                                </div>
                                                <div className="col-12 mhwc-value">
                                                    <span>{data.description}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : false}
                    </div>
                ) );
            } else {
                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            <a className="mhwc-equip_name" onClick={() => {this.handleEquipSwitch(equipSelectorData)}}>
                                <span>{Lang[equipType]} ---</span>
                            </a>
                        </div>
                    </div>
                ));
            }
        });

        // Charm
        let charmSelectorData = {
            equipType: 'charm',
            equipName: null
        };

        if (null !== equips.charm.name) {
            let charmInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a onClick={() => {this.handleEquipSwitch(charmSelectorData)}}>
                            <span>{Lang['charm']} - {charmInfo.name}</span>
                        </a>

                        <a className="mhwc-icon" onClick={() => {this.handleEquipEmpty(charmSelectorData)}}>
                            <i className="fa fa-times"></i>
                        </a>
                        <a className="mhwc-icon" onClick={() => {this.handleEquipLockToggle('charm')}}>
                            {equipsLock.charm ? (
                                <i className="fa fa-lock"></i>
                            ) : (
                                <i className="fa fa-unlock-alt"></i>
                            )}
                        </a>
                    </div>

                    <div className="col-12 mhwc-item mhwc-skills">
                        <div className="col-12 mhwc-name">
                            <span>技能</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            {charmInfo.skills.sort((a, b) => {
                                return b.level - a.level;
                            }).map((data) => {
                                return (
                                    <div key={data.name} className="row mhwc-skill">
                                        <div className="col-12 mhwc-name">
                                            <span>{data.name} Lv.{data.level}</span>
                                        </div>
                                        <div className="col-12 mhwc-value">
                                            <span>{data.description}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ));
        } else {
            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a onClick={() => {this.handleEquipSwitch(charmSelectorData)}}>
                            <span>{Lang['charm']} ---</span>
                        </a>
                    </div>
                </div>
            ));
        }

        return ContentBlocks;
    }
}
