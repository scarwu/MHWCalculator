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

// Load Custom Libraries
import Misc from 'libraries/misc';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

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
        let bundleName = (null !== index)
            ? this.refs['bundleName_' + index].value
            : this.refs.bundleName.value;

        if (0 === bundleName.length) {
            return;
        }

        let equipBundleList = this.state.equipBundleList;

        if (null !== index) {
            let equipBundle = equipBundleList[index];

            equipBundle.name = bundleName;

            // Set Equip Bundle List Data to Status
            Status.set('equipBundleList', equipBundleList);

            this.setState({
                equipBundleList: equipBundleList
            });
        } else {
            equipBundleList.push({
                name: bundleName,
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

        if (null === equips.weapon.name
            && null === equips.helm.name
            && null === equips.chest.name
            && null === equips.arm.name
            && null === equips.waist.name
            && null === equips.leg.name
            && null === equips.charm.name) {

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
            <tr key={data.name}>
                <td><input type="text" ref={'bundleName_' + index} defaultValue={data.name} /></td>
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
                            iconName="check" altName="選取"
                            onClick={() => {this.handleBundlePickUp(index)}} />
                        <FunctionalIcon
                            iconName="times" altName="移除"
                            onClick={() => {this.handleBundleRemove(index)}} />
                        <FunctionalIcon
                            iconName="floppy-o" altName="儲存"
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
                        <td>名稱</td>
                        <td>武器 </td>
                        <td>頭</td>
                        <td>身</td>
                        <td>手</td>
                        <td>腰</td>
                        <td>腳</td>
                        <td>護石</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {null !== equips ? (
                        <tr>
                            <td><input type="text" ref="bundleName" /></td>
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
                                        iconName="floppy-o" altName="儲存"
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
                                iconName="times" altName="關閉"
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
