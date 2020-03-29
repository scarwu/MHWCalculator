/**
 * Custom Weapon
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';

// Load Components
import FunctionalButton from 'components/common/functionalButton';
import FunctionalSelector from 'components/common/functionalSelector';
import FunctionalInput from 'components/common/functionalInput';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

const jewelSizeList = [
    { key: null,        value: _('none') },
    { key: 1,           value: 1 },
    { key: 2,           value: 2 },
    { key: 3,           value: 3 }
];

const rareList = [
    { key: null,        value: _('none') },
    { key: 1,           value: 1 },
    { key: 2,           value: 2 },
    { key: 3,           value: 3 },
    { key: 4,           value: 4 },
    { key: 5,           value: 5 },
    { key: 6,           value: 6 },
    { key: 7,           value: 7 },
    { key: 8,           value: 8 },
    { key: 9,           value: 9 },
    { key: 10,          value: 10 },
    { key: 11,          value: 11 },
    { key: 12,          value: 12 }
];

const elementList = [
    { key: null,        value: _('none') },
    { key: 'water',     value: _('water') },
    { key: 'thunder',   value: _('thunder') },
    { key: 'ice',       value: _('ice') },
    { key: 'dragon',    value: _('dragon') },
    { key: 'poison',    value: _('poison') },
    { key: 'paralysis', value: _('paralysis') },
    { key: 'sleep',     value: _('sleep') },
    { key: 'blast',     value: _('blast') }
];

const eldersealList = [
    { key: null,        value: _('none') },
    { key: 'low',       value: _('low') },
    { key: 'medium',    value: _('medium') },
    { key: 'high',      value: _('high') }
];

const shrapnessList = [
    { key: null,        value: _('none') },
    { key: 'red',       value: _('red') },
    { key: 'orange',    value: _('orange') },
    { key: 'yellow',    value: _('yellow') },
    { key: 'green',     value: _('green') },
    { key: 'blue',      value: _('blue') },
    { key: 'white',     value: _('white') },
    { key: 'purple',    value: _('purple') },
];

export default function CustomWeapon(props) {

    /**
     * Hooks
     */
    const [stateRequiredEquipPins, updateRequiredEquipPins] = useState(CommonState.getter.getRequiredEquipPins());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredEquipPins(CommonState.getter.getRequiredEquipPins());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: Common -> SharpnessBar');

        let emptySelectorData = {
            equipType: 'weapon',
            equipId: null
        };

        let equipType = 'weapon';
        let isEquipLock = stateRequiredEquipPins.weapon;

        return (
            <div key="customWeapon" className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_('customWeapon')}</span>
                    <div className="mhwc-icons_bundle">
                        <FunctionalButton
                            iconName={isEquipLock ? 'lock' : 'unlock-alt'}
                            altName={isEquipLock ? _('unlock') : _('lock')}
                            onClick={() => {CommonState.setter.toggleRequiredEquipPins(equipType)}} />
                        <FunctionalButton
                            iconName="exchange" altName={_('change')}
                            onClick={() => {ModalState.setter.showEquipItemSelector(emptySelectorData)}} />
                        <FunctionalButton
                            iconName="times" altName={_('clean')}
                            onClick={() => {CommonState.setter.setCurrentEquip(emptySelectorData)}} />
                    </div>
                </div>
                <div className="col-12 mhwc-content">
                    <div className="col-3 mhwc-name">
                        <span>{_('rare')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalSelector
                            iconName="sort-numeric-asc"
                            defaultValue="0"
                            options={rareList} onChange={(event) => {

                            }} />
                    </div>
                    <div className="col-3 mhwc-name">
                        <span>{_('sharpness')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalSelector
                            iconName="sort-numeric-asc"
                            defaultValue="0"
                            options={shrapnessList} onChange={(event) => {

                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('attack')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalInput
                            iconName="search" placeholder={''}
                            defaultValue={''} onChange={() => {}} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('criticalRate')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalInput
                            iconName="search" placeholder={''}
                            defaultValue={''} onChange={() => {}} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('defense')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalInput
                            iconName="search" placeholder={''}
                            defaultValue={''} onChange={() => {}} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('elderseal')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalSelector
                            iconName="sort-numeric-asc"
                            defaultValue="0"
                            options={eldersealList} onChange={(event) => {

                            }} />
                    </div>
                </div>
                <div className="col-12 mhwc-content">
                    <div className="col-3 mhwc-name">
                        <span>{_('element')}: 1</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalSelector
                            iconName="sort-numeric-asc"
                            defaultValue="0"
                            options={elementList} onChange={(event) => {

                            }} />
                    </div>
                    <div className="col-6 mhwc-value">
                        <FunctionalInput
                            iconName="search" placeholder={''}
                            defaultValue={''} onChange={() => {}} />
                    </div>
                    <div className="col-3 mhwc-name">
                        <span>{_('element')}: 2</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <FunctionalSelector
                            iconName="sort-numeric-asc"
                            defaultValue="0"
                            options={elementList} onChange={(event) => {

                            }} />
                    </div>
                    <div className="col-6 mhwc-value">
                        <FunctionalInput
                            iconName="search" placeholder={''}
                            defaultValue={''} onChange={() => {}} />
                    </div>
                </div>
                <div className="col-12 mhwc-content">
                    {[0, 1, 2].map((index) => {
                        return (
                            <Fragment key={index}>
                                <div className="col-3 mhwc-name">
                                    <span>{_('slot')}: {index + 1}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <FunctionalSelector
                                        iconName="sort-numeric-asc"
                                        defaultValue="0"
                                        options={jewelSizeList} onChange={(event) => {

                                        }} />
                                </div>
                                <div className="col-6 mhwc-value">
                                    <div className="mhwc-icons_bundle">

                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
                <div className="col-12 mhwc-content">
                    <div className="col-3 mhwc-name">
                        <span>{_('skill')}</span>
                    </div>
                    <div className="col-9 mhwc-value">
                        <FunctionalSelector
                            iconName="sort-numeric-asc"
                            defaultValue="0"
                            options={jewelSizeList} onChange={(event) => {

                            }} />
                    </div>
                </div>
            </div>
        );
    }, [stateRequiredEquipPins]);
};
