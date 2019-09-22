'use strict';
/**
 * Condition Item Selector
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
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalButton from 'components/common/functionalButton';
import FunctionalSelector from 'components/common/functionalSelector';
import FunctionalInput from 'components/common/functionalInput';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

/**
 * Variables
 */
const modeList = [
    { key: 'set', value: _('set') },
    { key: 'skill', value: _('skill') }
];

/**
 * Handle Functions
 */
const handleModeChange = (event) => {
    ModalState.setter.showConditionItemSelector({
        mode: event.target.value
    });
};

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
                                {item.isHidden ? (
                                    <span>(Lv.{item.level})</span>
                                ) : (
                                    <span>Lv.{item.level}</span>
                                )}
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
const SetList = (props) => {
    const {data} = props;

    return useMemo(() => {
        Helper.log('Component: ConditionItemSelector -> SetList');

        return data.map(renderSetItem);
    }, [data]);
};

const SkillList = (props) => {
    const {data} = props;

    return useMemo(() => {
        Helper.log('Component: ConditionItemSelector -> SkillList');

        return data.map(renderSkillItem);
    }, [data]);
};

export default function ConditionItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowConditionItemSelector());
    const [stateBypassData, updateBypassData] = useState(ModalState.getter.getConditionItemSelectorBypassData());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());
    const [stateMode, updateMode] = useState(undefined);
    const [stateSortedList, updateSortedList] = useState([]);
    const [stateSegment, updateSegment] = useState(undefined);
    const refModal = useRef();

    useEffect(() => {
        if (Helper.isEmpty(stateBypassData)) {
            return;
        }

        let idList = [];
        let selectedList = [];
        let unselectedList = [];

        switch (stateBypassData.mode) {
        case 'set':
            idList = stateRequiredSets.map((set) => {
                return set.id;
            });

            SetDataset.getItems().forEach((setInfo) => {
                if (-1 !== idList.indexOf(setInfo.id)) {
                    setInfo.isSelect = true;

                    selectedList.push(setInfo);
                } else {
                    setInfo.isSelect = false;

                    unselectedList.push(setInfo);
                }
            });

            break;
        case 'skill':
            idList = stateRequiredSkills.map((skill) => {
                return skill.id;
            });

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

            break;
        default:
            return;
        }

        updateMode(stateBypassData.mode);
        updateSortedList(selectedList.concat(unselectedList));
    }, [stateBypassData, stateRequiredSets, stateRequiredSkills]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonState.store.subscribe(() => {
            updateRequiredSets(CommonState.getter.getRequiredSets());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        const unsubscribeModal = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowConditionItemSelector());
            updateBypassData(ModalState.getter.getConditionItemSelectorBypassData());
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

        ModalState.setter.hideConditionItemSelector();
    }, []);

    const handleSegmentInput = useCallback((event) => {
        let segment = event.target.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    }, []);

    const getContent = useCallback(() => {
        switch (stateMode) {
        case 'set':
            return (
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
            );
        case 'skill':
            return (
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
            );
        default:
            return false;
        }
    }, [
        stateMode,
        stateSortedList,
        stateSegment
    ]);

    return (stateIsShow && Helper.isNotEmpty(stateBypassData)) ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <span className="mhwc-title">{_(stateMode + 'List')}</span>

                    <div className="mhwc-icons_bundle">
                        <FunctionalInput
                            iconName="search" placeholder={_('inputKeyword')}
                            defaultValue={stateSegment} onChange={handleSegmentInput} />
                        <FunctionalSelector
                            iconName="globe" defaultValue={stateMode}
                            options={modeList} onChange={handleModeChange} />
                        <FunctionalButton
                            iconName="times" altName={_('close')}
                            onClick={ModalState.setter.hideConditionItemSelector} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        {getContent()}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
}
