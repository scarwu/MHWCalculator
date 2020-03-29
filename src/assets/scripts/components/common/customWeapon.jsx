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
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import IconButton from 'components/common/iconButton';
import BasicSelector from 'components/common/basicSelector';
import BasicInput from 'components/common/basicInput';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

const slotSizeList = [
    { key: 'none',      value: _('none') },
    { key: 1,           value: 1 },
    { key: 2,           value: 2 },
    { key: 3,           value: 3 },
    { key: 4,           value: 4 }
];

const rareList = [
    { key: 'none',      value: _('none') },
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

const attackElementList = [
    { key: 'none',      value: _('none') },
    { key: 'water',     value: _('water') },
    { key: 'thunder',   value: _('thunder') },
    { key: 'ice',       value: _('ice') },
    { key: 'dragon',    value: _('dragon') }
];

const statusElementList = [
    { key: 'none',      value: _('none') },
    { key: 'poison',    value: _('poison') },
    { key: 'paralysis', value: _('paralysis') },
    { key: 'sleep',     value: _('sleep') },
    { key: 'blast',     value: _('blast') }
];

const eldersealList = [
    { key: 'none',      value: _('none') },
    { key: 'low',       value: _('low') },
    { key: 'medium',    value: _('medium') },
    { key: 'high',      value: _('high') }
];

const sharpnessList = [
    { key: 'none',      value: _('none') },
    { key: 'red',       value: _('red') },
    { key: 'orange',    value: _('orange') },
    { key: 'yellow',    value: _('yellow') },
    { key: 'green',     value: _('green') },
    { key: 'blue',      value: _('blue') },
    { key: 'white',     value: _('white') },
    { key: 'purple',    value: _('purple') },
];

const skillList = [
    { key: 'none', value: _('none') },
    ...SkillDataset.getItems().map((skill) => {
        return { key: skill.id, value: _(skill.name) }
    })
];

const getValue = (value) => {
    if (Helper.isEmpty(value)) {
        return 'none';
    }

    return value;
};

const getSharpnessStep = (sharpness) => {
    if (Helper.isEmpty(sharpness)) {
        return 'none';
    }

    for (let step in sharpness.steps) {
        if (0 < sharpness.steps[step]) {
            return step;
        }
    }
};

const getElementType = (element) => {
    if (Helper.isEmpty(element)) {
        return 'none';
    }

    return element.type;
};

const getSlotSize = (slot) => {
    if (Helper.isEmpty(slot)) {
        return 'none';
    }

    return slot.size;
};

const getSkillId = (skill) => {
    if (Helper.isEmpty(skill)) {
        return 'none';
    }

    return skill.id;
};

export default function CustomWeapon(props) {

    /**
     * Hooks
     */
    const [stateCustomWeapon, updateCustomWeapon] = useState(CommonState.getter.getCustomWeapon());
    const [stateRequiredEquipPins, updateRequiredEquipPins] = useState(CommonState.getter.getRequiredEquipPins());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateCustomWeapon(CommonState.getter.getCustomWeapon());
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
                        <IconButton
                            iconName={isEquipLock ? 'lock' : 'unlock-alt'}
                            altName={isEquipLock ? _('unlock') : _('lock')}
                            onClick={() => {CommonState.setter.toggleRequiredEquipPins(equipType)}} />
                        <IconButton
                            iconName="exchange" altName={_('change')}
                            onClick={() => {ModalState.setter.showEquipItemSelector(emptySelectorData)}} />
                        <IconButton
                            iconName="times" altName={_('clean')}
                            onClick={() => {CommonState.setter.setCurrentEquip(emptySelectorData)}} />
                    </div>
                </div>
                <div className="col-12 mhwc-content">
                    <div className="col-3 mhwc-name">
                        <span>{_('rare')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getValue(stateCustomWeapon.rare)}
                            options={rareList} onChange={(event) => {
                                let value = (null !== event.target.value)
                                    ? parseInt(event.target.value) : null;

                                CommonState.setter.setCustomWeaponValue('rare', value);
                            }} />
                    </div>
                    <div className="col-3 mhwc-name">
                        <span>{_('sharpness')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getSharpnessStep(stateCustomWeapon.sharpness)}
                            options={sharpnessList} onChange={(event) => {
                                CommonState.setter.setCustomWeaponSharpness(event.target.value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('attack')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicInput
                            defaultValue={stateCustomWeapon.attack} onChange={(event) => {
                                let value = (null !== event.target.value)
                                    ? parseInt(event.target.value) : null;

                                CommonState.setter.setCustomWeaponValue('attack', value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('criticalRate')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicInput
                            defaultValue={stateCustomWeapon.criticalRate} onChange={() => {
                                let value = (null !== event.target.value)
                                    ? parseInt(event.target.value) : null;

                                CommonState.setter.setCustomWeaponValue('criticalRate', value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('defense')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicInput
                            defaultValue={stateCustomWeapon.defense} onChange={() => {
                                let value = (null !== event.target.value)
                                    ? parseInt(event.target.value) : null;

                                CommonState.setter.setCustomWeaponValue('defense', value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('elderseal')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getValue(stateCustomWeapon.elderseal)}
                            options={eldersealList} onChange={(event) => {
                                CommonState.setter.setCustomWeaponValue('elderseal', event.target.value);
                            }} />
                    </div>
                </div>
                <div className="col-12 mhwc-content">
                    <div className="col-3 mhwc-name">
                        <span>{_('element')}: 1</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getElementType(stateCustomWeapon.element.attack)}
                            options={attackElementList} onChange={(event) => {
                                CommonState.setter.setCustomWeaponElementType('attack', event.target.value);
                            }} />
                    </div>
                    {('none' !== getElementType(stateCustomWeapon.element.attack)) ? (
                        <div className="col-6 mhwc-value">
                            <BasicInput
                                defaultValue={stateCustomWeapon.element.attack.minValue} onChange={() => {
                                    let value = (null !== event.target.value)
                                        ? parseInt(event.target.value) : null;

                                    CommonState.setter.setCustomWeaponElementValue('attack', value);
                                }} />
                        </div>
                    ) : false}
                    <div className="col-3 mhwc-name">
                        <span>{_('element')}: 2</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getElementType(stateCustomWeapon.element.status)}
                            options={statusElementList} onChange={(event) => {
                                CommonState.setter.setCustomWeaponElementType('status', event.target.value);
                            }} />
                    </div>
                    {('none' !== getElementType(stateCustomWeapon.element.status)) ? (
                        <div className="col-6 mhwc-value">
                            <BasicInput
                                defaultValue={stateCustomWeapon.element.status.minValue} onChange={() => {
                                    let value = (null !== event.target.value)
                                        ? parseInt(event.target.value) : null;

                                    CommonState.setter.setCustomWeaponElementValue('status', value);
                                }} />
                        </div>
                    ) : false}
                </div>
                <div className="col-12 mhwc-content">
                    {[0, 1, 2].map((index) => {
                        return (
                            <Fragment key={index}>
                                <div className="col-3 mhwc-name">
                                    <span>{_('slot')}: {index + 1}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <BasicSelector
                                        defaultValue={getSkillId(stateCustomWeapon.slots[index])}
                                        options={slotSizeList} onChange={(event) => {
                                            let value = (null !== event.target.value)
                                                ? parseInt(event.target.value) : null;

                                            CommonState.setter.setCustomWeaponSlot(index, value);
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
                        <BasicSelector
                            defaultValue={getSkillId(stateCustomWeapon.skills[0])}
                            options={skillList} onChange={(event) => {
                                CommonState.setter.setCustomWeaponSkill(0, event.target.value);
                            }} />
                    </div>
                </div>
            </div>
        );
    }, [stateCustomWeapon, stateRequiredEquipPins]);
};
