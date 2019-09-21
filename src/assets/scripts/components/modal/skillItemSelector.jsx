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
import React, { Fragment, useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
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
const renderSkillItem = (skill) => {
    return (
        <div key={skill.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(skill.name)}</span>

                <div className="mhwc-icons_bundle">
                    {skill.isSelect ? (
                        <FunctionalButton
                            iconName="minus" altName={_('remove')}
                            onClick={() => {CommonState.setter.removeRequiredSkill(skill.id)}} />
                    ) : (
                        <FunctionalButton
                            iconName="plus" altName={_('add')}
                            onClick={() => {CommonState.setter.addRequiredSkill(skill.id)}} />
                    )}
                </div>
            </div>
            <div className="col-12 mhwc-content">
                {skill.list.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="col-2 mhwc-name">
                                <span>Lv.{item.level}</span>
                            </div>
                            <div className="col-10 mhwc-value mhwc-description">
                                <span>{_(item.description)}</span>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Sub Components
 */
const SkillList = (props) => {
    const {data} = props;

    return useMemo(() => {
        Helper.log('Component: SkillItemSelector -> SkillList');

        return data.map(renderSkillItem);
    }, [data]);
};

export default function SkillItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowSkillItemSelector());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());
    const [stateList, updateList] = useState([]);
    const [stateSegment, updateSegment] = useState(null);
    const [stateSortedList, updateSortedList] = useState([]);
    const refModal = useRef();

    useEffect(() => {
        const idList = stateRequiredSkills.map((skill) => {
            return skill.id;
        });

        let selectedList = [];
        let unselectedList = [];

        SkillDataset.getItems().forEach((skillInfo) => {
            if (false === skillInfo.from.jewel && false === skillInfo.from.armor) {
                return;
            }

            if (-1 !== idList.indexOf(skillInfo.id)) {
                skillInfo.isSelect = true;

                selectedList.push(skillInfo);
            } else {
                skillInfo.isSelect = false;

                unselectedList.push(skillInfo);
            }
        });

        updateSortedList(selectedList.concat(unselectedList));
    }, [stateRequiredSkills]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonState.store.subscribe(() => {
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        const unsubscribeModal = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowSkillItemSelector());
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

        ModalState.setter.hideSkillItemSelector();
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
                            onClick={ModalState.setter.hideSkillItemSelector} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        <SkillList data={stateSortedList.filter((skill) => {

                            // Create Text
                            let text = _(skill.name);

                            skill.list.forEach((item) => {
                                text += _(item.name) + _(item.description);
                            })

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
