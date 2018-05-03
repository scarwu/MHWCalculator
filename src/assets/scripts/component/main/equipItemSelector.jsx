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

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class EquipItemSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickUp: (data) => {},
        onClose: () => {}
    };

    // Initial State
    state = {
        data: {},
        list: [],
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

    handleSegmentInput = () => {
        let segment = this.refs.segment.value;

        segment = (0 !== segment.length) ? segment.trim() : null;

        this.setState({
            segment: segment
        });
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        let data = this.props.data;
        let mode = null;
        let list = [];

        if (undefined !== data.enhanceIndex) {
            mode = 'enhance';
            list = DataSet.enhanceHelper.getItems();
        } else if (undefined !== data.slotIndex) {
            mode = 'jewel';

            for (let size = data.slotSize; size >= 1; size--) {
                for (let rare = 8; rare >= 5; rare--) {
                    list = list.concat(
                        DataSet.jewelHelper.rareIs(rare).sizeIsEqualThen(size).getItems()
                    );
                }
            }
        } else if ('weapon' === data.equipType) {
            mode = 'weapon';

            [
                'greatSword', 'longSword',
                'swordAndShield', 'dualSlades',
                'hammer', 'huntingHorn',
                'lance', 'gunlance',
                'switchAxe', 'chargeBlade',
                'insectGlaive', 'bow',
                'lightBowgun', 'heavyBowgun'
            ].forEach((weaponType) => {
                for (let rare = 8; rare >= 5; rare--) {
                    list = list.concat(
                        DataSet.weaponHelper.typeIs(weaponType).rareIs(rare).getItems()
                    );
                }

                list = list.concat(
                    DataSet.weaponHelper.typeIs(weaponType).rareIs(0).getItems()
                );
            });
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            mode = 'armor';

            for (let rare = 8; rare >= 5; rare--) {
                list = list.concat(
                    DataSet.armorHelper.typeIs(data.equipType).rareIs(rare).getItems()
                );
            }

            list = list.concat(
                DataSet.armorHelper.typeIs(data.equipType).rareIs(0).getItems()
            );
        } else if ('charm' === data.equipType) {
            mode = 'charm';
            list = DataSet.charmHelper.getItems();
        }

        this.setState({
            mode: mode,
            list: list
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

    renderTable = () => {
        let segment = this.state.segment;

        switch (this.state.mode) {
        case 'weapon':
            return (
                <table className="mhwc-weapon_table">
                    <thead>
                        <tr>
                            <td>類型</td>
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
                        {this.state.list.map((data, index) => {

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

                            let originalSharpness = null;
                            let enhancedSharpness = null;

                            if (null !== data.sharpness) {
                                originalSharpness = Misc.deepCopy(data.sharpness);
                                enhancedSharpness = Misc.deepCopy(data.sharpness);
                                enhancedSharpness.value += 50;
                            }

                            return (
                                <tr key={index}>
                                    <td><span>{Lang[data.type]}</span></td>
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
                                        {(this.props.data.equipName !== data.name) ? (
                                            <a className="mhwc-icon"
                                                onClick={() => {this.handleItemPickUp(data.name)}}>

                                                <i className="fa fa-check"></i>
                                            </a>
                                        ) : false}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        case 'armor':
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
                        {this.state.list.map((data, index) => {

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
                                        {(this.props.data.equipName !== data.name) ? (
                                            <a className="mhwc-icon"
                                                onClick={() => {this.handleItemPickUp(data.name)}}>

                                                <i className="fa fa-check"></i>
                                            </a>
                                        ) : false}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        case 'charm':
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
                        {this.state.list.map((data, index) => {

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
                                        {(this.props.data.equipName !== data.name) ? (
                                            <a className="mhwc-icon"
                                                onClick={() => {this.handleItemPickUp(data.name)}}>

                                                <i className="fa fa-check"></i>
                                            </a>
                                        ) : false}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        case 'jewel':
            return (
                <table className="mhwc-jeweln_table">
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
                        {this.state.list.map((data, index) => {

                            // Create Text
                            let text = data.name;

                            text += data.skill.name;

                            // Search Nameword
                            if (null !== segment
                                && !text.toLowerCase().match(segment.toLowerCase())) {

                                return false;
                            }

                            return (
                                <tr key={index}>
                                    <td><span>{data.name}</span></td>
                                    <td><span>{data.rare}</span></td>
                                    <td><span>{data.size}</span></td>
                                    <td>
                                        <span>{data.skill.name} Lv.{data.skill.level}</span>
                                    </td>
                                    <td>
                                        {(this.props.data.jewelName !== data.name) ? (
                                            <a className="mhwc-icon"
                                                onClick={() => {this.handleItemPickUp(data.name)}}>

                                                <i className="fa fa-check"></i>
                                            </a>
                                        ) : false}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        case 'enhance':
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
                        {this.state.list.map((data, index) => {

                            // Create Text
                            let text = data.name;

                            data.list.forEach((data) => {
                                text += data.description;
                            })

                            // Search Nameword
                            if (null !== segment
                                && !text.toLowerCase().match(segment.toLowerCase())) {

                                return false;
                            }

                            return (
                                <tr key={index}>
                                    <td>{data.name}</td>
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
                                                    <span>{data.description}</span>
                                                </div>
                                            );
                                        })}
                                    </td>
                                    <td>
                                        {(this.props.data.enhanceName !== data.name) ? (
                                            <a className="mhwc-icon"
                                                onClick={() => {this.handleItemPickUp(data.name)}}>

                                                <i className="fa fa-check"></i>
                                            </a>
                                        ) : false}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        }
    };

    render () {
        return (
            <div className="mhwc-selector">
                <div className="mhwc-dialog">
                    <div className="mhwc-panel">
                        <input className="mhwc-text_segment" type="text"
                            ref="segment" onChange={this.handleSegmentInput} />

                        <a className="mhwc-icon" onClick={this.handleWindowClose}>
                            <i className="fa fa-times"></i>
                        </a>
                    </div>
                    <div className="mhwc-list">
                        {this.renderTable()}
                    </div>
                </div>
            </div>
        );
    }
}
