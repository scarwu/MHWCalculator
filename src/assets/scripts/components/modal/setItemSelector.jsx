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
import React, { Fragment, useState, useEffect, useRef } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalButton from 'components/common/functionalButton';
import FunctionalInput from 'components/common/functionalInput';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default function SetItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalStates.getters.isShowSetItemSelector());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonStates.getters.getRequiredSets());
    const [stateList, updateList] = useState([]);
    const [stateSegment, updateSegment] = useState(null);
    const [stateSortedList, updateSortedList] = useState([]);
    const refModal = useRef();

    useEffect(() => {
        let idList = stateRequiredSets.map((set) => {
            return set.id;
        });

        let selectedList = [];
        let unselectedList = [];

        SetDataset.getNames().sort().forEach((setId) => {
            let setInfo = SetDataset.getInfo(setId);

            if (Helper.isEmpty(setInfo)) {
                return;
            }

            // Skip Selected Sets
            if (-1 !== idList.indexOf(setInfo.id)) {
                setInfo.isSelect = true;

                selectedList.push(setInfo);
            } else {
                setInfo.isSelect = false;

                unselectedList.push(setInfo);
            }
        });

        updateSortedList(selectedList.concat(unselectedList));
    }, [stateRequiredSets]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
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

    let handleSegmentInput = (event) => {
        let segment = event.target.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    };

    /**
     * Render Functions
     */
    let renderItem = (data, index) => {

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
        if (Helper.isNotEmpty(stateSegment)
            && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
        ) {
            return false;
        }

        return (
            <div key={data.id} className="mhwc-item mhwc-item-set">
                <div className="col-12 mhwc-name">
                    <span>{_(data.name)}</span>

                    <div className="mhwc-icons_bundle">
                        {data.isSelect ? (
                            <FunctionalButton
                                iconName="minus" altName={_('remove')}
                                onClick={() => {handleItemThrowDown(data.id)}} />
                        ) : (
                            <FunctionalButton
                                iconName="plus" altName={_('add')}
                                onClick={() => {handleItemPickUp(data.id)}} />
                        )}
                    </div>
                </div>
                <div className="col-12 mhwc-content">
                    {data.skills.map((skill, index) => {
                        let skillInfo = SkillDataset.getInfo(skill.id);

                        return (
                            <Fragment key={index}>
                                <div className="col-12 mhwc-name">
                                    <span>({skill.require}) {_(skillInfo.name)} Lv.{skill.level}</span>
                                </div>
                                <div className="col-12 mhwc-value mhwc-description">
                                    <span>{_(skillInfo.list[0].description)}</span>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        );
    };

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <span className="mhwc-title">{_('inventorySetting')}</span>

                    <div className="mhwc-icons_bundle">
                        <FunctionalInput
                            iconName="search" placeholder={_('inputKeyword')}
                            onChange={handleSegmentInput} />

                        <FunctionalButton
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        {stateSortedList.map(renderItem)}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
}
