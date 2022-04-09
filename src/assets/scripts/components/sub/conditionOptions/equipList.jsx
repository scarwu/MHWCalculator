/**
 * Condition Options: Equip List
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
import WeaponDataset from 'libraries/dataset/weapon'
import ArmorDataset from 'libraries/dataset/armor'
import CharmDataset from 'libraries/dataset/charm'

// Load Components
import IconButton from 'components/common/iconButton'

// Load State Control
import CommonState from 'states/common'

/**
 * Render Functions
 */
const renderEquipItem = (equipType, requiredEquip) => {
    if (Helper.isEmpty(requiredEquip)) {
        return false
    }

    let equipInfo = null

    if ('weapon' === equipType) {
        if ('customWeapon' === requiredEquip.id) {
            return (
                <div key={requiredEquip.id} className="col-12 mhwc-content">
                    <div className="col-4 mhwc-name">
                        <span>{_(equipType)}</span>
                    </div>
                    <div className="col-8 mhwc-value">
                        <span>{_('customWeapon')}: {_(requiredEquip.customWeapon.type)}</span>

                        <div className="mhwc-icons_bundle">
                            <IconButton
                                iconName="times" altName={_('clean')}
                                onClick={() => {CommonState.setter.setRequiredEquips(equipType, null)}} />
                        </div>
                    </div>
                </div>
            )
        }

        equipInfo = WeaponDataset.getInfo(requiredEquip.id)
    } else if ('helm' === equipType
        || 'chest' === equipType
        || 'arm' === equipType
        || 'waist' === equipType
        || 'leg' === equipType
    ) {
        equipInfo = ArmorDataset.getInfo(requiredEquip.id)
    } else if ('charm' === equipType) {
        equipInfo = CharmDataset.getInfo(requiredEquip.id)
    } else {
        return false
    }

    if (Helper.isEmpty(equipInfo)) {
        return false
    }

    return (
        <div key={equipInfo.id} className="col-12 mhwc-content">
            <div className="col-4 mhwc-name">
                <span>{_(equipType)}</span>
            </div>
            <div className="col-8 mhwc-value">
                <span>{_(equipInfo.name)}</span>

                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.setRequiredEquips(equipType, null)}} />
                </div>
            </div>
        </div>
    )
}

export default function EquipList (props) {

    /**
     * Hooks
     */
    const [stateRequiredEquips, updateRequiredEquips] = useState(CommonState.getter.getRequiredEquips())

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredEquips(CommonState.getter.getRequiredEquips())
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return useMemo(() => {
        Helper.debug('Component: ConditionOptions -> EquipList')

        if (Helper.isEmpty(stateRequiredEquips)) {
            return false
        }

        return (
            <div className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_('equip')}</span>
                </div>

                {Object.keys(stateRequiredEquips).map((equipType) => {
                    return renderEquipItem(equipType, stateRequiredEquips[equipType])
                })}
            </div>
        )
    }, [stateRequiredEquips])
}
