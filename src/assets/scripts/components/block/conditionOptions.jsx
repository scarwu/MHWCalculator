/**
 * Condition Options
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useState, useEffect, useCallback } from 'react'

// Load Core
import _ from 'core/lang'
import Helper from 'core/helper'

// Load Components
import EquipList from 'components/sub/conditionOptions/equipList'
import SetList from 'components/sub/conditionOptions/setList'
import SkillList from 'components/sub/conditionOptions/skillList'
import IconButton from 'components/common/iconButton'
import IconTab from 'components/common/iconTab'

// Load State Control
import CommonState from 'states/common'

/**
 * Handle Functions
 */
const handleRequireConditionRefresh = () => {
    CommonState.setter.cleanRequiredEquips()
    CommonState.setter.cleanRequiredSets()
    CommonState.setter.cleanRequiredSkills()
}

const handleSwitchTempData = (index) => {
    CommonState.setter.switchTempData('conditionOptions', index)
}

export default function ConditionOptions(props) {

    /**
     * Hooks
     */
    const [stateTempData, updateTempData] = useState(CommonState.getter.getTempData())

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateTempData(CommonState.getter.getTempData())
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <div className="col mhwc-conditions">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('requireCondition')}</span>

                <div className="mhwc-icons_bundle-left">
                    <IconTab
                        iconName="circle-o" altName={_('tab') + ' 1'}
                        isActive={0 === stateTempData.conditionOptions.index}
                        onClick={() => {handleSwitchTempData(0)}} />
                    <IconTab
                        iconName="circle-o" altName={_('tab') + ' 2'}
                        isActive={1 === stateTempData.conditionOptions.index}
                        onClick={() => {handleSwitchTempData(1)}} />
                    <IconTab
                        iconName="circle-o" altName={_('tab') + ' 3'}
                        isActive={2 === stateTempData.conditionOptions.index}
                        onClick={() => {handleSwitchTempData(2)}} />
                    <IconTab
                        iconName="circle-o" altName={_('tab') + ' 4'}
                        isActive={3 === stateTempData.conditionOptions.index}
                        onClick={() => {handleSwitchTempData(3)}} />
                </div>

                <div className="mhwc-icons_bundle-right">
                    <IconButton
                        iconName="refresh" altName={_('reset')}
                        onClick={handleRequireConditionRefresh} />
                </div>
            </div>

            <div className="mhwc-list">
                <EquipList />
                <SetList />
                <SkillList />
            </div>
        </div>
    )
}
