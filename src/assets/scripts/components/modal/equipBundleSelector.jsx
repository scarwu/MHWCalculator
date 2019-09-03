'use strict';
/**
 * Equip Bundle Selector
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useRef, createRef } from 'react';
import MD5 from 'md5';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load Constant
import Constant from 'constant';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default function EquipBundleSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalStates.getters.isShowEquipBundleSelector());
    const [stateReservedBundles, updateReservedBundles] = useState(CommonStates.getters.getReservedBundles());
    const [stateCurrentEquips, updateCurrentEquips] = useState(CommonStates.getters.getCurrentEquips());
    const refModal = useRef();
    const refName = useRef();
    const refNameList = useRef(stateReservedBundles.map(() => createRef()));

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonStates.store.subscribe(() => {
            updateReservedBundles(CommonStates.getters.getReservedBundles());
            updateCurrentEquips(CommonStates.getters.getCurrentEquips());
        });

        const unsubscribeModal = ModalStates.store.subscribe(() => {
            updateIsShow(ModalStates.getters.isShowEquipBundleSelector());
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
        ModalStates.setters.hideEquipBundleSelector();
    };

    let handleBundleSave = (index) => {
        let name = Helper.isNotEmpty(index)
            ? refNameList.current[index].current.value
            : refName.current.value;

        if (0 === name.length) {
            return;
        }

        if (Helper.isNotEmpty(index)) {
            CommonStates.setters.updateReservedBundleName(index, name);
        } else {
            CommonStates.setters.addReservedBundle({
                id: MD5(JSON.stringify(stateCurrentEquips)),
                name: name,
                equips: stateCurrentEquips
            });
        }
    };

    let handleBundleRemove = (index) => {
        CommonStates.setters.removeReservedBundle(index);
    };

    let handleBundlePickUp = (index) => {
        let reservedBundles = stateReservedBundles;

        CommonStates.setters.replaceCurrentEquips(reservedBundles[index].equips);
        ModalStates.setters.hideEquipBundleSelector();
    };

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
            return false;
        }

        let bundleId = MD5(JSON.stringify(stateCurrentEquips));

        for (let index in stateReservedBundles) {
            if (bundleId === stateReservedBundles[index].id) {
                return false;
            }
        }

        return (
            <div className="mhwc-item mhwc-item-bundle">
                <div className="col-12 mhwc-name">
                    <input type="text" placeholder={_('inputName')} ref={refName} />

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="floppy-o" altName={_('save')}
                            onClick={() => {handleBundleSave(null)}} />
                    </div>
                </div>

                <div className="col-12 mhwc-value">
                    <div className="row">
                        {Object.keys(stateCurrentEquips).map((equipType, index) => {
                            if (Helper.isEmpty(stateCurrentEquips[equipType])) {
                                return false;
                            }

                            let equipInfo = null;

                            if ('weapon' === equipType) {
                                equipInfo = WeaponDataset.getInfo(stateCurrentEquips[equipType].id);
                            } else if ('helm' === equipType
                                || 'chest' === equipType
                                || 'arm' === equipType
                                || 'waist' === equipType
                                || 'leg' === equipType
                            ) {
                                equipInfo = ArmorDataset.getInfo(stateCurrentEquips[equipType].id);
                            } else if ('charm' === equipType) {
                                equipInfo = CharmDataset.getInfo(stateCurrentEquips[equipType].id);
                            }

                            return Helper.isNotEmpty(equipInfo) ? [(
                                <div key={`${equipType}_1`} className="col-2">
                                    <div className="mhwc-name">
                                        <span>{_(equipType)}</span>
                                    </div>
                                </div>
                            ), (
                                <div key={`${equipType}_2`} className="col-4">
                                    <div className="mhwc-value">
                                        <span>{_(equipInfo.name)}</span>
                                    </div>
                                </div>
                            )] : false;
                        })}
                    </div>
                </div>
            </div>
        );
    };

    let renderItem = (data, index) => {
        return (
            <div key={data.id} className="mhwc-item mhwc-item-bundle">
                <div className="col-12 mhwc-name">
                    <input type="text" placeholder={_('inputName')} ref={refNameList.current[index]} defaultValue={data.name} />

                    <div className="mhwc-icons_bundle">
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {handleBundlePickUp(index)}} />
                            <FunctionalIcon
                                iconName="times" altName={_('remove')}
                                onClick={() => {handleBundleRemove(index)}} />
                            <FunctionalIcon
                                iconName="floppy-o" altName={_('save')}
                                onClick={() => {handleBundleSave(index)}} />
                        </div>
                    </div>
                </div>
                <div className="col-12 mhwc-value">
                    <div className="row">
                        {Object.keys(data.equips).map((equipType, index) => {
                            if (Helper.isEmpty(data.equips[equipType])) {
                                return false;
                            }

                            let equipInfo = null;

                            if ('weapon' === equipType) {
                                equipInfo = WeaponDataset.getInfo(data.equips[equipType].id);
                            } else if ('helm' === equipType
                                || 'chest' === equipType
                                || 'arm' === equipType
                                || 'waist' === equipType
                                || 'leg' === equipType
                            ) {
                                equipInfo = ArmorDataset.getInfo(data.equips[equipType].id);
                            } else if ('charm' === equipType) {
                                equipInfo = CharmDataset.getInfo(data.equips[equipType].id);
                            }

                            return Helper.isNotEmpty(equipInfo) ? [(
                                <div key={`${equipType}_1`} className="col-2">
                                    <div className="mhwc-name">
                                        <span>{_(equipType)}</span>
                                    </div>
                                </div>
                            ), (
                                <div key={`${equipType}_2`} className="col-4">
                                    <div className="mhwc-value">
                                        <span>{_(equipInfo.name)}</span>
                                    </div>
                                </div>
                            )] : false;
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list">
                    {renderDefaultItem()}
                    {stateReservedBundles.map(renderItem)}
                </div>
            </div>
        </div>
    ) : false;
}
