'use strict';
/**
 * Condition Options
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalButton from 'components/common/functionalButton';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

/**
 * Handle Functions
 */
const handleRequireConditionRefresh = () => {
    CommonState.setter.cleanRequiredSets();
    CommonState.setter.cleanRequiredSkills();
};

const handleShowSetItemSelector = () => {
    ModalState.setter.showConditionItemSelector({
        mode: 'set'
    });
};

const handleShowSkillItemSelector = () => {
    ModalState.setter.showConditionItemSelector({
        mode: 'skill'
    });
};

/**
 * Render Functions
 */
const renderSetItem = (set) => {
    let setInfo = SetDataset.getInfo(set.id);

    if (Helper.isEmpty(setInfo)) {
        return false;
    }

    let setRequire = setInfo.skills[set.step - 1].require;

    return (
        <div key={setInfo.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(setInfo.name)} x {setRequire}</span>
                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="minus-circle" altName={_('down')}
                        onClick={() => {CommonState.setter.decreaseRequiredSetStep(set.id)}} />
                    <FunctionalButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonState.setter.increaseRequiredSetStep(set.id)}} />
                    <FunctionalButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.removeRequiredSet(set.id)}} />
                </div>
            </div>
            <div className="col-12 mhwc-value">
                {setInfo.skills.map((skill) => {
                    if (setRequire < skill.require) {
                        return false;
                    }

                    let skillInfo = SkillDataset.getInfo(skill.id);

                    return (Helper.isNotEmpty(skillInfo)) ? (
                        <div key={skill.id}>
                            <span>({skill.require}) {_(skillInfo.name)}</span>
                        </div>
                    ) : false;
                })}
            </div>
        </div>
    );
};

const renderSkillItem = (skill, enableSkillIdList) => {
    let skillInfo = SkillDataset.getInfo(skill.id);

    if (Helper.isEmpty(skillInfo)) {
        return false;
    }

    let currentSkillLevel = 0;
    let totalSkillLevel = 0;

    skillInfo.list.forEach((item) => {
        if (false === item.isHidden || -1 !== enableSkillIdList.indexOf(skillInfo.id)) {
            currentSkillLevel++;
        }

        totalSkillLevel++;
    });

    return (
        <div key={skillInfo.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                {(currentSkillLevel === totalSkillLevel) ? (
                    <span>{_(skillInfo.name)} Lv.{skill.level} / {currentSkillLevel}</span>
                ) : (
                    <span>{_(skillInfo.name)} Lv.{skill.level} / {currentSkillLevel} ({totalSkillLevel})</span>
                )}
                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="minus-circle" altName={_('down')}
                        onClick={() => {CommonState.setter.decreaseRequiredSkillLevel(skill.id)}} />
                    <FunctionalButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonState.setter.increaseRequiredSkillLevel(skill.id)}} />
                    <FunctionalButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.removeRequiredSkill(skill.id)}} />
                </div>
            </div>
            <div className="col-12 mhwc-value mhwc-description">
                <span>
                    {(0 !== skill.level)
                        ? _(skillInfo.list[skill.level - 1].description)
                        : _('skillLevelZero')}
                </span>
            </div>
        </div>
    );
};

/**
 * Sub Components
 */
const SetList = (props) => {

    /**
     * Hooks
     */
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredSets(CommonState.getter.getRequiredSets());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: ConditionOptions -> SetList');

        return stateRequiredSets.map(renderSetItem);
    }, [stateRequiredSets]);
};

const SkillList = (props) => {

    /**
     * Hooks
     */
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredSets(CommonState.getter.getRequiredSets());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: ConditionOptions -> SkillList');

        let enableSkillIdList = [];

        stateRequiredSets.forEach((set) => {
            let setInfo = SetDataset.getInfo(set.id);

            if (Helper.isEmpty(setInfo)) {
                return;
            }

            setInfo.skills.forEach((skill) => {
                let skillInfo = SkillDataset.getInfo(skill.id);

                if (Helper.isEmpty(skillInfo)) {
                    return;
                }

                skillInfo.list.forEach((item) => {
                    if (Helper.isEmpty(item.reaction)
                        || Helper.isEmpty(item.reaction.enableSkillLevel)
                    ) {
                        return;
                    }

                    enableSkillIdList.push(item.reaction.enableSkillLevel.id);
                });
            });
        });

        return stateRequiredSkills.map((skill) => {
            return renderSkillItem(skill, enableSkillIdList);
        });
    }, [stateRequiredSkills, stateRequiredSets]);
};

export default function ConditionOptions(props) {
    return (
        <div className="col mhwc-conditions">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('requireCondition')}</span>

                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="refresh" altName={_('reset')}
                        onClick={handleRequireConditionRefresh} />
                    <FunctionalButton
                        iconName="plus" altName={_('set')}
                        onClick={handleShowSetItemSelector} />
                    <FunctionalButton
                        iconName="plus" altName={_('skill')}
                        onClick={handleShowSkillItemSelector} />
                </div>
            </div>

            <div className="mhwc-list">
                <SetList />
                <SkillList />
            </div>
        </div>
    );
}
