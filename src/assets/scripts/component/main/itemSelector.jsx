'use strict';
/**
 * Item Selector
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

export default class ItemSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickup: (data) => {},
        onClose: () => {}
    };

    // Initial State
    state = {
        data: {},
        textSegment: null
    };

    /**
     * Handle Functions
     */
    handleWindowClose = () => {
        this.props.onClose();
    };

    handleItemPickup = (itemKey) => {
        let data = this.props.data;

        if (undefined !== data.slotIndex) {
            data.soltKey = itemKey;
        } else if (undefined !== data.enhanceIndex) {
            data.enhanceKey = itemKey;
        } else {
            data.equipKey = itemKey;
        }

        this.props.onPickup(data);
        this.props.onClose();
    };

    handleTextInput = () => {
        let segment = this.refs.textSegment.value;

        if (0 === segment.length) {
            segment = null;
        }

        this.setState({
            textSegment: segment
        });
    };
    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        let data = this.props.data;
        let mode = null;
        let list = [];

        if (undefined !== data.slotIndex) {
            mode = 'jewel';

            for (let i = 3; i >= data.slotSize; i--) {
                list = list.concat(DataSet.jewelHelper.sizeIsEqualThen(i).getItems().sort((a, b) => {
                    return b.rare - a.rare;
                }));
            }
        } else if (undefined !== data.enhanceIndex) {
            mode = 'enhance';
            list = DataSet.enhanceHelper.getItems();
        } else if ('weapon' === data.equipType) {
            mode = 'weapon';
            list = DataSet.weaponHelper.getItems();
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            mode = 'armor';
            list = DataSet.armorHelper.typeIs(data.equipType).getItems();
        } else if ('charm' === data.equipType) {
            mode = 'charm';
            list = DataSet.charmHelper.getItems();
        }

        this.setState({
            mode: mode,
            list: list
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            data: this.props.data
        });
    }

    /**
     * Render Functions
     */
    renderTable = () => {
        let segment = this.state.textSegment;

        switch (this.state.mode) {
        case 'weapon':
            return (
                <table className="mhwc-weapon_table">
                    <thead>
                        <tr>
                            <td>名稱</td>
                            <td>類型</td>
                            <td>稀有度</td>
                            <td>斬位</td>
                            <td>攻擊力</td>
                            <td>攻擊屬性</td>
                            <td>狀態屬性</td>
                            <td>龍封力</td>
                            <td>會心率</td>
                            <td>防禦</td>
                            <td>插槽</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.map((data, index) => {

                            // Search Keyword
                            if (null !== segment
                                && !data.name.toLowerCase().match(segment.toLowerCase())) {

                                return false;
                            }

                            return (
                                <tr key={index}>
                                    <td><span>{data.name}</span></td>
                                    <td><span>{Lang[data.type]}</span></td>
                                    <td><span>{data.rare}</span></td>
                                    <td>
                                        {null !== data.sharpness ? (
                                            <div className="mhwc-steps">
                                                {['red', 'orange', 'yellow', 'green', 'blue', 'white'].map((step) => {
                                                    return (
                                                        <div key={'sharpness_' + step} className="mhwc-step" style={{
                                                            width: (data.sharpness.steps[step] / 4) + '%'
                                                        }}></div>
                                                    );
                                                })}

                                                <div className="mhwc-mask" style={{
                                                    width: ((400 - data.sharpness.value) / 4) + '%'
                                                }}></div>
                                            </div>
                                        ) :  false}
                                    </td>
                                    <td><span>{data.attack}</span></td>
                                    <td>
                                        {null !== data.element.attack ? [(
                                            <span>{Lang[data.element.attack.type]}</span>
                                        ), data.element.attack.isHidden ? (
                                            <span>({data.element.attack.value})</span>
                                        ) : (
                                            <span>{data.element.attack.value}</span>
                                        )] : false}

                                    </td>
                                    <td>
                                        {null !== data.element.status ? [(
                                            <span>{Lang[data.element.status.type]}</span>
                                        ), data.element.status.isHidden ? (
                                            <span>({data.element.status.value})</span>
                                        ) : (
                                            <span>{data.element.status.value}</span>
                                        )] : false}

                                    </td>
                                    <td>
                                        {null !== data.elderseal ? (
                                            <span>{Lang[data.elderseal.affinity]}</span>
                                        ) : false}
                                    </td>
                                    <td><span>{data.criticalRate}</span></td>
                                    <td><span>{data.defense}</span></td>
                                    <td>
                                        {data.slots.map((data) => {
                                            return (
                                                <span>[{data.size}]</span>
                                            );
                                        })}
                                    </td>
                                    <td>
                                        <a className="fa fa-check"
                                            onClick={() => {this.handleItemPickup(data.name)}}></a>
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
                            <td>稀有度</td>
                            <td>防禦</td>
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

                            // Search Keyword
                            if (null !== segment
                                && !data.name.toLowerCase().match(segment.toLowerCase())) {

                                return false;
                            }

                            return (
                                <tr key={index}>
                                    <td><span>{data.name}</span></td>
                                    <td><span>{data.rare}</span></td>
                                    <td><span>{data.defense}</span></td>
                                    <td><span>{data.resistance.fire}</span></td>
                                    <td><span>{data.resistance.water}</span></td>
                                    <td><span>{data.resistance.thunder}</span></td>
                                    <td><span>{data.resistance.ice}</span></td>
                                    <td><span>{data.resistance.dragon}</span></td>
                                    <td>
                                        {data.slots.map((data) => {
                                            return (
                                                <span>[{data.size}]</span>
                                            );
                                        })}
                                    </td>
                                    <td>
                                        {null !== data.set ? (
                                            <span>{data.set.key}</span>
                                        ) : false}
                                    </td>
                                    <td>
                                        {data.skills.map((data) => {
                                            return (
                                                <div>
                                                    <span>{data.key} Lv.{data.level}</span>
                                                </div>
                                            );
                                        })}
                                    </td>
                                    <td>
                                        <a className="fa fa-check"
                                            onClick={() => {this.handleItemPickup(data.name)}}></a>
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

                            // Search Keyword
                            if (null !== segment
                                && !data.name.toLowerCase().match(segment.toLowerCase())) {

                                return false;
                            }

                            return (
                                <tr key={index}>
                                    <td><span>{data.name}</span></td>
                                    <td><span>{data.rare}</span></td>
                                    <td>
                                        {data.skills.map((data) => {
                                            return (
                                                <div>
                                                    <span>{data.key} Lv.{data.level}</span>
                                                </div>
                                            );
                                        })}
                                    </td>
                                    <td>
                                        <a className="fa fa-check"
                                            onClick={() => {this.handleItemPickup(data.name)}}></a>
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

                            // Search Keyword
                            if (null !== segment
                                && !data.name.toLowerCase().match(segment.toLowerCase())) {

                                return false;
                            }

                            return (
                                <tr key={index}>
                                    <td><span>{data.name}</span></td>
                                    <td><span>{data.rare}</span></td>
                                    <td><span>{data.size}</span></td>
                                    <td>
                                        <span>{data.skill.key} Lv.{data.skill.level}</span>
                                    </td>
                                    <td>
                                        <a className="fa fa-check"
                                            onClick={() => {this.handleItemPickup(data.name)}}></a>
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
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.map((data, index) => {

                            // Search Keyword
                            if (null !== segment
                                && !data.name.toLowerCase().match(segment.toLowerCase())) {

                                return false;
                            }

                            return (
                                <tr key={index}>
                                    <td>{data.name}</td>
                                    <td>
                                        <a className="fa fa-check"
                                            onClick={() => {this.handleItemPickup(data.name)}}></a>
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
                <div className="mhwc-function_bar">
                    <input className="mhwc-text_segment" type="text"
                        ref="textSegment" onChange={this.handleTextInput} />
                    <a className="fa fa-times" onClick={this.handleWindowClose}></a>
                </div>
                <div className="mhwc-list">
                    {this.renderTable()}
                </div>
            </div>
        );
    }
}
