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
    let renderRow = (data, index) => {
        let weaponInfo = WeaponDataset.getInfo(data.equips.weapon.id);
        let helmInfo = ArmorDataset.getInfo(data.equips.helm.id);
        let chestInfo = ArmorDataset.getInfo(data.equips.chest.id);
        let armInfo = ArmorDataset.getInfo(data.equips.arm.id);
        let waistInfo = ArmorDataset.getInfo(data.equips.waist.id);
        let legInfo = ArmorDataset.getInfo(data.equips.leg.id);
        let charmInfo = CharmDataset.getInfo(data.equips.charm.id);

        return (
            <tr key={data.id}>
                <td><input type="text" placeholder={_('inputName')} ref={refNameList.current[index]} defaultValue={data.name} /></td>
                <td><span>{(Helper.isNotEmpty(weaponInfo)) ? _(weaponInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(helmInfo)) ? _(helmInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(chestInfo)) ? _(chestInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(armInfo)) ? _(armInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(waistInfo)) ? _(waistInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(legInfo)) ? _(legInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(charmInfo)) ? _(charmInfo.name) : false}</span></td>
                <td>
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
                </td>
            </tr>
        );
    };

    let renderDefaultRow = () => {
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

        let weaponInfo = WeaponDataset.getInfo(stateCurrentEquips.weapon.id);
        let helmInfo = ArmorDataset.getInfo(stateCurrentEquips.helm.id);
        let chestInfo = ArmorDataset.getInfo(stateCurrentEquips.chest.id);
        let armInfo = ArmorDataset.getInfo(stateCurrentEquips.arm.id);
        let waistInfo = ArmorDataset.getInfo(stateCurrentEquips.waist.id);
        let legInfo = ArmorDataset.getInfo(stateCurrentEquips.leg.id);
        let charmInfo = CharmDataset.getInfo(stateCurrentEquips.charm.id);

        return (
            <tr>
                <td><input type="text" placeholder={_('inputName')} ref={refName} /></td>
                <td><span>{(Helper.isNotEmpty(weaponInfo)) ? _(weaponInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(helmInfo)) ? _(helmInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(chestInfo)) ? _(chestInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(armInfo)) ? _(armInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(waistInfo)) ? _(waistInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(legInfo)) ? _(legInfo.name) : false}</span></td>
                <td><span>{(Helper.isNotEmpty(charmInfo)) ? _(charmInfo.name) : false}</span></td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="floppy-o" altName={_('save')}
                            onClick={() => {handleBundleSave(null)}} />
                    </div>
                </td>
            </tr>
        );
    };

    let renderTable = () => {
        return (
            <table className="mhwc-equip_bundle_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('weapon')}</td>
                        <td>{_('helm')}</td>
                        <td>{_('chest')}</td>
                        <td>{_('arm')}</td>
                        <td>{_('waist')}</td>
                        <td>{_('leg')}</td>
                        <td>{_('charm')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {renderDefaultRow()}
                    {stateReservedBundles.map(renderRow)}
                </tbody>
            </table>
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
                    {renderTable()}
                </div>
            </div>
        </div>
    ) : false;
}
