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
import React, { Fragment, useState, useEffect, useRef, useCallback, useMemo } from 'react';

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
import CommonState from 'states/common';
import ModalState from 'states/modal';

/**
 * Render Functions
 */
const renderSetItem = (set) => {
    return (
        <div key={set.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(set.name)}</span>

                <div className="mhwc-icons_bundle">
                    {set.isSelect ? (
                        <FunctionalButton
                            iconName="minus" altName={_('remove')}
                            onClick={() => {CommonState.setter.removeRequiredSet(set.id)}} />
                    ) : (
                        <FunctionalButton
                            iconName="plus" altName={_('add')}
                            onClick={() => {CommonState.setter.addRequiredSet(set.id)}} />
                    )}
                </div>
            </div>
            <div className="col-12 mhwc-content">
                {set.skills.map((skill, index) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

                    return Helper.isNotEmpty(skillInfo) ? (
                        <Fragment key={index}>
                            <div className="col-12 mhwc-name">
                                <span>({skill.require}) {_(skillInfo.name)} Lv.{skill.level}</span>
                            </div>
                            <div className="col-12 mhwc-value mhwc-description">
                                <span>{_(skillInfo.list[0].description)}</span>
                            </div>
                        </Fragment>
                    ) : false;
                })}
            </div>
        </div>
    );
};

/**
 * Sub Components
 */
const SetList = (props) => {
    const {data} = props;

    return useMemo(() => {
        Helper.log('Component: SetItemSelector -> SetList');

        return data.map(renderSetItem);
    }, [data]);
};

export default function SetItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowSetItemSelector());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateList, updateList] = useState([]);
    const [stateSegment, updateSegment] = useState(null);
    const [stateSortedList, updateSortedList] = useState([]);
    const refModal = useRef();

    useEffect(() => {
        const idList = stateRequiredSets.map((set) => {
            return set.id;
        });

        let selectedList = [];
        let unselectedList = [];

        SetDataset.getItems().forEach((setInfo) => {
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
        const unsubscribeCommon = CommonState.store.subscribe(() => {
            updateRequiredSets(CommonState.getter.getRequiredSets());
        });

        const unsubscribeModal = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowSetItemSelector());
        });

        return () => {
            unsubscribeCommon();
            unsubscribeModal();
        };
    }, []);

    /**
     * Handle Functions
     */
    const handleFastWindowClose = useCallback((event) => {
        if (refModal.current !== event.target) {
            return;
        }

        ModalState.setter.hideSetItemSelector();
    }, []);

    const handleSegmentInput = useCallback((event) => {
        let segment = event.target.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    }, []);

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
                            onClick={ModalState.setter.hideSetItemSelector} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        <SetList data={stateSortedList.filter((set) => {

                            // Create Text
                            let text = _(set.name);

                            set.skills.forEach((set) => {
                                let skillInfo = SkillDataset.getInfo(set.id);

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

                            return true;
                        })} />
                    </div>
                </div>
            </div>
        </div>
    ) : false;
}
