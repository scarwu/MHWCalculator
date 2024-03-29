/**
 * Bundle Item Selector
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useState, useEffect, useCallback, useRef, createRef } from 'react'
import MD5 from 'md5'

// Load Constant
import Constant from 'constant'

// Load Core
import _ from 'core/lang'
import Helper from 'core/helper'

// Load Libraries
import WeaponDataset from 'libraries/dataset/weapon'
import ArmorDataset from 'libraries/dataset/armor'
import CharmDataset from 'libraries/dataset/charm'

// Load Components
import IconButton from 'components/common/iconButton'
import BasicInput from 'components/common/basicInput'

// Load State Control
import CommonState from 'states/common'
import ModalState from 'states/modal'

export default function BundleItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowBundleItemSelector())
    const [stateReservedBundles, updateReservedBundles] = useState(CommonState.getter.getReservedBundles())
    const [stateCurrentEquips, updateCurrentEquips] = useState(CommonState.getter.getCurrentEquips())
    const refModal = useRef()
    const refName = useRef()
    const refNameList = useRef(stateReservedBundles.map(() => createRef()))

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonState.store.subscribe(() => {
            updateReservedBundles(CommonState.getter.getReservedBundles())
            updateCurrentEquips(CommonState.getter.getCurrentEquips())

            refNameList.current = CommonState.getter.getReservedBundles().map(() => createRef())
        })

        const unsubscribeModal = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowBundleItemSelector())
        })

        return () => {
            unsubscribeCommon()
            unsubscribeModal()
        }
    }, [])

    /**
     * Handle Functions
     */
    const handleFastWindowClose = useCallback((event) => {
        if (refModal.current !== event.target) {
            return
        }

        ModalState.setter.hideBundleItemSelector()
    }, [])

    const handleBundleSave = useCallback((index) => {
        let name = Helper.isNotEmpty(index)
            ? refNameList.current[index].current.value
            : refName.current.value

        if (0 === name.length) {
            return
        }

        if (Helper.isNotEmpty(index)) {
            CommonState.setter.updateReservedBundleName(index, name)
        } else {
            let customWeapon = null

            if (Helper.isNotEmpty(stateCurrentEquips.weapon)
                && 'customWeapon' === stateCurrentEquips.weapon.id
            ) {
                customWeapon = CommonState.getter.getCustomWeapon()
            }

            CommonState.setter.addReservedBundle({
                id: MD5(JSON.stringify(stateCurrentEquips)),
                name: name,
                equips: stateCurrentEquips,
                customWeapon: customWeapon
            })
        }
    }, [stateCurrentEquips])

    const handleBundlePickUp = useCallback((index) => {
        if (Helper.isNotEmpty(stateReservedBundles[index].customWeapon)) {
            CommonState.setter.replaceCustomWeapon(stateReservedBundles[index].customWeapon)
        }

        CommonState.setter.replaceCurrentEquips(stateReservedBundles[index].equips)

        ModalState.setter.hideBundleItemSelector()
    }, [stateReservedBundles])

    /**
     * Render Functions
     */
    let renderDefaultItem = () => {
        if (Helper.isEmpty(stateCurrentEquips.weapon.id)
            && Helper.isEmpty(stateCurrentEquips.helm.id)
            && Helper.isEmpty(stateCurrentEquips.chest.id)
            && Helper.isEmpty(stateCurrentEquips.arm.id)
            && Helper.isEmpty(stateCurrentEquips.waist.id)
            && Helper.isEmpty(stateCurrentEquips.leg.id)
            && Helper.isEmpty(stateCurrentEquips.charm.id)
        ) {
            return false
        }

        let bundleId = MD5(JSON.stringify(stateCurrentEquips))

        for (let index in stateReservedBundles) {
            if (bundleId === stateReservedBundles[index].id) {
                return false
            }
        }

        return (
            <div key={bundleId} className="mhwc-item mhwc-item-2-step">
                <div className="col-12 mhwc-name">
                    <BasicInput placeholder={_('inputName')} bypassRef={refName} />

                    <div className="mhwc-icons_bundle">
                        <IconButton
                            iconName="floppy-o" altName={_('save')}
                            onClick={() => {handleBundleSave(null)}} />
                    </div>
                </div>

                <div className="col-12 mhwc-content">
                    {Object.keys(stateCurrentEquips).map((equipType, index) => {
                        if (Helper.isEmpty(stateCurrentEquips[equipType])) {
                            return false
                        }

                        let equipInfo = null

                        if ('weapon' === equipType) {
                            if ('customWeapon' === stateCurrentEquips[equipType].id) {
                                equipInfo = CommonState.getter.getCustomWeapon()

                                return Helper.isNotEmpty(equipInfo) ? (
                                    <div key={equipType} className="col-6 mhwc-value">
                                        <span>{_(equipInfo.name)}: {_(equipInfo.type)}</span>
                                    </div>
                                ) : false
                            }

                            equipInfo = WeaponDataset.getInfo(stateCurrentEquips[equipType].id)
                        } else if ('helm' === equipType
                            || 'chest' === equipType
                            || 'arm' === equipType
                            || 'waist' === equipType
                            || 'leg' === equipType
                        ) {
                            equipInfo = ArmorDataset.getInfo(stateCurrentEquips[equipType].id)
                        } else if ('charm' === equipType) {
                            equipInfo = CharmDataset.getInfo(stateCurrentEquips[equipType].id)
                        }

                        return Helper.isNotEmpty(equipInfo) ? (
                            <div key={index} className="col-6 mhwc-value">
                                <span>{_(equipInfo.name)}</span>
                            </div>
                        ) : false
                    })}
                </div>
            </div>
        )
    }

    let renderItem = (data, index) => {
        return (
            <div key={`${data.id}:${index}`} className="mhwc-item mhwc-item-2-step">
                <div className="col-12 mhwc-name">
                    <BasicInput placeholder={_('inputName')} defaultValue={data.name}
                        bypassRef={refNameList.current[index]} />

                    <div className="mhwc-icons_bundle">
                        <IconButton
                            iconName="check" altName={_('select')}
                            onClick={() => {handleBundlePickUp(index)}} />
                        <IconButton
                            iconName="times" altName={_('remove')}
                            onClick={() => {CommonState.setter.removeReservedBundle(index)}} />
                        <IconButton
                            iconName="floppy-o" altName={_('save')}
                            onClick={() => {handleBundleSave(index)}} />
                    </div>
                </div>
                <div className="col-12 mhwc-content">
                    {Object.keys(data.equips).map((equipType, index) => {
                        if (Helper.isEmpty(data.equips[equipType])) {
                            return false
                        }

                        let equipInfo = null

                        if ('weapon' === equipType) {
                            if ('customWeapon' === data.equips[equipType].id) {
                                equipInfo = data.customWeapon

                                return Helper.isNotEmpty(equipInfo) ? (
                                    <div key={equipType} className="col-6 mhwc-value">
                                        <span>{_(equipInfo.name)}: {_(equipInfo.type)}</span>
                                    </div>
                                ) : false
                            }

                            equipInfo = WeaponDataset.getInfo(data.equips[equipType].id)
                        } else if ('helm' === equipType
                            || 'chest' === equipType
                            || 'arm' === equipType
                            || 'waist' === equipType
                            || 'leg' === equipType
                        ) {
                            equipInfo = ArmorDataset.getInfo(data.equips[equipType].id)
                        } else if ('charm' === equipType) {
                            equipInfo = CharmDataset.getInfo(data.equips[equipType].id)
                        }

                        return Helper.isNotEmpty(equipInfo) ? (
                            <div key={index} className="col-6 mhwc-value">
                                <span>{_(equipInfo.name)}</span>
                            </div>
                        ) : false
                    })}
                </div>
            </div>
        )
    }

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <span className="mhwc-title">{_('bundleList')}</span>

                    <div className="mhwc-icons_bundle">
                        <IconButton
                            iconName="times" altName={_('close')}
                            onClick={ModalState.setter.hideBundleItemSelector} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        {renderDefaultItem()}
                        {stateReservedBundles.map(renderItem)}
                    </div>
                </div>
            </div>
        </div>
    ) : false
}
