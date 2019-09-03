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
import React, { useState, useEffect, useRef } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default function SkillItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalStates.getters.isShowSkillItemSelector());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonStates.getters.getRequiredSkills());
    const [stateList, updateList] = useState([]);
    const [stateSegment, updateSegment] = useState(null);
    const [stateSelectedList, updateSelectedList] = useState([]);
    const [stateUnselectedList, updateUnselectedList] = useState([]);
    const refModal = useRef();
    const refSegment = useRef();

    useEffect(() => {
        let idList = stateRequiredSkills.map((skill) => {
            return skill.id;
        });

        let selectedList = [];
        let unselectedList = [];

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

        updateSelectedList(selectedList);
        updateUnselectedList(unselectedList);
    }, [stateRequiredSkills]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonStates.store.subscribe(() => {
            updateRequiredSkills(CommonStates.getters.getRequiredSkills());
        });

        const unsubscribeModal = ModalStates.store.subscribe(() => {
            updateIsShow(ModalStates.getters.isShowSkillItemSelector());
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
        ModalStates.setters.hideSkillItemSelector();
    };

    let handleItemPickUp = (itemId) => {
        CommonStates.setters.addRequiredSkill({
            skillId: itemId
        });
    };

    let handleItemThrowDown = (itemId) => {
        CommonStates.setters.removeRequiredSkill({
            skillId: itemId
        });
    };

    let handleSegmentInput = () => {
        let segment = refSegment.current.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    };

    /**
     * Render Functions
     */
    let renderRow = (data, isSelect) => {
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
                    {stateSelectedList.map((data, index) => {

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

                        return renderRow(data, true);
                    })}

                    {stateUnselectedList.map((data, index) => {

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
