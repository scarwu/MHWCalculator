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
import React, { useState, useEffect, useRef } from 'react';

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

export default function SetItemSelector(props) {

    /**
     * Hooks
     */
    const refModal = useRef();
    const refSegment = useRef();
    const [stateIsShow, updateIsShow] = useState(ModalStates.getters.isShowSetItemSelector());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonStates.getters.getRequiredSets());
    const [stateList, updateList] = useState([]);
    const [stateSegment, updateSegment] = useState(null);
    const [stateSelectedList, updateSelectedList] = useState([]);
    const [stateUnselectedList, updateUnselectedList] = useState([]);

    // Will Mount
    useEffect(() => {
        initState();
    }, [stateRequiredSets, updateIsShow]);

    // Did Mount & Will Unmount
    useEffect(() => {
        initState();

        const unsubscribeCommon = CommonStates.store.subscribe(() => {
            updateRequiredSets(CommonStates.getters.getRequiredSets());
        });

        const unsubscribeModal = ModalStates.store.subscribe(() => {
            updateIsShow(ModalStates.getters.isShowSetItemSelector());
        });

        return () => {
            unsubscribeCommon();
            unsubscribeModal();
        };
    }, []);

    /**
     * Handle Functions
     */
    let handleFastWindowClose = (event) => {
        if (refModal.current !== event.target) {
            return;
        }

        handleWindowClose();
    };

    let handleWindowClose = () => {
        ModalStates.setters.hideSetItemSelector();
    };

    let handleItemPickUp = (itemId) => {
        CommonStates.setters.addRequiredSet({
            setId: itemId
        });
    };

    let handleItemThrowDown = (itemId) => {
        CommonStates.setters.removeRequiredSet({
            setId: itemId
        });
    };

    let handleSegmentInput = () => {
        let segment = refSegment.current.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    };

    let initState = () => {
        let idList = stateRequiredSets.map((set) => {
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

        updateSelectedList(selectedList);
        updateUnselectedList(unselectedList);
    };

    /**
     * Render Functions
     */
    let renderRow = (data, isSelect) => {
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
                                onClick={() => {handleItemThrowDown(data.id)}} />
                        ) : (
                            <FunctionalIcon
                                iconName="plus" altName={_('add')}
                                onClick={() => {handleItemPickUp(data.id)}} />
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    let renderTable = () => {
        let segment = stateSegment;

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
                    {stateSelectedList.map((data, index) => {

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

                        return renderRow(data, true);
                    })}

                    {stateUnselectedList.map((data, index) => {

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

                        return renderRow(data, false);
                    })}
                </tbody>
            </table>
        );
    };

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <input className="mhwc-text_segment" type="text"
                        placeholder={_('inputKeyword')}
                        ref={refSegment} onChange={handleSegmentInput} />

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list">
                    {renderTable()}
                </div>
            </div>
        </div>
    ) : false;
}
