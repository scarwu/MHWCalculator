/**
 * Condition Options: Skill List
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useState, useEffect, useMemo } from 'react'

// Load Core
import _ from 'core/lang'
import Helper from 'core/helper'

// Load Libraries
import SetDataset from 'libraries/dataset/set'
import SkillDataset from 'libraries/dataset/skill'

// Load Components
import IconButton from 'components/common/iconButton'

// Load State Control
import CommonState from 'states/common'
import ModalState from 'states/modal'

/**
 * Handle Functions
 */
const handleShowSkillItemSelector = () => {
    ModalState.setter.showConditionItemSelector({
        mode: 'skill'
    })
}

/**
 * Render Functions
 */
const renderSkillItem = (skill, enableSkillIdList) => {
    let skillInfo = SkillDataset.getInfo(skill.id)

    if (Helper.isEmpty(skillInfo)) {
        return false
    }

    let currentSkillLevel = 0
    let totalSkillLevel = 0

    skillInfo.list.forEach((item) => {
        if (false === item.isHidden || -1 !== enableSkillIdList.indexOf(skillInfo.id)) {
            currentSkillLevel++
        }

        totalSkillLevel++
    })

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
    )
}

export default function SkillList(props) {

    /**
     * Hooks
     */
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets())
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills())

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredSets(CommonState.getter.getRequiredSets())
            updateRequiredSkills(CommonState.getter.getRequiredSkills())
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return useMemo(() => {
        Helper.debug('Component: ConditionOptions -> SkillList')

        let enableSkillIdList = []

        stateRequiredSets.forEach((set) => {
            let setInfo = SetDataset.getInfo(set.id)

            if (Helper.isEmpty(setInfo)) {
                return
            }

            setInfo.skills.forEach((skill) => {
                let skillInfo = SkillDataset.getInfo(skill.id)

                if (Helper.isEmpty(skillInfo)) {
                    return
                }

                skillInfo.list.forEach((item) => {
                    if (Helper.isEmpty(item.reaction)
                        || Helper.isEmpty(item.reaction.enableSkillLevel)
                    ) {
                        return
                    }

                    if (Helper.isNotEmpty(item.reaction.enableSkillLevel.id)) {
                        enableSkillIdList.push(item.reaction.enableSkillLevel.id)
                    }

                    if (Helper.isNotEmpty(item.reaction.enableSkillLevel.ids)) {
                        item.reaction.enableSkillLevel.ids.forEach((skillId) => {
                            enableSkillIdList.push(skillId)
                        })
                    }
                })
            })
        })

        return (
            <div className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_('skill')}</span>
                    <div className="mhwc-icons_bundle">
                        <IconButton
                            iconName="plus" altName={_('add')}
                            onClick={handleShowSkillItemSelector} />
                    </div>
                </div>

                {stateRequiredSkills.map((skill) => {
                    return renderSkillItem(skill, enableSkillIdList)
                })}
             </div>
        )
    }, [stateRequiredSkills, stateRequiredSets])
}
