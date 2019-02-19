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
import Event from 'core/event';
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import DataSet from 'libraries/dataset';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load Constant
import Constant from 'constant';

export default class EquipBundleSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickUp: (data) => {},
        onClose: () => {}
    };

    // Initial State
    state = {
        equips: null,
        equipBundleList: []
    };

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

    initState = (equips) => {
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

        this.setState({
            equips: equips,
            equipBundleList: equipBundleList
        });
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.initState(this.props.data);
    }

    componentWillReceiveProps (nextProps) {
        this.initState(nextProps.data);
    }

    /**
     * Render Functions
     */
    renderRow = (data, index) => {
        let weaponName = (null !== data.equips.weapon.id)
            ? _(DataSet.weaponHelper.getInfo(data.equips.weapon.id).name) : null;
        let helmName = (null !== data.equips.helm.id)
            ? _(DataSet.armorHelper.getInfo(data.equips.helm.id).name) : null;
        let chestName = (null !== data.equips.chest.id)
            ? _(DataSet.armorHelper.getInfo(data.equips.chest.id).name) : null;
        let armName = (null !== data.equips.arm.id)
            ? _(DataSet.armorHelper.getInfo(data.equips.arm.id).name) : null;
        let waistName = (null !== data.equips.waist.id)
            ? _(DataSet.armorHelper.getInfo(data.equips.waist.id).name) : null;
        let legName = (null !== data.equips.leg.id)
            ? _(DataSet.armorHelper.getInfo(data.equips.leg.id).name) : null;
        let charmName = (null !== data.equips.charm.id)
            ? _(DataSet.charmHelper.getInfo(data.equips.charm.id).name) : null;

        return (
            <tr key={data.id}>
                <td><input type="text" ref={'bundleId_' + index} defaultValue={data.id} /></td>
                <td><span>{weaponName}</span></td>
                <td><span>{helmName}</span></td>
                <td><span>{chestName}</span></td>
                <td><span>{armName}</span></td>
                <td><span>{waistName}</span></td>
                <td><span>{legName}</span></td>
                <td><span>{charmName}</span></td>
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

        let weaponName = (null !== equips && null !== equips.weapon.id)
            ? _(DataSet.weaponHelper.getInfo(equips.weapon.id).name) : null;
        let helmName = (null !== equips && null !== equips.helm.id)
            ? _(DataSet.armorHelper.getInfo(equips.helm.id).name) : null;
        let chestName = (null !== equips && null !== equips.chest.id)
            ? _(DataSet.armorHelper.getInfo(equips.chest.id).name) : null;
        let armName = (null !== equips && null !== equips.arm.id)
            ? _(DataSet.armorHelper.getInfo(equips.arm.id).name) : null;
        let waistName = (null !== equips && null !== equips.waist.id)
            ? _(DataSet.armorHelper.getInfo(equips.waist.id).name) : null;
        let legName = (null !== equips && null !== equips.leg.id)
            ? _(DataSet.armorHelper.getInfo(equips.leg.id).name) : null;
        let charmName = (null !== equips && null !== equips.charm.id)
            ? _(DataSet.charmHelper.getInfo(equips.charm.id).name) : null;

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
                    {null !== equips ? (
                        <tr>
                            <td><input type="text" ref="bundleId" /></td>
                            <td><span>{weaponName}</span></td>
                            <td><span>{helmName}</span></td>
                            <td><span>{chestName}</span></td>
                            <td><span>{armName}</span></td>
                            <td><span>{waistName}</span></td>
                            <td><span>{legName}</span></td>
                            <td><span>{charmName}</span></td>
                            <td>
                                <div className="mhwc-icons_bundle">
                                    <FunctionalIcon
                                        iconName="floppy-o" altName={_('save')}
                                        onClick={() => {this.handleBundleSave(null)}} />
                                </div>
                            </td>
                        </tr>
                    ) : false}

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
