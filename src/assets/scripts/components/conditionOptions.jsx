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
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalButton from 'components/common/functionalButton';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

/**
 * Handle Functions
 */
const handleRequireConditionRefresh = () => {
    CommonStates.setters.cleanRequiredSets();
    CommonStates.setters.cleanRequiredSkills();
};

/**
 * Render Functions
 */
const renderSetItem = (set, index) => {
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
                        onClick={() => {CommonStates.setters.decreaseRequiredSetStep(index)}} />
                    <FunctionalButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonStates.setters.increaseRequiredSetStep(index)}} />
                    <FunctionalButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonStates.setters.removeRequiredSetByIndex(index)}} />
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

const renderSkillItem = (skill, index) => {
    let skillInfo = SkillDataset.getInfo(skill.id);

    if (Helper.isEmpty(skillInfo)) {
        return false;
    }

    return (
        <div key={skillInfo.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(skillInfo.name)} Lv.{skill.level} / {skillInfo.list.length}</span>
                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="minus-circle" altName={_('down')}
                        onClick={() => {CommonStates.setters.decreaseRequiredSkillLevel(index)}} />
                    <FunctionalButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonStates.setters.increaseRequiredSkillLevel(index)}} />
                    <FunctionalButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonStates.setters.removeRequiredSkillByIndex(index)}} />
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
    const {data} = props;

    return useMemo(() => {
        Helper.log('Component: SetList');

        return data.map(renderSetItem);
    }, [data]);
};

const SkillList = (props) => {
    const {data} = props;

    return useMemo(() => {
        Helper.log('Component: SkillList');

        return data.map(renderSkillItem);
    }, [data]);
};

export default function ConditionOptions(props) {

    /**
     * Hooks
     */
    const [stateRequiredSets, updateRequiredSets] = useState(CommonStates.getters.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonStates.getters.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonStates.store.subscribe(() => {
            updateRequiredSets(CommonStates.getters.getRequiredSets());
            updateRequiredSkills(CommonStates.getters.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="col mhwc-conditions">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('requireCondition')}</span>

                <div className="mhwc-icons_bundle">
                    <FunctionalButton
                        iconName="refresh" altName={_('reset')}
                        onClick={handleRequireConditionRefresh} />
                    <FunctionalButton
                        iconName="plus" altName={_('skill')}
                        onClick={ModalStates.setters.showSkillItemSelector} />
                    <FunctionalButton
                        iconName="plus" altName={_('set')}
                        onClick={ModalStates.setters.showSetItemSelector} />
                </div>
            </div>

            <div className="mhwc-list">
                <SetList data={stateRequiredSets} />
                <SkillList data={stateRequiredSkills} />
            </div>
        </div>
    );
}
