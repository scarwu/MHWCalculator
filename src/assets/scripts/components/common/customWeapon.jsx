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
import JewelDataset from 'libraries/dataset/jewel';
import EnhanceDataset from 'libraries/dataset/enhance';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import IconButton from 'components/common/iconButton';
import BasicSelector from 'components/common/basicSelector';
import BasicInput from 'components/common/basicInput';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

const getTypeList = () => {
    return [
        { key: 'none',              value: _('none') },
        { key: 'greatSword',        value: _('greatSword') },
        { key: 'longSword',         value: _('longSword') },
        { key: 'swordAndShield',    value: _('swordAndShield') },
        { key: 'dualBlades',        value: _('dualBlades') },
        { key: 'hammer',            value: _('hammer') },
        { key: 'huntingHorn',       value: _('huntingHorn') },
        { key: 'lance',             value: _('lance') },
        { key: 'gunlance',          value: _('gunlance') },
        { key: 'switchAxe',         value: _('switchAxe') },
        { key: 'chargeBlade',       value: _('chargeBlade') },
        { key: 'insectGlaive',      value: _('insectGlaive') },
        { key: 'lightBowgun',       value: _('lightBowgun') },
        { key: 'heavyBowgun',       value: _('heavyBowgun') },
        { key: 'bow',               value: _('bow') }
    ];
};

const getRareList = () => {
    return [
        { key: 1,   value: 1 },
        { key: 2,   value: 2 },
        { key: 3,   value: 3 },
        { key: 4,   value: 4 },
        { key: 5,   value: 5 },
        { key: 6,   value: 6 },
        { key: 7,   value: 7 },
        { key: 8,   value: 8 },
        { key: 9,   value: 9 },
        { key: 10,  value: 10 },
        { key: 11,  value: 11 },
        { key: 12,  value: 12 }
    ];
};

const getSharpnessList = () => {
    return [
        { key: 'none',      value: _('none') },
        { key: 'red',       value: _('red') },
        { key: 'orange',    value: _('orange') },
        { key: 'yellow',    value: _('yellow') },
        { key: 'green',     value: _('green') },
        { key: 'blue',      value: _('blue') },
        { key: 'white',     value: _('white') },
        { key: 'purple',    value: _('purple') },
    ];
};

const getAttackElementList = () => {
    return [
        { key: 'none',      value: _('none') },
        { key: 'water',     value: _('water') },
        { key: 'thunder',   value: _('thunder') },
        { key: 'ice',       value: _('ice') },
        { key: 'dragon',    value: _('dragon') }
    ];
};

const getStatusElementList = () => {
    return [
        { key: 'none',      value: _('none') },
        { key: 'poison',    value: _('poison') },
        { key: 'paralysis', value: _('paralysis') },
        { key: 'sleep',     value: _('sleep') },
        { key: 'blast',     value: _('blast') }
    ];
};

const getEldersealList = () => {
    return [
        { key: 'none',      value: _('none') },
        { key: 'low',       value: _('low') },
        { key: 'medium',    value: _('medium') },
        { key: 'high',      value: _('high') }
    ];
};

const getSlotSizeList = () => {
    return [
        { key: 'none',  value: _('none') },
        { key: 1,       value: 1 },
        { key: 2,       value: 2 },
        { key: 3,       value: 3 },
        { key: 4,       value: 4 }
    ];
};

const getSkillList = () => {
    return [
        { key: 'none', value: _('none') },
        ...SkillDataset.getItems().filter((skillInfo) => {
            return skillInfo.from.weapon;
        }).map((skillInfo) => {
            return { key: skillInfo.id, value: _(skillInfo.name) }
        })
    ];
};

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

/**
 * Render Functions
 */
const renderEnhanceBlock = (equipInfo) => {
    let usedSize = 0;

    equipInfo.enhances.forEach((enhance) => {
        let enhanceInfo = EnhanceDataset.getInfo(enhance.id);

        usedSize += enhanceInfo.list[enhance.level - 1].size;
    });

    return (
        <div className="col-12 mhwc-content">
            <div className="col-3 mhwc-name">
                <span>{_('enhanceFieldSize')}</span>
            </div>
            <div className="col-9 mhwc-value">
                <span>{usedSize} / {equipInfo.enhanceSize}</span>
                <div className="mhwc-icons_bundle">
                    {(usedSize < equipInfo.enhanceSize) ? (
                        <IconButton iconName="plus" altName={_('add')} onClick={() => {
                            ModalState.setter.showEquipItemSelector({
                                equipType: equipInfo.type,
                                equipRare: equipInfo.rare,
                                enhanceIndex: equipInfo.enhances.length,
                                enhanceIds: equipInfo.enhances.map((enhance) => {
                                    return enhance.id;
                                })
                            });
                        }} />
                    ) : false}
                </div>
            </div>

            {equipInfo.enhances.map((enhance, index) => {
                let enhanceInfo = EnhanceDataset.getInfo(enhance.id);

                let isShowDecrease = (0 < enhance.level - 1);
                let isShowIncrease = enhance.level + 1 <= enhanceInfo.list.length
                    && usedSize + enhanceInfo.list[enhance.level].size <= equipInfo.enhanceSize
                    && -1 !== enhanceInfo.list[enhance.level].allowRares.indexOf(equipInfo.rare);

                return (
                    <Fragment key={`${equipInfo.type}:${index}`}>
                        <div className="col-3 mhwc-name">
                            <span>{_('enhance')}: {index + 1}</span>
                        </div>
                        <div className="col-9 mhwc-value">
                            <span>[{enhanceInfo.list[enhance.level - 1].size}] {_(enhanceInfo.name)} Lv.{enhance.level}</span>
                            <div className="mhwc-icons_bundle">
                                <IconButton iconName="minus-circle" altName={_('down')} onClick={() => {
                                    CommonState.setter.setCurrentEquip({
                                        equipType: equipInfo.type,
                                        enhanceIndex: index,
                                        enhanceId: enhance.id,
                                        enhanceLevel: (true === isShowDecrease)
                                            ? enhance.level - 1 : enhance.level
                                    });
                                }} />
                                <IconButton iconName="plus-circle" altName={_('up')} onClick={() => {
                                    CommonState.setter.setCurrentEquip({
                                        equipType: equipInfo.type,
                                        enhanceIndex: index,
                                        enhanceId: enhance.id,
                                        enhanceLevel: (true === isShowIncrease)
                                            ? enhance.level + 1 : enhance.level
                                    });
                                }} />
                                <IconButton iconName="times" altName={_('clean')} onClick={() => {
                                    CommonState.setter.setCurrentEquip({
                                        equipType: equipInfo.type,
                                        enhanceIndex: index,
                                        enhanceId: null
                                    });
                                }} />
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
};

const renderJewelOption = (equipType, slotIndex, slotSize, jewelInfo) => {
    let selectorData = {
        equipType: equipType,
        slotIndex: slotIndex,
        slotSize: slotSize,
        jewelId: (Helper.isNotEmpty(jewelInfo)) ? jewelInfo.id : null
    };

    let emptySelectorData = {
        equipType: equipType,
        slotIndex: slotIndex,
        slotSize: slotSize,
        jewelId: null
    };

    if (Helper.isEmpty(jewelInfo)) {
        return (
            <div key={`${equipType}:${slotIndex}`} className="mhwc-icons_bundle">
                <IconButton
                    iconName="plus" altName={_('add')}
                    onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
            </div>
        );
    }

    return (
        <Fragment key={`${equipType}:${slotIndex}`}>
            <span>[{jewelInfo.size}] {_(jewelInfo.name)}</span>
            <div className="mhwc-icons_bundle">
                <IconButton
                    iconName="exchange" altName={_('change')}
                    onClick={() => {ModalState.setter.showEquipItemSelector(selectorData)}} />
                <IconButton
                    iconName="times" altName={_('clean')}
                    onClick={() => {CommonState.setter.setCurrentEquip(emptySelectorData)}} />
            </div>
        </Fragment>
    );
};

export default function CustomWeapon(props) {

    /**
     * Hooks
     */
    const [stateCustomWeapon, updateCustomWeapon] = useState(CommonState.getter.getCustomWeapon());
    const [stateCurrentEquips, updateCurrentEquips] = useState(CommonState.getter.getCurrentEquips());
    const [stateRequiredEquipPins, updateRequiredEquipPins] = useState(CommonState.getter.getRequiredEquipPins());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateCustomWeapon(CommonState.getter.getCustomWeapon());
            updateCurrentEquips(CommonState.getter.getCurrentEquips());
            updateRequiredEquipPins(CommonState.getter.getRequiredEquipPins());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: Common -> SharpnessBar');

        let equipType = 'weapon';
        let equipInfo = stateCurrentEquips[equipType];
        let isEquipLock = stateRequiredEquipPins[equipType];

        let emptySelectorData = {
            equipType: equipType,
            equipId: null
        };

        let oldEnhanceCount = null

        if (6 <= stateCustomWeapon.rare && stateCustomWeapon.rare <= 8) {
            oldEnhanceCount = 9 - stateCustomWeapon.rare;
        }

        let newEnhanceCount = null

        if (10 <= stateCustomWeapon.rare && stateCustomWeapon.rare <= 12) {
            newEnhanceCount = (15 - stateCustomWeapon.rare) * 2;
        }

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
                        <span>{_('type')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getValue(stateCustomWeapon.type)}
                            options={getTypeList()} onChange={(event) => {
                                let value = ('none' !== event.target.value)
                                    ? event.target.value : null;

                                CommonState.setter.setCustomWeaponValue('type', value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('rare')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getValue(stateCustomWeapon.rare)}
                            options={getRareList()} onChange={(event) => {
                                let value = parseInt(event.target.value);

                                CommonState.setter.setCustomWeaponValue('rare', value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('sharpness')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getSharpnessStep(stateCustomWeapon.sharpness)}
                            options={getSharpnessList()} onChange={(event) => {
                                let value = ('none' !== event.target.value)
                                    ? event.target.value : null;

                                CommonState.setter.setCustomWeaponSharpness(value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('attack')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicInput
                            key={stateCustomWeapon.attack}
                            defaultValue={stateCustomWeapon.attack} onChange={(event) => {
                                let value = ('' !== event.target.value)
                                    ? parseInt(event.target.value) : 0;

                                CommonState.setter.setCustomWeaponValue('attack', value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('criticalRate')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicInput
                            key={stateCustomWeapon.criticalRate}
                            defaultValue={stateCustomWeapon.criticalRate} onChange={() => {
                                let value = ('' !== event.target.value)
                                    ? parseInt(event.target.value) : 0;

                                CommonState.setter.setCustomWeaponValue('criticalRate', value);
                            }} />
                    </div>

                    <div className="col-3 mhwc-name">
                        <span>{_('defense')}</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicInput
                            key={stateCustomWeapon.defense}
                            defaultValue={stateCustomWeapon.defense} onChange={() => {
                                let value = ('' !== event.target.value)
                                    ? parseInt(event.target.value) : 0;

                                CommonState.setter.setCustomWeaponValue('defense', value);
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
                            options={getAttackElementList()} onChange={(event) => {
                                let value = ('none' !== event.target.value)
                                    ? event.target.value : null;

                                CommonState.setter.setCustomWeaponElementType('attack', value);
                            }} />
                    </div>
                    <div className="col-6 mhwc-value">
                        {('none' !== getElementType(stateCustomWeapon.element.attack)) ? (
                            <BasicInput
                                key={stateCustomWeapon.element.attack.minValue}
                                defaultValue={stateCustomWeapon.element.attack.minValue} onChange={() => {
                                    let value = ('' !== event.target.value)
                                        ? parseInt(event.target.value) : 0;

                                    CommonState.setter.setCustomWeaponElementValue('attack', value);
                                }} />
                        ) : false}
                    </div>
                    <div className="col-3 mhwc-name">
                        <span>{_('element')}: 2</span>
                    </div>
                    <div className="col-3 mhwc-value">
                        <BasicSelector
                            defaultValue={getElementType(stateCustomWeapon.element.status)}
                            options={getStatusElementList()} onChange={(event) => {
                                let value = ('none' !== event.target.value)
                                    ? event.target.value : null;

                                CommonState.setter.setCustomWeaponElementType('status', value);
                            }} />
                    </div>
                    <div className="col-6 mhwc-value">
                        {('none' !== getElementType(stateCustomWeapon.element.status)) ? (
                            <BasicInput
                                key={stateCustomWeapon.element.status.minValue}
                                defaultValue={stateCustomWeapon.element.status.minValue} onChange={() => {
                                    let value = ('' !== event.target.value)
                                        ? parseInt(event.target.value) : 0;

                                    CommonState.setter.setCustomWeaponElementValue('status', value);
                                }} />
                        ) : false}
                    </div>

                    {('dragon' === getElementType(stateCustomWeapon.element.attack)) ? (
                        <Fragment>
                            <div className="col-3 mhwc-name">
                                <span>{_('elderseal')}</span>
                            </div>
                            <div className="col-3 mhwc-value">
                                <BasicSelector
                                    defaultValue={getValue(stateCustomWeapon.elderseal)}
                                    options={getEldersealList()} onChange={(event) => {
                                        let value = ('none' !== event.target.value)
                                            ? event.target.value : null;

                                        CommonState.setter.setCustomWeaponValue('elderseal', value);
                                    }} />
                            </div>
                        </Fragment>
                    ) : false}
                </div>
                {(null !== oldEnhanceCount) ? (
                    <div className="col-12 mhwc-content">
                        {[...Array(oldEnhanceCount).keys()].map((index) => {
                            return (
                                <Fragment key={index}>
                                    <div className="col-3 mhwc-name">
                                        <span>{_('enhance')}: {index + 1}</span>
                                    </div>
                                    <div className="col-9 mhwc-value">
                                        {renderEnhanceOption(
                                            equipType, index, equipInfo.enhances[index].level,
                                            EnhanceDataset.getInfo(equipInfo.enhances[index].id)
                                        )}
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                ) : false}
                {(null !== newEnhanceCount) ? (
                    <div className="col-12 mhwc-content">
                        {[...Array(newEnhanceCount).keys()].map((index) => {
                            return (
                                <Fragment key={index}>
                                    <div className="col-3 mhwc-name">
                                        <span>{_('enhance')}: {index + 1}</span>
                                    </div>
                                    <div className="col-9 mhwc-value">
                                        {renderEnhanceOption(
                                            equipType, index,
                                            EnhanceDataset.getInfo(equipInfo.enhances[index].id)
                                        )}
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                ) : false}
                <div className="col-12 mhwc-content">
                    {[...Array(2).keys()].map((index) => {
                        return (
                            <Fragment key={index}>
                                <div className="col-3 mhwc-name">
                                    <span>{_('slot')}: {index + 1}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <BasicSelector
                                        defaultValue={getSlotSize(stateCustomWeapon.slots[index])}
                                        options={getSlotSizeList()} onChange={(event) => {
                                            let value = ('none' !== event.target.value)
                                                ? parseInt(event.target.value) : null;

                                            CommonState.setter.setCustomWeaponSlot(index, value);
                                        }} />
                                </div>
                                <div className="col-6 mhwc-value">
                                    {('none' !== getSlotSize(stateCustomWeapon.slots[index])) ? (
                                        renderJewelOption(
                                            equipType, index,
                                            getSlotSize(stateCustomWeapon.slots[index]),
                                            JewelDataset.getInfo(equipInfo.slotIds[index])
                                        )
                                    ) : false}
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
                            options={getSkillList()} onChange={(event) => {
                                let value = ('none' !== event.target.value)
                                    ? event.target.value : null;

                                CommonState.setter.setCustomWeaponSkill(0, value);
                            }} />
                    </div>
                </div>
            </div>
        );
    }, [stateCustomWeapon, stateCurrentEquips, stateRequiredEquipPins]);
};
