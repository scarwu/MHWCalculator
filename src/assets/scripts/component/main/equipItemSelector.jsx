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

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

// Load Components
import FunctionalIcon from 'component/main/functionalIcon';

// Weapon Type List
var weaponTypeList = [
    'greatSword', 'longSword',
    'swordAndShield', 'dualBlades',
    'hammer', 'huntingHorn',
    'lance', 'gunlance',
    'switchAxe', 'chargeBlade',
    'insectGlaive', 'bow',
    'lightBowgun', 'heavyBowgun'
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

    handleItemPickUp = (itemName) => {
        let data = this.props.data;

        if (undefined !== data.enhanceIndex) {
            data.enhanceName = itemName;
        } else if (undefined !== data.slotIndex) {
            data.slotName = itemName;
        } else {
            data.equipName = itemName;
        }

        this.props.onPickUp(data);
        this.props.onClose();
    };

    handleItemToggle = (itemName) => {
        this.props.onToggle({
            mode: this.state.mode,
            name: itemName
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

            DataSet.enhanceHelper.getItems().forEach((data) => {
                if (undefined !== ignoreEquips[mode]
                    && true === ignoreEquips[mode][data.name]) {

                    ignoreList.push(data);
                } else {
                    includeList.push(data);
                }
            });
        } else if (undefined !== data.slotIndex) {
            mode = 'jewel';

            for (let size = data.slotSize; size >= 1; size--) {
                for (let rare = 8; rare >= 5; rare--) {
                    DataSet.jewelHelper.rareIs(rare).sizeIsEqualThen(size).getItems().forEach((data) => {
                        if (undefined !== ignoreEquips[mode]
                            && true === ignoreEquips[mode][data.name]) {

                            ignoreList.push(data);
                        } else {
                            includeList.push(data);
                        }
                    });
                }
            }
        } else if ('weapon' === data.equipType) {
            mode = 'weapon';
            type = weaponTypeList[0];

            if (null !== data.equipName) {
                type = DataSet.weaponHelper.getInfo(data.equipName).type;
            }

            weaponTypeList.forEach((weaponType) => {
                for (let rare = 8; rare >= 5; rare--) {
                    DataSet.weaponHelper.typeIs(weaponType).rareIs(rare).getItems().forEach((data) => {
                        if (undefined !== ignoreEquips[mode]
                            && true === ignoreEquips[mode][data.name]) {

                            ignoreList.push(data);
                        } else {
                            includeList.push(data);
                        }
                    });
                }

                DataSet.weaponHelper.typeIs(weaponType).rareIs(0).getItems().forEach((data) => {
                    if (undefined !== ignoreEquips[mode]
                        && true === ignoreEquips[mode][data.name]) {

                        ignoreList.push(data);
                    } else {
                        includeList.push(data);
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
                DataSet.armorHelper.typeIs(data.equipType).rareIs(rare).getItems().forEach((data) => {
                    if (undefined !== ignoreEquips[mode]
                        && true === ignoreEquips[mode][data.name]) {

                        ignoreList.push(data);
                    } else {
                        includeList.push(data);
                    }
                });
            }

            DataSet.armorHelper.typeIs(data.equipType).rareIs(0).getItems().forEach((data) => {
                if (undefined !== ignoreEquips[mode]
                    && true === ignoreEquips[mode][data.name]) {

                    ignoreList.push(data);
                } else {
                    includeList.push(data);
                }
            });
        } else if ('charm' === data.equipType) {
            mode = 'charm';

            DataSet.charmHelper.getItems().forEach((data) => {
                if (undefined !== ignoreEquips[mode]
                    && true === ignoreEquips[mode][data.name]) {

                    ignoreList.push(data);
                } else {
                    includeList.push(data);
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
            originalSharpness = Misc.deepCopy(data.sharpness);
            enhancedSharpness = Misc.deepCopy(data.sharpness);
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
            <tr key={index}>
                <td><span>{data.name}</span></td>
                <td><span>{data.series}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.attack}</span></td>
                <td className="mhwc-sharpness">
                    {null !== data.sharpness ? this.renderSharpnessBar(originalSharpness) :  false}
                    {null !== data.sharpness ? this.renderSharpnessBar(enhancedSharpness) :  false}
                </td>
                <td><span>{data.criticalRate}%</span></td>
                <td>
                    {null !== data.element.attack ? [(
                        <span key="type">{Lang[data.element.attack.type]}</span>
                    ), data.element.attack.isHidden ? (
                        <span key="value_1">({data.element.attack.minValue}-{data.element.attack.maxValue})</span>
                    ) : (
                        <span key="value_2">{data.element.attack.minValue}-{data.element.attack.maxValue}</span>
                    )] : false}

                </td>
                <td>
                    {null !== data.element.status ? [(
                        <span key="type">{Lang[data.element.status.type]}</span>
                    ), data.element.status.isHidden ? (
                        <span key="value_1">({data.element.status.minValue}-{data.element.status.maxValue})</span>
                    ) : (
                        <span key="value_2">{data.element.status.minValue}-{data.element.status.maxValue}</span>
                    )] : false}

                </td>
                <td>
                    {null !== data.elderseal ? (
                        <span>{Lang[data.elderseal.affinity]}</span>
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
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? '引入' : '排除'}
                            onClick={() => {this.handleItemToggle(data.name)}} />

                        {(this.props.data.equipName !== data.name) ? (
                            <FunctionalIcon
                                iconName="check" altName="選取"
                                onClick={() => {this.handleItemPickUp(data.name)}} />
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
                        <td>名稱</td>
                        <td>衍生</td>
                        <td>稀有度</td>
                        <td>攻擊力</td>
                        <td>銳利度</td>
                        <td>會心率</td>
                        <td>攻擊屬性</td>
                        <td>狀態屬性</td>
                        <td>龍封力</td>
                        <td>防禦力</td>
                        <td>插槽</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        if (data.type !== this.state.type) {
                            return;
                        }

                        // Create Text
                        let text = data.name;

                        text += Lang[data.type];

                        if (null !== data.element.attack) {
                            text += Lang[data.element.attack.type];
                        }

                        if (null !== data.element.status) {
                            text += Lang[data.element.status.type];
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
            <tr key={index}>
                <td><span>{data.name}</span></td>
                <td><span>{data.series}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.defense}</span></td>
                <td><span>{data.resistance.fire}</span></td>
                <td><span>{data.resistance.water}</span></td>
                <td><span>{data.resistance.thunder}</span></td>
                <td><span>{data.resistance.ice}</span></td>
                <td><span>{data.resistance.dragon}</span></td>
                <td>
                    {data.slots.map((data, index) => {
                        return (
                            <span key={index}>[{data.size}]</span>
                        );
                    })}
                </td>
                <td>
                    {null !== data.set ? (
                        <span>{data.set.name}</span>
                    ) : false}
                </td>
                <td>
                    {data.skills.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{data.name} Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? '引入' : '排除'}
                            onClick={() => {this.handleItemToggle(data.name)}} />

                        {(this.props.data.equipName !== data.name) ? (
                            <FunctionalIcon
                                iconName="check" altName="選取"
                                onClick={() => {this.handleItemPickUp(data.name)}} />
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
                        <td>名稱</td>
                        <td>衍生</td>
                        <td>稀有度</td>
                        <td>防禦力</td>
                        <td>{Lang['fire']}抗性</td>
                        <td>{Lang['water']}抗性</td>
                        <td>{Lang['thunder']}抗性</td>
                        <td>{Lang['ice']}抗性</td>
                        <td>{Lang['dragon']}抗性</td>
                        <td>插槽</td>
                        <td>套裝</td>
                        <td>技能</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.name;

                        if (null !== data.set) {
                            text += data.set.name;
                        }

                        data.skills.forEach((data) => {
                            text += data.name;
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
            <tr key={index}>
                <td><span>{data.name}</span></td>
                <td><span>{data.rare}</span></td>
                <td>
                    {data.skills.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{data.name} Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? '引入' : '排除'}
                            onClick={() => {this.handleItemToggle(data.name)}} />

                        {(this.props.data.equipName !== data.name) ? (
                            <FunctionalIcon
                                iconName="check" altName="選取"
                                onClick={() => {this.handleItemPickUp(data.name)}} />
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
                        <td>名稱</td>
                        <td>稀有度</td>
                        <td>技能</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.name;

                        data.skills.forEach((data) => {
                            text += data.name;
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

    renderJewelRow = (data, index, isIgnore) => {
        return (
            <tr key={index}>
                <td><span>{data.name}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.size}</span></td>
                <td>
                    <span>{data.skill.name} Lv.{data.skill.level}</span>
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? '引入' : '排除'}
                            onClick={() => {this.handleItemToggle(data.name)}} />

                        {(this.props.data.jewelName !== data.name) ? (
                            <FunctionalIcon
                                iconName="check" altName="選取"
                                onClick={() => {this.handleItemPickUp(data.name)}} />
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
                        <td>名稱</td>
                        <td>稀有度</td>
                        <td>大小</td>
                        <td>技能</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.name;

                        text += data.skill.name;

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderJewelRow(data, index, false);
                    })}

                    {this.state.ignoreList.map((data, index) => {
                        return this.renderJewelRow(data, index, true);
                    })}
                </tbody>
            </table>
        );
    };

    renderEnhanceRow = (data, index, isIgnore) => {
        return (
            <tr key={index}>
                <td>{data.name}</td>
                <td>
                    {data.includeList.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    {data.includeList.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{data.description}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? '引入' : '排除'}
                            onClick={() => {this.handleItemToggle(data.name)}} />

                        {(this.props.data.enhanceName !== data.name) ? (
                            <FunctionalIcon
                                iconName="check" altName="選取"
                                onClick={() => {this.handleItemPickUp(data.name)}} />
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
                        <td>名稱</td>
                        <td>等級</td>
                        <td>說明</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.includeList.map((data, index) => {

                        // Create Text
                        let text = data.name;

                        data.includeList.forEach((data) => {
                            text += data.description;
                        })

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderEnhanceRow(data, index, false);
                    })}

                    {this.state.ignoreList.map((data, index) => {
                        return this.renderEnhanceRow(data, index, true);
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
                                        <option key={type} value={type}>{Lang[type]}</option>
                                    );
                                })}
                            </select>
                        ) : false}

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="times" altName="關閉"
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
