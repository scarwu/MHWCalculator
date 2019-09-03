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
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default class SetItemSelector extends Component {

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            isShow: ModalStates.getters.isShowSetItemSelector(),
            requiredSets: CommonStates.getters.getRequiredSets(),
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
        ModalStates.setters.hideSetItemSelector();
    };

    handleItemPickUp = (itemId) => {
        CommonStates.setters.addRequiredSet({
            setId: itemId
        });
    };

    handleItemThrowDown = (itemId) => {
        CommonStates.setters.removeRequiredSet({
            setId: itemId
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

    initState = () => {
        let idList = this.state.requiredSets.map((set) => {
            return set.id;
        });

        let selectedList = [];
        let unselectedList = [];

        SetDataset.getNames().sort().forEach((setId) => {
            let set = SetDataset.getInfo(setId);

            if (Helper.isEmpty(set)) {
                return;
            }

            // Skip Selected Sets
            if (-1 !== idList.indexOf(set.id)) {
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
    componentDidMount () {
        this.initState();

        this.unsubscribeCommon = CommonStates.store.subscribe(() => {
            this.setState({
                requiredSets: CommonStates.getters.getRequiredSets()
            });
        });

        this.unsubscribeModal = ModalStates.store.subscribe(() => {
            this.setState({
                isShow: ModalStates.getters.isShowSetItemSelector()
            });
        });
    }

    componentWillUnmount(){
        this.unsubscribeCommon();
        this.unsubscribeModal();
    }

    /**
     * Render Functions
     */
    renderRow = (data, isSelect) => {
        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td>
                    {data.skills.map((skill, index) => {
                        return (
                            <div key={index}>
                                <span>({skill.require}) {_(skill.name)}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    {data.skills.map((skill, index) => {
                        let skillInfo = SkillDataset.getInfo(skill.id);

                        return (Helper.isNotEmpty(skillInfo)) ? (
                            <div key={index}>
                                <span>{_(skillInfo.list[0].description)}</span>
                            </div>
                        ) : false;
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
            <table className="mhwc-set_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('skill')}</td>
                        <td>{_('description')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.selectedList.map((data, index) => {

                        // Create Text
                        let text = _(data.name);

                        data.skills.forEach((data) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            if (Helper.isEmpty(skillInfo)) {
                                return;
                            }

                            text += _(skillInfo.name) + skillInfo.list.map((item) => {
                                return _(item.description);
                            }).join('');
                        });

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

                        data.skills.forEach((data) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            if (Helper.isEmpty(skillInfo)) {
                                return;
                            }

                            text += _(skillInfo.name) + skillInfo.list.map((item) => {
                                return _(item.description);
                            }).join('');
                        });

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
