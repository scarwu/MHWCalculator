'use strict';
/**
 * Equip Item Selector
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useRef } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import EnhanceDataset from 'libraries/dataset/enhance';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalButton from 'components/common/functionalButton';
import FunctionalSelector from 'components/common/functionalSelector';
import FunctionalInput from 'components/common/functionalInput';
import SharpnessBar from 'components/common/sharpnessBar';

// Load Constant
import Constant from 'constant';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default function EquipItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalStates.getters.isShowEquipItemSelector());
    const [stateBypassData, updateBypassData] = useState(ModalStates.getters.getEquipItemSelectorBypassData());
    const [stateInventory, updateInventory] = useState(CommonStates.getters.getInventory());
    const [stateMode, updateMode] = useState(null);
    const [stateSortedList, updateSortedList] = useState([]);
    const [stateType, updateType] = useState(null);
    const [stateRare, updateRare] = useState(8);
    const [stateSegment, updateSegment] = useState(null);
    const refModal = useRef();

    useEffect(() => {
        if (Helper.isEmpty(stateBypassData)) {
            return;
        }

        let mode = null;
        let includeList = [];
        let excludeList = [];
        let type = null;

        if (Helper.isNotEmpty(stateBypassData.enhanceIndex)) {
            mode = 'enhance';
            includeList = EnhanceDataset.getItems();
        } else if (Helper.isNotEmpty(stateBypassData.slotIndex)) {
            mode = 'jewel';

            for (let size = stateBypassData.slotSize; size >= 1; size--) {
                for (let rare = 8; rare >= 5; rare--) {
                    includeList = includeList.concat(
                        JewelDataset.rareIs(rare).sizeIsEqualThen(size).getItems()
                    );
                }
            }
        } else if ('weapon' === stateBypassData.equipType) {
            let weaponInfo = WeaponDataset.getInfo(stateBypassData.equipId);

            mode = 'weapon';
            type = (Helper.isNotEmpty(weaponInfo)) ? weaponInfo.type : Constant.weaponTypes[0];

            Constant.weaponTypes.forEach((weaponType) => {
                for (let rare = 8; rare >= 5; rare--) {
                    WeaponDataset.typeIs(weaponType).rareIs(rare).getItems().forEach((equip) => {
                        if (Helper.isNotEmpty(stateInventory['weapon'])
                            && true === stateInventory['weapon'][equip.id]
                        ) {
                            equip.isInclude = false;

                            excludeList.push(equip);
                        } else {
                            equip.isInclude = true;

                            includeList.push(equip);
                        }
                    });
                }

                WeaponDataset.typeIs(weaponType).rareIs(0).getItems().forEach((equip) => {
                    if (Helper.isNotEmpty(stateInventory['weapon'])
                        && true === stateInventory['weapon'][equip.id]
                    ) {
                        equip.isInclude = false;

                        excludeList.push(equip);
                    } else {
                        equip.isInclude = true;

                        includeList.push(equip);
                    }
                });
            });
        } else if ('helm' === stateBypassData.equipType
            || 'chest' === stateBypassData.equipType
            || 'arm' === stateBypassData.equipType
            || 'waist' === stateBypassData.equipType
            || 'leg' === stateBypassData.equipType
        ) {
            mode = 'armor';
            type = stateBypassData.equipType;

            for (let rare = 8; rare >= 5; rare--) {
                ArmorDataset.typeIs(stateBypassData.equipType).rareIs(rare).getItems().forEach((equip) => {
                    if (Helper.isNotEmpty(stateInventory[equip.type])
                        && true === stateInventory[equip.type][equip.id]
                    ) {
                        equip.isInclude = false;

                        excludeList.push(equip);
                    } else {
                        equip.isInclude = true;

                        includeList.push(equip);
                    }
                });
            }

            ArmorDataset.typeIs(stateBypassData.equipType).rareIs(0).getItems().forEach((equip) => {
                if (Helper.isNotEmpty(stateInventory[equip.type])
                    && true === stateInventory[equip.type][equip.id]
                ) {
                    equip.isInclude = false;

                    excludeList.push(equip);
                } else {
                    equip.isInclude = true;

                    includeList.push(equip);
                }
            });
        } else if ('charm' === stateBypassData.equipType) {
            mode = 'charm';

            CharmDataset.getItems().forEach((equip) => {
                if (Helper.isNotEmpty(stateInventory['charm'])
                    && true === stateInventory['charm'][equip.id]
                ) {
                    equip.isInclude = false;

                    excludeList.push(equip);
                } else {
                    equip.isInclude = true;

                    includeList.push(equip);
                }
            });
        }

        updateMode(mode);
        updateSortedList(includeList.concat(excludeList));
        updateType(type);
    }, [stateBypassData, stateInventory]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonStates.store.subscribe(() => {
            updateInventory(CommonStates.getters.getInventory());
        });

        const unsubscribeModel = ModalStates.store.subscribe(() => {
            updateBypassData(ModalStates.getters.getEquipItemSelectorBypassData());
            updateIsShow(ModalStates.getters.isShowEquipItemSelector());
        });

        return () => {
            unsubscribeCommon();
            unsubscribeModel();
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
        ModalStates.setters.hideEquipItemSelector();
    };

    let handleItemPickUp = (itemId) => {
        let bypassData = Helper.deepCopy(stateBypassData);

        if (Helper.isNotEmpty(bypassData.enhanceIndex)) {
            bypassData.enhanceId = itemId;
        } else if (Helper.isNotEmpty(bypassData.slotIndex)) {
            bypassData.slotId = itemId;
        } else {
            bypassData.equipId = itemId;
        }

        CommonStates.setters.setCurrentEquip(bypassData);

        handleWindowClose();
    };

    let handleItemToggle = (itemType, itemId) => {
        CommonStates.setters.toggleInventoryEquip({
            type: itemType,
            id: itemId
        });
    };

    let handleSegmentInput = (event) => {
        let segment = event.target.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    };

    let handleTypeChange = (event) => {
        updateType(event.target.value);
    };

    let handleRareChange = (event) => {
        updateRare(parseInt(event.target.value, 10));
    };

    /**
     * Render Functions
     */
    let renderWeaponItem = () => {
        return stateSortedList.map((data, index) => {

            if (data.type !== stateType) {
                return;
            }

            if (data.rare !== stateRare) {
                return;
            }

            // Create Text
            let text = _(data.name);
            text += _(data.series);
            text += _(data.type);

            if (Helper.isNotEmpty(data.element)
                && Helper.isNotEmpty(data.element.attack)
            ) {
                text += _(data.element.attack.type);
            }

            if (Helper.isNotEmpty(data.element)
                && Helper.isNotEmpty(data.element.status)
            ) {
                text += _(data.element.status.type);
            }

            data.skills.forEach((data) => {
                let skillInfo = SkillDataset.getInfo(data.id);

                if (Helper.isNotEmpty(skillInfo)) {
                    text += _(skillInfo.name);
                }
            });

            // Search Nameword
            if (Helper.isNotEmpty(stateSegment)
                && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
            ) {
                return false;
            }

            let originalSharpness = null;
            let enhancedSharpness = null;

            if (Helper.isNotEmpty(data.sharpness)) {
                originalSharpness = Helper.deepCopy(data.sharpness);
                enhancedSharpness = Helper.deepCopy(data.sharpness);
                enhancedSharpness.value += 50;
            }

            if (Helper.isNotEmpty(data.element.attack)
                && Helper.isEmpty(data.element.attack.maxValue)
            ) {
                data.element.attack.maxValue = '?';
            }

            if (Helper.isNotEmpty(data.element.status)
                && Helper.isEmpty(data.element.status.maxValue)
            ) {
                data.element.status.maxValue = '?';
            }

            return (
                <div key={data.id} className="mhwc-item mhwc-item-weapon">
                    <div className="col-12 mhwc-name">
                        <span>{_(data.name)} (R{data.rare})</span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalButton
                                iconName={data.isInclude ? 'star' : 'star-o'}
                                altName={data.isInclude ? _('exclude') : _('include')}
                                onClick={() => {handleItemToggle('weapon', data.id)}} />

                            {(stateBypassData.equipId !== data.id) ? (
                                <FunctionalButton
                                    iconName="check" altName={_('select')}
                                    onClick={() => {handleItemPickUp(data.id)}} />
                            ) : false}
                        </div>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-3 mhwc-name">
                            <span>{_('series')}</span>
                        </div>
                        <div className="col-9 mhwc-value">
                            <span>{_(data.series)}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('attack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{data.attack}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('criticalRate')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{data.criticalRate}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('sharpness')}</span>
                        </div>
                        <div className="col-9 mhwc-value mhwc-sharpness">
                            {Helper.isNotEmpty(data.sharpness) ? <SharpnessBar data={originalSharpness} /> :  false}
                            {Helper.isNotEmpty(data.sharpness) ? <SharpnessBar data={enhancedSharpness} /> :  false}
                        </div>

                        {Helper.isNotEmpty(data.element.attack) ? (
                            <Fragment>
                                <div className="col-3 mhwc-name">
                                    <span>{_(data.element.attack.type)}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    {data.element.attack.isHidden ? (
                                        <span>({data.element.attack.minValue}-{data.element.attack.maxValue})</span>
                                    ) : (
                                        <span>{data.element.attack.minValue}-{data.element.attack.maxValue}</span>
                                    )}
                                </div>
                            </Fragment>
                        ) : false}

                        {Helper.isNotEmpty(data.element.status) ? (
                            <Fragment>
                                <div className="col-3 mhwc-name">
                                    <span>{_(data.element.status.type)}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    {data.element.status.isHidden ? (
                                        <span>({data.element.status.minValue}-{data.element.status.maxValue})</span>
                                    ) : (
                                        <span>{data.element.status.minValue}-{data.element.status.maxValue}</span>
                                    )}
                                </div>
                            </Fragment>
                        ) : false}

                        <div className="col-3 mhwc-name">
                            <span>{_('elderseal')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            {Helper.isNotEmpty(data.elderseal) ? (
                                <span>{_(data.elderseal.affinity)}</span>
                            ) : false}
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('defense')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{data.defense}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('slot')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            {data.slots.map((data, index) => {
                                return (
                                    <span key={index}>[{data.size}]</span>
                                );
                            })}
                        </div>

                        {data.skills.map((data, index) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            return Helper.isNotEmpty(skillInfo) ? (
                                <Fragment>
                                    <div className="col-12 mhwc-name">
                                        <span>{_(skillInfo.name)} Lv.{data.level}</span>
                                    </div>
                                    <div className="col-12 mhwc-value mhwc-description">
                                        <span>{_(skillInfo.list[data.level - 1].description)}</span>
                                    </div>
                                </Fragment>
                            ) : false;
                        })}
                    </div>
                </div>
            );
        });
    };

    let renderArmorItem = () => {
        return stateSortedList.map((data, index) => {

            if (data.rare !== stateRare) {
                return;
            }

            // Create Text
            let text = _(data.name);
            text += _(data.series);

            if (Helper.isNotEmpty(data.set)) {
                let setInfo = SetDataset.getInfo(data.set.id);

                if (Helper.isNotEmpty(setInfo)) {
                    text += _(setInfo.name);
                }
            }

            data.skills.forEach((data) => {
                let skillInfo = SkillDataset.getInfo(data.id);

                if (Helper.isNotEmpty(skillInfo)) {
                    text += _(skillInfo.name);
                }
            });

            // Search Nameword
            if (Helper.isNotEmpty(stateSegment)
                && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
            ) {
                return false;
            }

            if (Helper.isEmpty(data.set)) {
                return false;
            }

            let setInfo = SetDataset.getInfo(data.set.id);

            return (
                <div key={data.id} className="mhwc-item mhwc-item-armor">
                    <div className="col-12 mhwc-name">
                        <span>{_(data.name)} (R{data.rare})</span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalButton
                                iconName={data.isInclude ? 'star' : 'star-o'}
                                altName={data.isInclude ? _('exclude') : _('include')}
                                onClick={() => {handleItemToggle(data.type, data.id)}} />

                            {(stateBypassData.equipId !== data.id) ? (
                                <FunctionalButton
                                    iconName="check" altName={_('select')}
                                    onClick={() => {handleItemPickUp(data.id)}} />
                            ) : false}
                        </div>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-3 mhwc-name">
                            <span>{_('series')}</span>
                        </div>
                        <div className="col-9 mhwc-value">
                            <span>{_(data.series)}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('defense')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{data.defense}</span>
                        </div>

                        {Constant.resistances.map((resistanceType) => {
                            return (
                                <Fragment>
                                    <div className="col-3 mhwc-name">
                                        <span>{_('resistance')}: {_(resistanceType)}</span>
                                    </div>
                                    <div className="col-3 mhwc-value">
                                        <span>{data.resistance[resistanceType]}</span>
                                    </div>
                                </Fragment>
                            );
                        })}

                        <div className="col-3 mhwc-name">
                            <span>{_('slot')}</span>
                        </div>
                        <div className="col-9 mhwc-value">
                            {data.slots.map((data, index) => {
                                return (
                                    <span key={index}>[{data.size}]</span>
                                );
                            })}
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('set')}</span>
                        </div>
                        <div className="col-9 mhwc-value">
                            {(Helper.isNotEmpty(setInfo)) ? (
                                <span>{_(setInfo.name)}</span>
                            ) : false}
                        </div>

                        {data.skills.map((data, index) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            return Helper.isNotEmpty(skillInfo) ? (
                                <Fragment>
                                    <div className="col-12 mhwc-name">
                                        <span>{_(skillInfo.name)} Lv.{data.level}</span>
                                    </div>
                                    <div className="col-12 mhwc-value mhwc-description">
                                        <span>{_(skillInfo.list[data.level - 1].description)}</span>
                                    </div>
                                </Fragment>
                            ) : false;
                        })}
                    </div>
                </div>
            );
        });
    };

    let renderCharmItem = () => {
        return stateSortedList.map((data, index) => {

            // Create Text
            let text = _(data.name);

            data.skills.forEach((data) => {
                let skillInfo = SkillDataset.getInfo(data.id);

                if (Helper.isNotEmpty(skillInfo)) {
                    text += _(skillInfo.anem);
                }
            });

            // Search Nameword
            if (Helper.isNotEmpty(stateSegment)
                && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
            ) {
                return false;
            }

            return (
                <div key={data.id} className="mhwc-item mhwc-item-chram">
                    <div className="col-12 mhwc-name">
                        <span>{_(data.name)} (R{data.rare})</span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalButton
                                iconName={data.isInclude ? 'star' : 'star-o'}
                                altName={data.isInclude ? _('exclude') : _('include')}
                                onClick={() => {handleItemToggle('charm', data.id)}} />

                            {(stateBypassData.equipId !== data.id) ? (
                                <FunctionalButton
                                    iconName="check" altName={_('select')}
                                    onClick={() => {handleItemPickUp(data.id)}} />
                            ) : false}
                        </div>
                    </div>
                    <div className="col-12 mhwc-content">
                        {data.skills.map((data, index) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            return Helper.isNotEmpty(skillInfo) ? (
                                <Fragment>
                                    <div className="col-12 mhwc-name">
                                        <span>{_(skillInfo.name)} Lv.{data.level}</span>
                                    </div>
                                    <div className="col-12 mhwc-value mhwc-description">
                                        <span>{_(skillInfo.list[data.level - 1].description)}</span>
                                    </div>
                                </Fragment>
                            ) : false;
                        })}
                    </div>
                </div>
            );
        });
    };

    let renderJewelItem = () => {
        return stateSortedList.map((data, index) => {

            // Create Text
            let text = _(data.name);

            let skillInfo = SkillDataset.getInfo(data.skill.id);

            if (Helper.isNotEmpty(skillInfo)) {
                text += _(skillInfo.name);
            }

            // Search Nameword
            if (Helper.isNotEmpty(stateSegment)
                && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
            ) {
                return false;
            }

            return (
                <div key={data.id} className="mhwc-item mhwc-item-jewel">
                    <div className="col-12 mhwc-name">
                        <span>[{data.size}] {_(data.name)} (R{data.rare})</span>

                        <div className="mhwc-icons_bundle">
                            {(stateBypassData.jewelId !== data.id) ? (
                                <FunctionalButton
                                    iconName="check" altName={_('select')}
                                    onClick={() => {handleItemPickUp(data.id)}} />
                            ) : false}
                        </div>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_(skillInfo.name)} Lv.{data.skill.level}</span>
                        </div>
                        <div className="col-12 mhwc-value mhwc-description">
                            <span>{_(skillInfo.list[0].description)}</span>
                        </div>
                    </div>
                </div>
            );
        });
    };

    let renderEnhanceItem = () => {
        return stateSortedList.map((data, index) => {

            // Create Text
            let text = _(data.name);

            data.list.forEach((data) => {
                text += _(data.description);
            });

            // Search Nameword
            if (Helper.isNotEmpty(stateSegment)
                && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
            ) {
                return false;
            }

            return (
                <div key={data.id} className="mhwc-item mhwc-item-enhance">
                    <div className="col-12 mhwc-name">
                        <span>{_(data.name)}</span>

                        <div className="mhwc-icons_bundle">
                            {(stateBypassData.enhanceId !== data.id) ? (
                                <FunctionalButton
                                    iconName="check" altName={_('select')}
                                    onClick={() => {handleItemPickUp(data.id)}} />
                            ) : false}
                        </div>
                    </div>
                    <div className="col-12 mhwc-content">
                        {data.list.map((skill, index) => {
                            return (
                                <Fragment>
                                    <div className="col-2 mhwc-name">
                                        <span>Lv.{skill.level}</span>
                                    </div>
                                    <div className="col-10 mhwc-value mhwc-description">
                                        <span>{_(skill.description)}</span>
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                </div>
            );
        });
    };

    let renderContent = () => {
        if (Helper.isEmpty(stateBypassData)) {
            return false;
        }

        switch (stateMode) {
        case 'weapon':
            return renderWeaponItem();
        case 'armor':
            return renderArmorItem();
        case 'charm':
            return renderCharmItem();
        case 'jewel':
            return renderJewelItem();
        case 'enhance':
            return renderEnhanceItem();
        default:
            return false;
        }
    };

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <span className="mhwc-title">{_('inventorySetting')}</span>

                    <div className="mhwc-icons_bundle">
                        <FunctionalInput
                            iconName="search" placeholder={_('inputKeyword')}
                            onChange={handleSegmentInput} />

                        {('weapon' === stateMode) ? (
                            <FunctionalSelector
                                iconName="globe" defaultValue={stateType}
                                options={Constant.weaponTypes.map((type) => {
                                    return { key: type, value: _(type) }
                                })} onChange={handleTypeChange} />
                        ) : false}

                        {('weapon' === stateMode || 'armor' === stateMode) ? (
                            <FunctionalSelector
                                iconName="globe" defaultValue={stateRare}
                                options={[8, 7, 6, 5].map((rare) => {
                                    return { key: rare, value: _('rare') + `: ${rare}` };
                                })} onChange={handleRareChange} />
                        ) : false}

                        <FunctionalButton
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />

                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
}
