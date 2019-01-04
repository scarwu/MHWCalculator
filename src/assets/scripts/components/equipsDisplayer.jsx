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
import Misc from 'libraries/misc';
import DataSet from 'libraries/dataset';

// Load Components
import FunctionalIcon from 'components/functionalIcon';

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
        onPickUp: (data) => {}
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
        this.props.onPickUp(data);
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
            equipName: equips.weapon.name
        };

        let emptyWeaponSelectorData = {
            equipType: 'weapon',
            equipName: null
        };

        if (null === DataSet.weaponHelper.getInfo(equips.weapon.name)) {
            equips.weapon.name = null;
        }

        if (null !== equips.weapon.name) {
            let weaponInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);

            let originalSharpness = null;
            let enhancedSharpness = null;

            if (null !== weaponInfo.sharpness) {
                originalSharpness = Misc.deepCopy(weaponInfo.sharpness);
                enhancedSharpness = Misc.deepCopy(weaponInfo.sharpness);
                enhancedSharpness.value += 50;
            }

            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a className="mhwc-equip_name" onClick={() => {this.handleEquipSwitch(weaponSelectorData)}}>
                            <span>{Lang['weapon']} - {weaponInfo.name}</span>
                        </a>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName={equipsLock.weapon ? 'lock' : 'unlock-alt'}
                                altName={equipsLock.weapon ? '解除' : '鎖定'}
                                onClick={() => {this.handleEquipLockToggle('weapon')}} />
                            <FunctionalIcon
                                iconName="times" altName="清除"
                                onClick={() => {this.handleEquipEmpty(emptyWeaponSelectorData)}} />
                        </div>
                    </div>

                    {0 !== weaponInfo.enhances.length ? (
                        <div className="col-12 mhwc-item mhwc-enhances">
                            {weaponInfo.enhances.map((data, index) => {
                                let enhanceSelectorData = {
                                    equipType: 'weapon',
                                    enhanceIndex: index,
                                    enhanceName: data.name
                                };

                                let emptyEnhanceSelectorData = {
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

                                            <div className="mhwc-icons_bundle">
                                                {null !== data.name ? (
                                                    <FunctionalIcon
                                                        iconName="times" altName="清除"
                                                        onClick={() => {this.handleEquipEmpty(emptyEnhanceSelectorData)}} />
                                                ) : false}
                                            </div>
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
                                    slotName: data.jewel.name
                                };

                                let emptyJewelSelectorData = {
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

                                            <div className="mhwc-icons_bundle">
                                                {null !== data.jewel.name ? (
                                                    <FunctionalIcon
                                                        iconName="times" altName="清除"
                                                        onClick={() => {this.handleEquipEmpty(emptyJewelSelectorData)}} />
                                                ) : false}
                                            </div>
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
                                <div className="col-2">
                                    <div className="mhwc-name">
                                        <span>攻擊力</span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="mhwc-value">
                                        <span>{weaponInfo.attack}</span>
                                    </div>
                                </div>

                                {(null !== weaponInfo.sharpness) ? [(
                                    <div key={'sharpness_1'} className="col-2">
                                        <div className="mhwc-name">
                                            <span>銳利度</span>
                                        </div>
                                    </div>
                                ), (
                                    <div key={'sharpness_2'} className="col-4">
                                        <div className="mhwc-value mhwc-sharpness">
                                            {this.renderSharpnessBar(originalSharpness)}
                                            {this.renderSharpnessBar(enhancedSharpness)}
                                        </div>
                                    </div>
                                )] : false}

                                <div className="col-2">
                                    <div className="mhwc-name">
                                        <span>會心率</span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="mhwc-value">
                                        <span>{weaponInfo.criticalRate}%</span>
                                    </div>
                                </div>

                                {(null !== weaponInfo.element.attack) ? [(
                                    <div key={'attackElement_1'} className="col-2">
                                        <div className="mhwc-name">
                                            <span>{Lang[weaponInfo.element.attack.type]}屬性</span>
                                        </div>
                                    </div>
                                ), (
                                    <div key={'attackElement_2'} className="col-4">
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
                                    <div key={'statusElement_1'} className="col-2">
                                        <div className="mhwc-name">
                                            <span>{Lang[weaponInfo.element.status.type]}屬性</span>
                                        </div>
                                    </div>
                                ), (
                                    <div key={'statusElement_2'} className="col-4">
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
                                    <div key={'elderseal_1'} className="col-2">
                                        <div className="mhwc-name">
                                            <span>龍封力</span>
                                        </div>
                                    </div>
                                ), (
                                    <div key={'elderseal_2'} className="col-4">
                                        <div className="mhwc-value">
                                            <span>{Lang[weaponInfo.elderseal.affinity]}</span>
                                        </div>
                                    </div>
                                )] : false}

                                <div className="col-2">
                                    <div className="mhwc-name">
                                        <span>防禦力</span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="mhwc-value">
                                        <span>{weaponInfo.defense}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {0 !== weaponInfo.skills.length ? (
                        <div className="col-12 mhwc-item mhwc-skills">
                            <div className="col-12 mhwc-name">
                                <span>技能</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                <div className="row">
                                    {weaponInfo.skills.sort((a, b) => {
                                        return b.level - a.level;
                                    }).map((data) => {
                                        return (
                                            <div key={data.name} className="col-6">
                                                <div className="mhwc-value">
                                                    <span>{data.name} Lv.{data.level}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
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
                equipName: equips[equipType].name
            };

            let emptyEquipSelectorData = {
                equipType: equipType,
                equipName: null
            };

            if (null === DataSet.armorHelper.getInfo(equips[equipType].name)) {
                equips[equipType].name = null;
            }

            if (null !== equips[equipType].name) {
                let equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            <a className="mhwc-equip_name" onClick={() => {this.handleEquipSwitch(equipSelectorData)}}>
                                <span>{Lang[equipType]} - {equipInfo.name}</span>
                            </a>

                            <div className="mhwc-icons_bundle">
                                <FunctionalIcon
                                    iconName={equipsLock[equipType] ? 'lock' : 'unlock-alt'}
                                    altName={equipsLock[equipType] ? '解除' : '鎖定'}
                                    onClick={() => {this.handleEquipLockToggle(equipType)}} />
                                <FunctionalIcon
                                    iconName="times" altName="清除"
                                    onClick={() => {this.handleEquipEmpty(emptyEquipSelectorData)}} />
                            </div>
                        </div>

                        {0 !== equipInfo.slots.length ? (
                            <div className="col-12 mhwc-item mhwc-slots">
                                {equipInfo.slots.map((data, index) => {
                                    let jewelSelectorData = {
                                        equipType: equipType,
                                        slotSize: data.size,
                                        slotIndex: index,
                                        slotName: data.jewel.name
                                    };

                                    let emptyJewelSelectorData = {
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

                                                <div className="mhwc-icons_bundle">
                                                    {null !== data.jewel.name ? (
                                                        <FunctionalIcon
                                                            iconName="times" altName="清除"
                                                            onClick={() => {this.handleEquipEmpty(emptyJewelSelectorData)}} />
                                                    ) : false}
                                                </div>
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
                                    <div className="col-2">
                                        <div className="mhwc-name">
                                            <span>防禦力</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mhwc-value">
                                            <span>{equipInfo.defense}</span>
                                        </div>
                                    </div>

                                    {Constant.elements.map((elementType) => {
                                        return [(
                                            <div key={elementType + '_1'} className="col-2">
                                                <div className="mhwc-name">
                                                    <span>{Lang[elementType]}抗性</span>
                                                </div>
                                            </div>
                                        ),(
                                            <div key={elementType + '_2'} className="col-4">
                                                <div className="mhwc-value">
                                                    <span>{equipInfo.resistance[elementType]}</span>
                                                </div>
                                            </div>
                                        )];
                                    })}
                                </div>
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
                                    <div className="row">
                                        {equipInfo.skills.sort((a, b) => {
                                            return b.level - a.level;
                                        }).map((data) => {
                                            return (
                                                <div key={data.name} className="col-6">
                                                    <div className="mhwc-value">
                                                        <span>{data.name} Lv.{data.level}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
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
            equipName: equips.charm.name
        };

        let emptyCharmSelectorData = {
            equipType: 'charm',
            equipName: null
        };

        if (null === DataSet.charmHelper.getInfo(equips.charm.name)) {
            equips.charm.name = null;
        }

        if (null !== equips.charm.name) {
            let charmInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <a onClick={() => {this.handleEquipSwitch(charmSelectorData)}}>
                            <span>{Lang['charm']} - {charmInfo.name}</span>
                        </a>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName={equipsLock.charm ? 'lock' : 'unlock-alt'}
                                altName={equipsLock.charm ? '解除' : '鎖定'}
                                onClick={() => {this.handleEquipLockToggle('charm')}} />
                            <FunctionalIcon
                                iconName="times" altName="清除"
                                onClick={() => {this.handleEquipEmpty(emptyCharmSelectorData)}} />
                        </div>
                    </div>

                    <div className="col-12 mhwc-item mhwc-skills">
                        <div className="col-12 mhwc-name">
                            <span>技能</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            <div className="row">
                                {charmInfo.skills.sort((a, b) => {
                                    return b.level - a.level;
                                }).map((data) => {
                                    return (
                                        <div key={data.name} className="col-6">
                                            <div className="mhwc-value">
                                                <span>{data.name} Lv.{data.level}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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

        return (
            <div className="mhwc-list">
                {ContentBlocks}
            </div>
        );
    }
}
