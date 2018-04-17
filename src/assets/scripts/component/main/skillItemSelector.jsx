'use strict';
/**
 * Skill Item Selector
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

export default class SkillItemSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickup: (data) => {},
        onClose: () => {}
    };

    // Initial State
    state = {
        data: {},
        list: [],
        textSegment: null
    };

    /**
     * Handle Functions
     */
    handleWindowClose = () => {
        this.props.onClose();
    };

    handleItemPickup = (itemKey) => {
        this.props.onPickup({
            skillKey: itemKey
        });
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
        let list = [];

        data = data.map((skill) => {
            return skill.key;
        });

        DataSet.skillHelper.getKeys().sort().map((skillKey) => {

            let skill = DataSet.skillHelper.getInfo(skillKey);

            // Skip Selected Skills
            if (-1 !== data.indexOf(skill.name)) {
                return false;
            }

            list.push(skill);
        });

        this.setState({
            list: list
        });
    }

    /**
     * Render Functions
     */
    renderTable = () => {
        let segment = this.state.textSegment;

        return (
            <table className="mhwc-weapon_table">
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

                        // Search Keyword
                        if (null !== segment
                            && !data.name.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return (
                            <tr key={index}>
                                <td><span>{data.name}</span></td>
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
                                    <a className="fa fa-check"
                                        onClick={() => {this.handleItemPickup(data.name)}}></a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
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
