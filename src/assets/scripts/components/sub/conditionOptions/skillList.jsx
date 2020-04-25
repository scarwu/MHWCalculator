/**
 * Condition Options: Skill List
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

/**
 * Render Functions
 */
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
        <div key={skillInfo.id} className="col-12 mhwc-content">
            <div className="col-12 mhwc-name">
                {(currentSkillLevel === totalSkillLevel) ? (
                    <span>{_(skillInfo.name)} Lv.{skill.level} / {currentSkillLevel}</span>
                ) : (
                    <span>{_(skillInfo.name)} Lv.{skill.level} / {currentSkillLevel} ({totalSkillLevel})</span>
                )}

                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="minus-circle" altName={_('down')}
                        onClick={() => {CommonState.setter.decreaseRequiredSkillLevel(skill.id)}} />
                    <IconButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonState.setter.increaseRequiredSkillLevel(skill.id)}} />
                    <IconButton
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

export default function SkillList(props) {

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
        Helper.debug('Component: ConditionOptions -> SkillList');

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
