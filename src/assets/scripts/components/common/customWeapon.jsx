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
                    <span>自訂武器</span>
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
                    {[0, 1, 2].map((index) => {
                        return (
                            <Fragment key={index}>
                                <div className="col-2 mhwc-name">
                                    <span>{_('slot')}: {index + 1}</span>
                                </div>
                                <div className="col-2 mhwc-value">
                                    <FunctionalSelector
                                        iconName="sort-numeric-asc"
                                        defaultValue="0"
                                        options={[
                                            { key: null, value: '無' },
                                            { key: 1, value: 1 },
                                            { key: 2, value: 2 },
                                            { key: 3, value: 3 }
                                        ]} onChange={(event) => {

                                        }} />
                                </div>
                                <div className="col-8 mhwc-value">
                                    <div className="mhwc-icons_bundle">

                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        );
    }, [stateRequiredEquipPins]);
};
