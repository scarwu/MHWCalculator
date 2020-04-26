/**
 * Condition Options: Set List
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import IconButton from 'components/common/iconButton';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

/**
 * Handle Functions
 */
const handleShowSetItemSelector = () => {
    ModalState.setter.showConditionItemSelector({
        mode: 'set'
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
        <div key={setInfo.id} className="col-12 mhwc-content">
            <div className="col-12 mhwc-name">
                <span>{_(setInfo.name)} x {setRequire}</span>

                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="minus-circle" altName={_('down')}
                        onClick={() => {CommonState.setter.decreaseRequiredSetStep(set.id)}} />
                    <IconButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonState.setter.increaseRequiredSetStep(set.id)}} />
                    <IconButton
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

export default function SetList (props) {

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
        Helper.debug('Component: ConditionOptions -> SetList');

        return (
            <div className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_('set')}</span>
                    <div className="mhwc-icons_bundle">
                        <IconButton
                            iconName="plus" altName={_('add')}
                            onClick={handleShowSetItemSelector} />
                    </div>
                </div>

                {stateRequiredSets.map(renderSetItem)}
            </div>
        );
    }, [stateRequiredSets]);
};
