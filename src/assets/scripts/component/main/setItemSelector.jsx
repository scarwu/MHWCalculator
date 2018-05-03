'use strict';
/**
 * Set Item Selector
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

export default class SetItemSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickUp: (data) => {},
        onThrowDown: (data) => {},
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
        this.props.onPickUp({
            setName: itemName
        });
    };

    handleItemThrowDown = (itemName) => {
        this.props.onThrowDown({
            setName: itemName
        });
    };

    handleSegmentInput = () => {
        let segment = this.refs.segment.value;

        segment = (0 !== segment.length) ? segment.trim() : null;

        this.setState({
            segment: segment
        });
    };

    initList = (data) => {
        let selectedList = [];
        let unselectedList = [];

        data = data.map((set) => {
            return set.name;
        });

        DataSet.setHelper.getNames().sort().forEach((setName) => {

            let set = DataSet.setHelper.getInfo(setName);

            // Skip Selected Sets
            if (-1 !== data.indexOf(set.name)) {
                selectedList.push(set);
            } else {
                unselectedList.push(set);
            }
        });

        this.setState({
            selectedList: selectedList,
            unselectedList: unselectedList
        });
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.initList(this.props.data);
    }

    componentWillReceiveProps (nextProps) {
        this.initList(nextProps.data);
    }

    /**
     * Render Functions
     */
    renderRow = (data, isSelect) => {
        return (
            <tr key={data.name}>
                <td><span>{data.name}</span></td>
                <td>
                    {data.skills.map((skill, index) => {
                        return (
                            <div key={index}>
                                <span>({skill.require}) {skill.name}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    {data.skills.map((skill, index) => {
                        let skillInfo = DataSet.skillHelper.getInfo(skill.name);

                        return (
                            <div key={index}>
                                <span>{skillInfo.list[0].description}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    {isSelect ? (
                        <a className="mhwc-icon"
                            onClick={() => {this.handleItemThrowDown(data.name)}}>

                            <i className="fa fa-minus"></i>
                        </a>
                    ) : (
                        <a className="mhwc-icon"
                            onClick={() => {this.handleItemPickUp(data.name)}}>

                            <i className="fa fa-plus"></i>
                        </a>
                    )}
                </td>
            </tr>
        );
    };

    renderTable = () => {
        let segment = this.state.segment;

        return (
            <table className="mhwc-set_table">
                <thead>
                    <tr>
                        <td>名稱</td>
                        <td>技能</td>
                        <td>說明</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.selectedList.map((data, index) => {

                        // Create Text
                        let text = data.name;

                        data.skills.forEach((data) => {
                            let skillInfo = DataSet.skillHelper.getInfo(data.name);

                            text += data.name + skillInfo.list[0].description;
                        })

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderRow(data, true);
                    })}

                    {this.state.unselectedList.map((data, index) => {

                        // Create Text
                        let text = data.name;

                        data.skills.forEach((data) => {
                            let skillInfo = DataSet.skillHelper.getInfo(data.name);

                            text += data.name + skillInfo.list[0].description;
                        })

                        // Search Nameword
                        if (null !== segment
                            && !text.toLowerCase().match(segment.toLowerCase())) {

                            return false;
                        }

                        return this.renderRow(data, false);
                    })}
                </tbody>
            </table>
        );
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
