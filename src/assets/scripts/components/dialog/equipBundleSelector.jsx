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
import Lang from 'libraries/lang';

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
        return (
            <tr key={data.id}>
                <td><input type="text" ref={'bundleId_' + index} defaultValue={data.id} /></td>
                <td><span>{data.equips.weapon.name}</span></td>
                <td><span>{data.equips.helm.name}</span></td>
                <td><span>{data.equips.chest.name}</span></td>
                <td><span>{data.equips.arm.name}</span></td>
                <td><span>{data.equips.waist.name}</span></td>
                <td><span>{data.equips.leg.name}</span></td>
                <td><span>{data.equips.charm.name}</span></td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="check" altName={Lang.select}
                            onClick={() => {this.handleBundlePickUp(index)}} />
                        <FunctionalIcon
                            iconName="times" altName={Lang.remove}
                            onClick={() => {this.handleBundleRemove(index)}} />
                        <FunctionalIcon
                            iconName="floppy-o" altName={Lang.save}
                            onClick={() => {this.handleBundleSave(index)}} />
                    </div>
                </td>
            </tr>
        );
    };

    renderTable = () => {
        let equips = this.state.equips;
        let equipBundleList = this.state.equipBundleList;

        return (
            <table className="mhwc-equip_bundle_table">
                <thead>
                    <tr>
                        <td>{Lang.name}</td>
                        <td>{Lang.weapon}</td>
                        <td>{Lang.helm}</td>
                        <td>{Lang.chest}</td>
                        <td>{Lang.arm}</td>
                        <td>{Lang.waist}</td>
                        <td>{Lang.leg}</td>
                        <td>{Lang.charm}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {null !== equips ? (
                        <tr>
                            <td><input type="text" ref="bundleId" /></td>
                            <td><span>{equips.weapon.name}</span></td>
                            <td><span>{equips.helm.name}</span></td>
                            <td><span>{equips.chest.name}</span></td>
                            <td><span>{equips.arm.name}</span></td>
                            <td><span>{equips.waist.name}</span></td>
                            <td><span>{equips.leg.name}</span></td>
                            <td><span>{equips.charm.name}</span></td>
                            <td>
                                <div className="mhwc-icons_bundle">
                                    <FunctionalIcon
                                        iconName="floppy-o" altName={Lang.save}
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
                                iconName="times" altName={Lang.close}
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
