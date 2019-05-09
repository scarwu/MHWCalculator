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
import React, { Component } from 'react';

// Load Core Libraries
import Status from 'core/status';
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

let initState = (equips) => {
    let equipBundleList = Status.get('equipBundleList');

    if (null === equips.weapon.id
        && null === equips.helm.id
        && null === equips.chest.id
        && null === equips.arm.id
        && null === equips.waist.id
        && null === equips.leg.id
        && null === equips.charm.id) {

        equips = null;
    }

    if (null === equipBundleList
        || undefined === equipBundleList) {

        equipBundleList = [];
    }

    return {
        equips: equips,
        equipBundleList: equipBundleList
    };
};

export default class EquipBundleSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickUp: (data) => {},
        onClose: () => {}
    };

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            equips: null,
            equipBundleList: []
        };
    }

    /**
     * Handle Functions
     */
    handleWindowClose = () => {
        this.props.onClose();
    };

    handleBundleSave = (index) => {
        let bundleId = (null !== index)
            ? this.refs['bundleId_' + index].value
            : this.refs.bundleId.value;

        if (0 === bundleId.length) {
            return;
        }

        let equipBundleList = this.state.equipBundleList;

        if (null !== index) {
            let equipBundle = equipBundleList[index];

            equipBundle.id = bundleId;

            // Set Equip Bundle List Data to Status
            Status.set('equipBundleList', equipBundleList);

            this.setState({
                equipBundleList: equipBundleList
            });
        } else {
            equipBundleList.push({
                id: bundleId,
                equips: this.state.equips
            });

            // Set Equip Bundle List Data to Status
            Status.set('equipBundleList', equipBundleList);

            this.setState({
                equips: null,
                equipBundleList: equipBundleList
            });
        }
    };

    handleBundleRemove = (index) => {
        let equipBundleList = this.state.equipBundleList;

        delete equipBundleList[index];

        equipBundleList = equipBundleList.filter((euqipBundle) => {
            return (null !== euqipBundle);
        });

        // Set Equip Bundle List Data to Status
        Status.set('equipBundleList', equipBundleList);

        this.setState({
            equipBundleList: equipBundleList
        });
    };

    handleBundlePickUp = (index) => {
        let equipBundleList = this.state.equipBundleList;

        this.props.onPickUp(equipBundleList[index].equips);
        this.props.onClose();
    };

    /**
     * Lifecycle Functions
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        return initState(nextProps.data);
    }

    /**
     * Render Functions
     */
    renderRow = (data, index) => {
        let weaponInfo = WeaponDataset.getInfo(data.equips.weapon.id);
        let helmInfo = ArmorDataset.getInfo(data.equips.helm.id);
        let chestInfo = ArmorDataset.getInfo(data.equips.chest.id);
        let armInfo = ArmorDataset.getInfo(data.equips.arm.id);
        let waistInfo = ArmorDataset.getInfo(data.equips.waist.id);
        let legInfo = ArmorDataset.getInfo(data.equips.leg.id);
        let charmInfo = CharmDataset.getInfo(data.equips.charm.id);

        return (
            <tr key={data.id}>
                <td><input type="text" placeholder={_('inputName')} ref={'bundleId_' + index} defaultValue={data.id} /></td>
                <td><span>{(weaponInfo !== null) ? _(weaponInfo.name) : false}</span></td>
                <td><span>{(helmInfo !== null) ? _(helmInfo.name) : false}</span></td>
                <td><span>{(chestInfo !== null) ? _(chestInfo.name) : false}</span></td>
                <td><span>{(armInfo !== null) ? _(armInfo.name) : false}</span></td>
                <td><span>{(waistInfo !== null) ? _(waistInfo.name) : false}</span></td>
                <td><span>{(legInfo !== null) ? _(legInfo.name) : false}</span></td>
                <td><span>{(charmInfo !== null) ? _(charmInfo.name) : false}</span></td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="check" altName={_('select')}
                            onClick={() => {this.handleBundlePickUp(index)}} />
                        <FunctionalIcon
                            iconName="times" altName={_('remove')}
                            onClick={() => {this.handleBundleRemove(index)}} />
                        <FunctionalIcon
                            iconName="floppy-o" altName={_('save')}
                            onClick={() => {this.handleBundleSave(index)}} />
                    </div>
                </td>
            </tr>
        );
    };

    renderTable = () => {
        let equips = this.state.equips;
        let equipBundleList = this.state.equipBundleList;

        let DefaultRow = false;

        if (null !== equips) {
            let weaponInfo = WeaponDataset.getInfo(equips.weapon.id);
            let helmInfo = ArmorDataset.getInfo(equips.helm.id);
            let chestInfo = ArmorDataset.getInfo(equips.chest.id);
            let armInfo = ArmorDataset.getInfo(equips.arm.id);
            let waistInfo = ArmorDataset.getInfo(equips.waist.id);
            let legInfo = ArmorDataset.getInfo(equips.leg.id);
            let charmInfo = CharmDataset.getInfo(equips.charm.id);

            DefaultRow = (
                <tr>
                    <td><input type="text" placeholder={_('inputName')} ref="bundleId" /></td>
                    <td><span>{(null !== weaponInfo) ? _(weaponInfo.name) : false}</span></td>
                    <td><span>{(null !== helmInfo) ? _(helmInfo.name) : false}</span></td>
                    <td><span>{(null !== chestInfo) ? _(chestInfo.name) : false}</span></td>
                    <td><span>{(null !== armInfo) ? _(armInfo.name) : false}</span></td>
                    <td><span>{(null !== waistInfo) ? _(waistInfo.name) : false}</span></td>
                    <td><span>{(null !== legInfo) ? _(legInfo.name) : false}</span></td>
                    <td><span>{(null !== charmInfo) ? _(charmInfo.name) : false}</span></td>
                    <td>
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="floppy-o" altName={_('save')}
                                onClick={() => {this.handleBundleSave(null)}} />
                        </div>
                    </td>
                </tr>
            );
        }

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
                    {DefaultRow}
                    {equipBundleList.map(this.renderRow)}
                </tbody>
            </table>
        );
    };

    render () {
        return (
            <div className="mhwc-selector">
                <div className="mhwc-dialog">
                    <div className="mhwc-panel">
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="times" altName={_('close')}
                                onClick={this.handleWindowClose} />
                        </div>
                    </div>
                    <div className="mhwc-list">
                        {this.renderTable()}
                    </div>
                </div>
            </div>
        );
    }
}
