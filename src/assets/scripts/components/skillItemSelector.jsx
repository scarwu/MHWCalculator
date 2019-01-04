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
import Misc from 'libraries/misc';
import DataSet from 'libraries/dataset';

// Load Components
import FunctionalIcon from 'components/functionalIcon';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class SkillItemSelector extends Component {

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
            skillName: itemName
        });
    };

    handleItemThrowDown = (itemName) => {
        this.props.onThrowDown({
            skillName: itemName
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

        data = data.map((skill) => {
            return skill.name;
        });

        DataSet.skillHelper.getNames().sort().forEach((skillName) => {

            let skill = DataSet.skillHelper.getInfo(skillName);

            if (false === skill.fromJewel && false === skill.fromArmor) {
                return;
            }

            // Skip Selected Skills
            if (-1 !== data.indexOf(skill.name)) {
                selectedList.push(skill);
            } else {
                unselectedList.push(skill);
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
                    {data.list.map((skill, index) => {
                        return (
                            <div key={index}>
                                <span>Lv.{skill.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    {data.list.map((skill, index) => {
                        return (
                            <div key={index}>
                                <span>{skill.description}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        {isSelect ? (
                            <FunctionalIcon
                                iconName="minus" altName="移除"
                                onClick={() => {this.handleItemThrowDown(data.name)}} />
                        ) : (
                            <FunctionalIcon
                                iconName="plus" altName="新增"
                                onClick={() => {this.handleItemPickUp(data.name)}} />
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    renderTable = () => {
        let segment = this.state.segment;

        return (
            <table className="mhwc-skill_table">
                <thead>
                    <tr>
                        <td>名稱</td>
                        <td>等級</td>
                        <td>說明</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.selectedList.map((data, index) => {

                        // Create Text
                        let text = data.name;

                        data.list.forEach((data) => {
                            text += data.name + data.description;
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

                        data.list.forEach((data) => {
                            text += data.name + data.description;
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

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="times" altName="關閉"
                                onClick={this.handleWindowClose} />
                        </div>
                    </div>
                    <div className="mhwc-list">
                        {this.renderTable()}
                    </div>
                </div>
            </div>
        );
    }
}
