'use strict';
/**
 * Equip Item Selector
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
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import EnhanceDataset from 'libraries/dataset/enhance';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load Constant
import Constant from 'constant';

// Weapon Type List
let weaponTypeList = [
    'greatSword',
    'longSword',
    'swordAndShield',
    'dualBlades',
    'hammer',
    'huntingHorn',
    'lance',
    'gunlance',
    'switchAxe',
    'chargeBlade',
    'insectGlaive',
    'bow',
    'lightBowgun',
    'heavyBowgun'
];

export default class EquipItemSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickUp: (data) => {},
        onToggle: (data) => {},
        onClose: () => {}
    };

    // Initial State
    state = {
        mode: null,
        includeList: [],
        ignoreList: [],
        type: null,
        segment: null
    };

    /**
     * Handle Functions
     */
    handleWindowClose = () => {
        this.props.onClose();
    };

    handleItemPickUp = (itemId) => {
        let data = this.props.data;

        if (undefined !== data.enhanceIndex) {
            data.enhanceId = itemId;
        } else if (undefined !== data.slotIndex) {
            data.slotId = itemId;
        } else {
            data.equipId = itemId;
        }

        this.props.onPickUp(data);
        this.props.onClose();
    };

    handleItemToggle = (itemType, itemId) => {
        this.props.onToggle({
            type: itemType,
            id: itemId
        });
    };

    handleSegmentInput = () => {
        let segment = this.refs.segment.value;

        segment = (0 !== segment.length) ? segment.trim() : null;

        this.setState({
            segment: segment
        });
    };

    handleTypeChange = () => {
        let type = this.refs.type.value;

        this.setState({
            type: type
        });
    };

    initState = (data) => {
        let mode = null;
        let includeList = [];
        let ignoreList = [];
        let type = null;

        let ignoreEquips = Status.get('ignoreEquips');

        if (undefined === ignoreEquips) {
            ignoreEquips = {};
        }

        if (undefined !== data.enhanceIndex) {
            mode = 'enhance';
            includeList = EnhanceDataset.getItems();
        } else if (undefined !== data.slotIndex) {
            mode = 'jewel';

            for (let size = data.slotSize; size >= 1; size--) {
                for (let rare = 8; rare >= 5; rare--) {
                    includeList = includeList.concat(
                        JewelDataset.rareIs(rare).sizeIsEqualThen(size).getItems()
                    );
                }
            }
        } else if ('weapon' === data.equipType) {
            mode = 'weapon';
            type = weaponTypeList[0];

            if (null !== data.equipId) {
                type = WeaponDataset.getInfo(data.equipId).type;
            }

            weaponTypeList.forEach((weaponType) => {
                for (let rare = 8; rare >= 5; rare--) {
                    WeaponDataset.typeIs(weaponType).rareIs(rare).getItems().forEach((equip) => {
                        if (undefined !== ignoreEquips['weapon']
                            && true === ignoreEquips['weapon'][equip.id]) {

                            ignoreList.push(equip);
                        } else {
                            includeList.push(equip);
                        }
                    });
                }

                WeaponDataset.typeIs(weaponType).rareIs(0).getItems().forEach((equip) => {
                    if (undefined !== ignoreEquips['weapon']
                        && true === ignoreEquips['weapon'][equip.id]) {

                        ignoreList.push(equip);
                    } else {
                        includeList.push(equip);
                    }
                });
            });
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            mode = 'armor';
            type = data.equipType;

            for (let rare = 8; rare >= 5; rare--) {
                ArmorDataset.typeIs(data.equipType).rareIs(rare).getItems().forEach((equip) => {
                    if (undefined !== ignoreEquips[equip.type]
                        && true === ignoreEquips[equip.type][equip.id]) {

                        ignoreList.push(equip);
                    } else {
                        includeList.push(equip);
                    }
                });
            }

            ArmorDataset.typeIs(data.equipType).rareIs(0).getItems().forEach((equip) => {
                if (undefined !== ignoreEquips[equip.type]
                    && true === ignoreEquips[equip.type][equip.id]) {

                    ignoreList.push(equip);
                } else {
                    includeList.push(equip);
                }
            });
        } else if ('charm' === data.equipType) {
            mode = 'charm';

            CharmDataset.getItems().forEach((equip) => {
                if (undefined !== ignoreEquips['charm']
                    && true === ignoreEquips['charm'][equip.id]) {

                    ignoreList.push(equip);
                } else {
                    includeList.push(equip);
                }
            });
        }

        this.setState({
            mode: mode,
            includeList: includeList,
            ignoreList: ignoreList,
            type: type
        });
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.initState(this.props.data);
    }

    componentWillReceiveProps (nextProps) {
        this.initState(nextProps.data);
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

    renderWeaponRow = (data, index, isIgnore) => {
        let originalSharpness = null;
        let enhancedSharpness = null;

        if (null !== data.sharpness) {
            originalSharpness = Helper.deepCopy(data.sharpness);
            enhancedSharpness = Helper.deepCopy(data.sharpness);
            enhancedSharpness.value += 50;
        }

        if (null !== data.element.attack
            && null === data.element.attack.maxValue) {

            data.element.attack.maxValue = '?';
        }

        if (null !== data.element.status
            && null === data.element.status.maxValue) {

            data.element.status.maxValue = '?';
        }

        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{_(data.series)}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.attack}</span></td>
                <td className="mhwc-sharpness">
                    {null !== data.sharpness ? this.renderSharpnessBar(originalSharpness) :  false}
                    {null !== data.sharpness ? this.renderSharpnessBar(enhancedSharpness) :  false}
                </td>
                <td><span>{data.criticalRate}%</span></td>
                <td>
                    {null !== data.element.attack ? (
                        <div>
                            <span>{_(data.element.attack.type)}</span>
                            &nbsp;
                            {data.element.attack.isHidden ? (
                                <span key="value_1">({data.element.attack.minValue}-{data.element.attack.maxValue})</span>
                            ) : (
                                <span key="value_2">{data.element.attack.minValue}-{data.element.attack.maxValue}</span>
                            )}
                        </div>
                    ) : false}

                    {null !== data.element.status ? (
                        <div>
                            <span>{_(data.element.status.type)}</span>
                            &nbsp;
                            {data.element.status.isHidden ? (
                                <span key="value_1">({data.element.status.minValue}-{data.element.status.maxValue})</span>
                            ) : (
                                <span key="value_2">{data.element.status.minValue}-{data.element.status.maxValue}</span>
                            )}
                        </div>
                    ) : false}
                </td>
                <td>
                    {null !== data.elderseal ? (
                        <span>{_(data.elderseal.affinity)}</span>
                    ) : false}
                </td>
                <td><span>{data.defense}</span></td>
                <td>
                    {data.slots.map((data, index) => {
                        return (
                            <span key={index}>[{data.size}]</span>
                        );
                    })}
                </td>
                <td>
                    {data.skills.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{_(SkillDataset.getInfo(data.id).name)} Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? _('include') : _('exclude')}
                            onClick={() => {this.handleItemToggle('weapon', data.id)}} />

                        {(this.props.data.equipId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {this.handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    renderWeaponTable = () => {
        let segment = this.state.segment;

        return (
            <table className="mhwc-weapon_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('series')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('attack')}</td>
                        <td>{_('sharpness')}</td>
                        <td>{_('criticalRate')}</td>
                        <td>{_('element')}</td>
                        <td>{_('elderseal')}</td>
                        <td>{_('defense')}</td>
                        <td>{_('slot')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        if (data.type !== this.state.type) {
                            return;
                        }

                        // Create Text
                        let text = data.id;

                        text += _(data.type);

                        if (null !== data.element.attack) {
                            text += _(data.element.attack.type);
                        }

                        if (null !== data.element.status) {
                            text += _(data.element.status.type);
                        }

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderWeaponRow(data, index, false);
                    })}

                    {this.state.ignoreList.map((data, index) => {
                        return this.renderWeaponRow(data, index, true);
                    })}
                </tbody>
            </table>
        );
    };

    renderArmorRow = (data, index, isIgnore) => {
        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{_(data.series)}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.defense}</span></td>
                <td>
                    <div><span>{_('fire')} {data.resistance.fire}</span></div>
                    <div><span>{_('water')} {data.resistance.water}</span></div>
                    <div><span>{_('thunder')} {data.resistance.thunder}</span></div>
                    <div><span>{_('ice')} {data.resistance.ice}</span></div>
                    <div><span>{_('dragon')} {data.resistance.dragon}</span></div>
                </td>
                <td>
                    {data.slots.map((data, index) => {
                        return (
                            <span key={index}>[{data.size}]</span>
                        );
                    })}
                </td>
                <td>
                    {null !== data.set ? (
                        <span>{_(SetDataset.getInfo(data.set.id).name)}</span>
                    ) : false}
                </td>
                <td>
                    {data.skills.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{_(SkillDataset.getInfo(data.id).name)} Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? _('include') : _('exclude')}
                            onClick={() => {this.handleItemToggle(data.type, data.id)}} />

                        {(this.props.data.equipId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {this.handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    renderArmorTable = () => {
        let segment = this.state.segment;

        return (
            <table className="mhwc-armor_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('series')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('defense')}</td>
                        <td>{_('resistance')}</td>
                        <td>{_('slot')}</td>
                        <td>{_('set')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.id;

                        if (null !== data.set) {
                            text += data.set.id;
                        }

                        data.skills.forEach((data) => {
                            text += data.id;
                        })

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderArmorRow(data, index, false);
                    })}

                    {this.state.ignoreList.map((data, index) => {
                        return this.renderArmorRow(data, index, true);
                    })}
                </tbody>
            </table>
        );
    };

    renderCharmRow = (data, index, isIgnore) => {
        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{data.rare}</span></td>
                <td>
                    {data.skills.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{data.id} Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? _('include') : _('exclude')}
                            onClick={() => {this.handleItemToggle('charm', data.id)}} />

                        {(this.props.data.equipId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {this.handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    renderCharmTable = () => {
        let segment = this.state.segment;

        return (
            <table className="mhwc-charm_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.id;

                        data.skills.forEach((data) => {
                            text += data.id;
                        })

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderCharmRow(data, index, false);
                    })}

                    {this.state.ignoreList.map((data, index) => {
                        return this.renderCharmRow(data, index, true);
                    })}
                </tbody>
            </table>
        );
    };

    renderJewelRow = (data, index) => {
        let skillName = SkillDataset.getInfo(data.skill.id).name;

        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.size}</span></td>
                <td>
                    <span>{_(skillName)} Lv.{data.skill.level}</span>
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        {(this.props.data.jewelId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {this.handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    renderJewelTable = () => {
        let segment = this.state.segment;

        return (
            <table className="mhwc-jewel_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('size')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.id;

                        text += data.skill.id;

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderJewelRow(data, index);
                    })}
                </tbody>
            </table>
        );
    };

    renderEnhanceRow = (data, index) => {
        return (
            <tr key={data.id}>
                <td>{_(data.name)}</td>
                <td>
                    {data.list.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    {data.list.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{_(data.description)}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        {(this.props.data.enhanceId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {this.handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    renderEnhanceTable = () => {
        let segment = this.state.segment;

        return (
            <table className="mhwc-enhance_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('level')}</td>
                        <td>{_('description')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.id;

                        data.list.forEach((data) => {
                            text += data.description;
                        })

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderEnhanceRow(data, index);
                    })}
                </tbody>
            </table>
        );
    };

    render () {
        let Content = null;

        switch (this.state.mode) {
        case 'weapon':
            Content = this.renderWeaponTable();
            break;
        case 'armor':
            Content = this.renderArmorTable();
            break;
        case 'charm':
            Content = this.renderCharmTable();
            break;
        case 'jewel':
            Content = this.renderJewelTable();
            break;
        case 'enhance':
            Content = this.renderEnhanceTable();
            break;
        }

        return (
            <div className="mhwc-selector">
                <div className="mhwc-dialog">
                    <div className="mhwc-panel">
                        <input className="mhwc-text_segment" type="text"
                            ref="segment" onChange={this.handleSegmentInput} />

                        {'weapon' === this.state.mode ? (
                            <select defaultValue={this.state.type} ref="type" onChange={this.handleTypeChange}>
                                {weaponTypeList.map((type) => {
                                    return (
                                        <option key={type} value={type}>{_(type)}</option>
                                    );
                                })}
                            </select>
                        ) : false}

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="times" altName={_('close')}
                                onClick={this.handleWindowClose} />
                        </div>
                    </div>
                    <div className="mhwc-list">
                        {Content}
                    </div>
                </div>
            </div>
        );
    }
}
