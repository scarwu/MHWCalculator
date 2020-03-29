/**
 * Bundle Item Selector
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useCallback, useRef, createRef } from 'react';
import MD5 from 'md5';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';

// Load Components
import IconButton from 'components/common/iconButton';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Constant
import Constant from 'constant';

export default function BundleItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowBundleItemSelector());
    const [stateReservedBundles, updateReservedBundles] = useState(CommonState.getter.getReservedBundles());
    const [stateCurrentEquips, updateCurrentEquips] = useState(CommonState.getter.getCurrentEquips());
    const refModal = useRef();
    const refName = useRef();
    const refNameList = useRef(stateReservedBundles.map(() => createRef()));

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonState.store.subscribe(() => {
            updateReservedBundles(CommonState.getter.getReservedBundles());
            updateCurrentEquips(CommonState.getter.getCurrentEquips());

            refNameList.current = CommonState.getter.getReservedBundles().map(() => createRef());
        });

        const unsubscribeModal = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowBundleItemSelector());
        });

        return () => {
            unsubscribeCommon();
            unsubscribeModal();
        };
    }, []);

    /**
     * Handle Functions
     */
    const handleFastWindowClose = useCallback((event) => {
        if (refModal.current !== event.target) {
            return;
        }

        ModalState.setter.hideBundleItemSelector();
    }, []);

    const handleBundleSave = useCallback((index) => {
        let name = Helper.isNotEmpty(index)
            ? refNameList.current[index].current.value
            : refName.current.value;

        if (0 === name.length) {
            return;
        }

        if (Helper.isNotEmpty(index)) {
            CommonState.setter.updateReservedBundleName(index, name);
        } else {
            CommonState.setter.addReservedBundle({
                id: MD5(JSON.stringify(stateCurrentEquips)),
                name: name,
                equips: stateCurrentEquips
            });
        }
    }, [stateCurrentEquips]);

    const handleBundlePickUp = useCallback((index) => {
        CommonState.setter.replaceCurrentEquips(stateReservedBundles[index].equips);
        ModalState.setter.hideBundleItemSelector();
    }, [stateReservedBundles]);

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
            <div key={bundleId} className="mhwc-item mhwc-item-2-step">
                <div className="col-12 mhwc-name">
                    <input className="mhwc-input" type="text"
                        placeholder={_('inputName')} ref={refName} />

                    <div className="mhwc-icons_bundle">
                        <IconButton
                            iconName="floppy-o" altName={_('save')}
                            onClick={() => {handleBundleSave(null)}} />
                    </div>
                </div>

                <div className="col-12 mhwc-content">
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

                        return Helper.isNotEmpty(equipInfo) ? (
                            <Fragment key={index}>
                                <div className="col-2 mhwc-name">
                                    <span>{_(equipType)}</span>
                                </div>
                                <div className="col-4 mhwc-value">
                                    <span>{_(equipInfo.name)}</span>
                                </div>
                            </Fragment>
                        ) : false;
                    })}
                </div>
            </div>
        );
    };

    let renderItem = (data, index) => {
        return (
            <div key={`${data.id}:${index}`} className="mhwc-item mhwc-item-2-step">
                <div className="col-12 mhwc-name">
                    <input className="mhwc-input" type="text" defaultValue={data.name}
                        placeholder={_('inputName')} ref={refNameList.current[index]} />

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

                        return Helper.isNotEmpty(equipInfo) ? (
                            <Fragment key={index}>
                                <div className="col-2 mhwc-name">
                                    <span>{_(equipType)}</span>
                                </div>
                                <div className="col-4 mhwc-value">
                                    <span>{_(equipInfo.name)}</span>
                                </div>
                            </Fragment>
                        ) : false;
                    })}
                </div>
            </div>
        );
    };

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
    ) : false;
}
