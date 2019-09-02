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
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load Constant
import Constant from 'constant';

// Load State Control
import ModalStates from 'states/modal';

export default class SkillItemSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickUp: (data) => {},
        onThrowDown: (data) => {},
        onClose: () => {}
    };

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            isShow: ModalStates.getters.isShowSkillItemSelector(),
            data: {},
            list: [],
            segment: null,
            selectedList: [],
            unselectedList: []
        };
    }

    /**
     * Handle Functions
     */
    handleFastWindowClose = (event) => {
        if (this.refs.modal !== event.target) {
            return;
        }

        this.handleWindowClose();
    };

    handleWindowClose = () => {
        ModalStates.setters.hideSkillItemSelector();
    };

    handleItemPickUp = (itemId) => {
        this.props.onPickUp({
            skillId: itemId
        });
    };

    handleItemThrowDown = (itemId) => {
        this.props.onThrowDown({
            skillId: itemId
        });
    };

    handleSegmentInput = () => {
        let segment = this.refs.segment.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        this.setState({
            segment: segment
        });
    };

    /**
     * Lifecycle Functions
     */
    static getDerivedStateFromProps (nextProps, prevState) {
        let selectedList = [];
        let unselectedList = [];

        let idList = nextProps.data.map((skill) => {
            return skill.id;
        });

        SkillDataset.getNames().sort().forEach((skillId) => {
            let skillInfo = SkillDataset.getInfo(skillId);

            if (Helper.isEmpty(skillInfo)) {
                return;
            }

            if (false === skillInfo.from.jewel && false === skillInfo.from.armor) {
                return;
            }

            // Skip Selected Skills
            if (-1 !== idList.indexOf(skillInfo.id)) {
                selectedList.push(skillInfo);
            } else {
                unselectedList.push(skillInfo);
            }
        });

        return {
            selectedList: selectedList,
            unselectedList: unselectedList
        };
    }

    componentDidMount () {
        this.unsubscribe = ModalStates.store.subscribe(() => {
            this.setState({
                isShow: ModalStates.getters.isShowSkillItemSelector()
            });
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    /**
     * Render Functions
     */
    renderRow = (data, isSelect) => {
        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
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
                                <span>{_(skill.description)}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        {isSelect ? (
                            <FunctionalIcon
                                iconName="minus" altName={_('remove')}
                                onClick={() => {this.handleItemThrowDown(data.id)}} />
                        ) : (
                            <FunctionalIcon
                                iconName="plus" altName={_('add')}
                                onClick={() => {this.handleItemPickUp(data.id)}} />
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
                        <td>{_('name')}</td>
                        <td>{_('level')}</td>
                        <td>{_('description')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.selectedList.map((data, index) => {

                        // Create Text
                        let text = _(data.name);

                        data.list.forEach((data) => {
                            text += _(data.name) + _(data.description);
                        })

                        // Search Nameword
                        if (Helper.isNotEmpty(segment)
                            && -1 === text.toLowerCase().search(segment.toLowerCase())
                        ) {
                            return false;
                        }

                        return this.renderRow(data, true);
                    })}

                    {this.state.unselectedList.map((data, index) => {

                        // Create Text
                        let text = _(data.name);

                        data.list.forEach((data) => {
                            text += _(data.name) + _(data.description);
                        })

                        // Search Nameword
                        if (Helper.isNotEmpty(segment)
                            && -1 === text.toLowerCase().search(segment.toLowerCase())
                        ) {
                            return false;
                        }

                        return this.renderRow(data, false);
                    })}
                </tbody>
            </table>
        );
    };

    render () {
        return this.state.isShow ? (
            <div className="mhwc-selector" ref="modal" onClick={this.handleFastWindowClose}>
                <div className="mhwc-modal">
                    <div className="mhwc-panel">
                        <input className="mhwc-text_segment" type="text"
                            placeholder={_('inputKeyword')}
                            ref="segment" onChange={this.handleSegmentInput} />

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="times" altName={_('close')}
                                onClick={this.handleWindowClose} />
                        </div>
                    </div>
                    <div className="mhwc-list">
                        {this.renderTable()}
                    </div>
                </div>
            </div>
        ) : false;
    }
}
