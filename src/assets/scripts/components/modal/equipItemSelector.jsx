/**
 * Equip Item Selector
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
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import EnhanceDataset from 'libraries/dataset/enhance';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import IconButton from 'components/common/iconButton';
import IconSelector from 'components/common/iconSelector';
import IconInput from 'components/common/iconInput';
import SharpnessBar from 'components/common/sharpnessBar';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Constant
import Constant from 'constant';

/**
 * Handle Functions
 */
const handleItemPickUp = (bypassData, itemId) => {
    if (Helper.isNotEmpty(bypassData.enhanceIndex)) {
        bypassData.enhanceId = itemId;
    } else if (Helper.isNotEmpty(bypassData.slotIndex)) {
        bypassData.jewelId = itemId;
    } else {
        bypassData.equipId = itemId;
    }

    CommonState.setter.setCurrentEquip(bypassData);
    ModalState.setter.hideEquipItemSelector();
};

/**
 * Render Functions
 */
const renderWeaponItem = (weapon, bypassData) => {
    let originalSharpness = null;
    let enhancedSharpness = null;

    if (Helper.isNotEmpty(weapon.sharpness)) {
        originalSharpness = Helper.deepCopy(weapon.sharpness);
        enhancedSharpness = Helper.deepCopy(weapon.sharpness);
        enhancedSharpness.value += 50;
    }

    if (Helper.isNotEmpty(weapon.element.attack)
        && Helper.isEmpty(weapon.element.attack.maxValue)
    ) {
        weapon.element.attack.maxValue = '?';
    }

    if (Helper.isNotEmpty(weapon.element.status)
        && Helper.isEmpty(weapon.element.status.maxValue)
    ) {
        weapon.element.status.maxValue = '?';
    }

    return (
        <div key={weapon.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(weapon.name)}</span>

                <div className="mhwc-icons_bundle">
                    {(false === weapon.isSelect) ? (
                        <IconButton
                            iconName="check" altName={_('select')}
                            onClick={() => {handleItemPickUp(bypassData, weapon.id)}} />
                    ) : false}
                </div>
            </div>
            <div className="col-12 mhwc-content">
                <div className="col-3 mhwc-name">
                    <span>{_('series')}</span>
                </div>
                <div className="col-9 mhwc-value">
                    <span>{_(weapon.series)}</span>
                </div>

                <div className="col-3 mhwc-name">
                    <span>{_('attack')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{weapon.attack}</span>
                </div>

                <div className="col-3 mhwc-name">
                    <span>{_('criticalRate')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{weapon.criticalRate}</span>
                </div>

                {Helper.isNotEmpty(weapon.sharpness) ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_('sharpness')}</span>
                        </div>
                        <div className="col-9 mhwc-value mhwc-sharpness">
                            <SharpnessBar data={originalSharpness} />
                            <SharpnessBar data={enhancedSharpness} />
                        </div>
                    </Fragment>
                ) : false}

                {Helper.isNotEmpty(weapon.element.attack) ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_(weapon.element.attack.type)}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            {weapon.element.attack.isHidden ? (
                                <span>({weapon.element.attack.minValue}-{weapon.element.attack.maxValue})</span>
                            ) : (
                                <span>{weapon.element.attack.minValue}-{weapon.element.attack.maxValue}</span>
                            )}
                        </div>
                    </Fragment>
                ) : false}

                {Helper.isNotEmpty(weapon.element.status) ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_(weapon.element.status.type)}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            {weapon.element.status.isHidden ? (
                                <span>({weapon.element.status.minValue}-{weapon.element.status.maxValue})</span>
                            ) : (
                                <span>{weapon.element.status.minValue}-{weapon.element.status.maxValue}</span>
                            )}
                        </div>
                    </Fragment>
                ) : false}

                <div className="col-3 mhwc-name">
                    <span>{_('elderseal')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    {Helper.isNotEmpty(weapon.elderseal) ? (
                        <span>{_(weapon.elderseal.affinity)}</span>
                    ) : false}
                </div>

                <div className="col-3 mhwc-name">
                    <span>{_('defense')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{weapon.defense}</span>
                </div>

                <div className="col-3 mhwc-name">
                    <span>{_('slot')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    {weapon.slots.map((slot, index) => {
                        return (
                            <span key={index}>[{slot.size}]</span>
                        );
                    })}
                </div>

                {weapon.skills.map((skill, index) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

                    return Helper.isNotEmpty(skillInfo) ? (
                        <Fragment key={index}>
                            <div className="col-12 mhwc-name">
                                <span>{_(skillInfo.name)} Lv.{skill.level}</span>
                            </div>
                            <div className="col-12 mhwc-value mhwc-description">
                                <span>{_(skillInfo.list[skill.level - 1].description)}</span>
                            </div>
                        </Fragment>
                    ) : false;
                })}
            </div>
        </div>
    );
};

const renderArmorItem = (armor, bypassData) => {
    let setInfo = Helper.isNotEmpty(armor.set)
        ? SetDataset.getInfo(armor.set.id) : false;

    // Re-write BypassData
    bypassData.equipType = armor.type;

    return (
        <div key={armor.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(armor.name)}</span>

                <div className="mhwc-icons_bundle">
                    {(false === armor.isSelect) ? (
                        <IconButton
                            iconName="check" altName={_('select')}
                            onClick={() => {handleItemPickUp(bypassData, armor.id)}} />
                    ) : false}
                </div>
            </div>
            <div className="col-12 mhwc-content">
                <div className="col-3 mhwc-name">
                    <span>{_('series')}</span>
                </div>
                <div className="col-9 mhwc-value">
                    <span>{_(armor.series)}</span>
                </div>

                <div className="col-3 mhwc-name">
                    <span>{_('defense')}</span>
                </div>
                <div className="col-3 mhwc-value">
                    <span>{armor.defense}</span>
                </div>

                {Constant.resistances.map((resistanceType) => {
                    return (
                        <Fragment key={resistanceType}>
                            <div className="col-3 mhwc-name">
                                <span>{_('resistance')}: {_(resistanceType)}</span>
                            </div>
                            <div className="col-3 mhwc-value">
                                <span>{armor.resistance[resistanceType]}</span>
                            </div>
                        </Fragment>
                    );
                })}

                <div className="col-3 mhwc-name">
                    <span>{_('slot')}</span>
                </div>
                <div className="col-9 mhwc-value">
                    {armor.slots.map((slot, index) => {
                        return (
                            <span key={index}>[{slot.size}]</span>
                        );
                    })}
                </div>

                {Helper.isEmpty(setInfo) ? (
                    <Fragment>
                        <div className="col-3 mhwc-name">
                            <span>{_('set')}</span>
                        </div>
                        <div className="col-9 mhwc-value">
                            <span>{_(setInfo.name)}</span>
                        </div>
                    </Fragment>
                ) : false}

                {armor.skills.map((skill, index) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

                    return Helper.isNotEmpty(skillInfo) ? (
                        <Fragment key={index}>
                            <div className="col-12 mhwc-name">
                                <span>{_(skillInfo.name)} Lv.{skill.level}</span>
                            </div>
                            <div className="col-12 mhwc-value mhwc-description">
                                <span>{_(skillInfo.list[skill.level - 1].description)}</span>
                            </div>
                        </Fragment>
                    ) : false;
                })}
            </div>
        </div>
    );
};

const renderCharmItem = (charm, bypassData) => {
    return (
        <div key={charm.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(charm.name)}</span>

                <div className="mhwc-icons_bundle">
                    {(false === charm.isSelect) ? (
                        <IconButton
                            iconName="check" altName={_('select')}
                            onClick={() => {handleItemPickUp(bypassData, charm.id)}} />
                    ) : false}
                </div>
            </div>
            <div className="col-12 mhwc-content">
                {charm.skills.map((skill, index) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

                    return Helper.isNotEmpty(skillInfo) ? (
                        <Fragment key={index}>
                            <div className="col-12 mhwc-name">
                                <span>{_(skillInfo.name)} Lv.{skill.level}</span>
                            </div>
                            <div className="col-12 mhwc-value mhwc-description">
                                <span>{_(skillInfo.list[skill.level - 1].description)}</span>
                            </div>
                        </Fragment>
                    ) : false;
                })}
            </div>
        </div>
    );
};

const renderJewelItem = (jewel, bypassData) => {
    return (
        <div key={jewel.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>[{jewel.size}] {_(jewel.name)}</span>

                <div className="mhwc-icons_bundle">
                    {(false === jewel.isSelect) ? (
                        <IconButton
                            iconName="check" altName={_('select')}
                            onClick={() => {handleItemPickUp(bypassData, jewel.id)}} />
                    ) : false}
                </div>
            </div>
            <div className="col-12 mhwc-content">
                {jewel.skills.map((skill, index) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

                    return Helper.isNotEmpty(skillInfo) ? (
                        <Fragment key={index}>
                            <div className="col-12 mhwc-name">
                                <span>{_(skillInfo.name)} Lv.{skill.level}</span>
                            </div>
                            <div className="col-12 mhwc-value mhwc-description">
                                <span>{_(skillInfo.list[skill.level - 1].description)}</span>
                            </div>
                        </Fragment>
                    ) : false;
                })}
            </div>
        </div>
    );
};

const renderEnhanceItem = (enhance, bypassData) => {
    return (
        <div key={enhance.id} className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_(enhance.name)}</span>

                <div className="mhwc-icons_bundle">
                    {(false === enhance.isSelect) ? (
                        <IconButton
                            iconName="check" altName={_('select')}
                            onClick={() => {handleItemPickUp(bypassData, enhance.id)}} />
                    ) : false}
                </div>
            </div>
            <div className="col-12 mhwc-content">
                {enhance.list.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="col-2 mhwc-name">
                                <span>Lv.{item.level}</span>
                            </div>
                            <div className="col-10 mhwc-value mhwc-description">
                                <span>{_(item.description)}</span>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default function EquipItemSelector(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowEquipItemSelector());
    const [stateBypassData, updateBypassData] = useState(ModalState.getter.getEquipItemSelectorBypassData());
    const [stateMode, updateMode] = useState(undefined);
    const [stateSortedList, updateSortedList] = useState([]);
    const [stateType, updateType] = useState(undefined);
    const [stateRare, updateRare] = useState(undefined);
    const [stateTypeList, updateTypeList] = useState([]);
    const [stateRareList, updateRareList] = useState([]);
    const [stateSegment, updateSegment] = useState(undefined);
    const refModal = useRef();

    useEffect(() => {
        if (Helper.isEmpty(stateBypassData)) {
            return;
        }

        let mode = null;
        let sortedList = [];
        let typeList = {};
        let rareList = {};
        let type = null;
        let rare = null;

        if (Helper.isNotEmpty(stateBypassData.enhanceIndex)) {
            mode = 'enhance';
            sortedList = EnhanceDataset.getItems().map((enhanceInfo) => {
                enhanceInfo.isSelect = (stateBypassData.enhanceId === enhanceInfo.id);

                return enhanceInfo;
            });
        } else if (Helper.isNotEmpty(stateBypassData.slotIndex)) {
            mode = 'jewel';

            for (let size = stateBypassData.slotSize; size >= 1; size--) {
                for (let rare = 9; rare >= 5; rare--) {
                    sortedList = sortedList.concat(
                        JewelDataset.rareIs(rare).sizeIs(size).getItems().map((jewelInfo) => {
                            jewelInfo.isSelect = (stateBypassData.jewelId === jewelInfo.id);

                            return jewelInfo;
                        })
                    );
                }
            }
        } else if ('weapon' === stateBypassData.equipType) {
            let weaponInfo = WeaponDataset.getInfo(stateBypassData.equipId);

            typeList = Constant.weaponTypes.map((type) => {
                return { key: type, value: _(type) };
            });
            type = (Helper.isNotEmpty(weaponInfo) && Helper.isNotEmpty(weaponInfo.type))
                ? weaponInfo.type : typeList[0].key;

            mode = 'weapon';
            sortedList =  WeaponDataset.getItems().map((weaponInfo) => {
                rareList[weaponInfo.rare] = weaponInfo.rare;

                weaponInfo.isSelect = (stateBypassData.equipId === weaponInfo.id);

                return weaponInfo;
            });

            rareList = Object.values(rareList).reverse().map((rare) => {
                return { key: rare, value: _('rare') + `: ${rare}` };
            });
            rare = (Helper.isNotEmpty(weaponInfo)) ? weaponInfo.rare : rareList[0].key;
        } else if ('helm' === stateBypassData.equipType
            || 'chest' === stateBypassData.equipType
            || 'arm' === stateBypassData.equipType
            || 'waist' === stateBypassData.equipType
            || 'leg' === stateBypassData.equipType
        ) {
            let armoreInfo = ArmorDataset.getInfo(stateBypassData.equipId);

            typeList = Constant.armorTypes.map((type) => {
                return { key: type, value: _(type) };
            });
            type = (Helper.isNotEmpty(stateBypassData.equipType))
                ? stateBypassData.equipType : typeList[0].key;

            mode = 'armor';
            sortedList = ArmorDataset.getItems().map((armorInfo) => {
                rareList[armorInfo.rare] = armorInfo.rare;

                armorInfo.isSelect = (stateBypassData.equipId === armorInfo.id);

                return armorInfo;
            });

            rareList = Object.values(rareList).reverse().map((rare) => {
                return { key: rare, value: _('rare') + `: ${rare}` };
            });
            rare = (Helper.isNotEmpty(armoreInfo)) ? armoreInfo.rare : rareList[0].key;
        } else if ('charm' === stateBypassData.equipType) {
            mode = 'charm';
            sortedList = CharmDataset.getItems().map((charmInfo) => {
                charmInfo.isSelect = (stateBypassData.equipId === charmInfo.id);

                return charmInfo;
            });
        }

        updateMode(mode);
        updateSortedList(sortedList);
        updateTypeList(typeList);
        updateRareList(rareList);
        updateType(type);
        updateRare(rare);
    }, [stateBypassData]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeModel = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowEquipItemSelector());
            updateBypassData(ModalState.getter.getEquipItemSelectorBypassData());
        });

        return () => {
            unsubscribeModel();
        };
    }, []);

    /**
     * Handle Functions
     */
    const handleFastWindowClose = useCallback((event) => {
        if (refModal.current !== event.target) {
            return;
        }

        ModalState.setter.hideEquipItemSelector();
    }, []);

    const handleSegmentInput = useCallback((event) => {
        let segment = event.target.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    }, []);

    const handleTypeChange = useCallback((event) => {
        updateType(event.target.value);
    }, []);

    const handleRareChange = useCallback((event) => {
        updateRare(parseInt(event.target.value, 10));
    }, []);

    const getContent = useMemo(() => {
        if (Helper.isEmpty(stateBypassData)) {
            return false;
        }

        let bypassData = Helper.deepCopy(stateBypassData);

        switch (stateMode) {
        case 'weapon':
            return stateSortedList.filter((data) => {
                if (data.type !== stateType) {
                    return false;
                }

                if (data.rare !== stateRare) {
                    return false;
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

                return true;
            }).sort((dataA, dataB) => {
                return _(dataA.id) > _(dataB.id) ? 1 : -1;
            }).map((data) => {
                return renderWeaponItem(data, bypassData);
            });
        case 'armor':
            return stateSortedList.filter((data) => {
                if (data.type !== stateType) {
                    return false;
                }

                if (data.rare !== stateRare) {
                    return false;
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

                return true;
            }).sort((dataA, dataB) => {
                return _(dataA.id) > _(dataB.id) ? 1 : -1;
            }).map((data) => {
                return renderArmorItem(data, bypassData);
            });
        case 'charm':
            return stateSortedList.filter((data) => {

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

                return true;
            }).sort((dataA, dataB) => {
                return _(dataA.id) > _(dataB.id) ? 1 : -1;
            }).map((data) => {
                return renderCharmItem(data, bypassData);
            });
        case 'jewel':
            return stateSortedList.filter((data) => {

                // Create Text
                let text = _(data.name);

                data.skills.forEach((skill) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

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

                return true;
            }).sort((dataA, dataB) => {
                return _(dataA.id) > _(dataB.id) ? 1 : -1;
            }).map((data) => {
                return renderJewelItem(data, bypassData);
            });
        case 'enhance':
            return stateSortedList.filter((data) => {

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

                return true;
            }).filter((data) => {
                return -1 !== data.allowRares.indexOf(bypassData.equipRare)
                    && -1 === bypassData.enhanceIds.indexOf(data.id);
            }).sort((dataA, dataB) => {
                return _(dataA.id) > _(dataB.id) ? 1 : -1;
            }).map((data) => {
                return renderEnhanceItem(data, bypassData);
            });
        default:
            return false;
        }
    }, [
        stateBypassData,
        stateMode,
        stateSortedList,
        stateTypeList,
        stateRareList,
        stateType,
        stateRare,
        stateSegment
    ]);

    return (stateIsShow && Helper.isNotEmpty(stateBypassData)) ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <span className="mhwc-title">{_(stateMode + 'List')}</span>

                    <div className="mhwc-icons_bundle">
                        <IconInput
                            iconName="search" placeholder={_('inputKeyword')}
                             defaultValue={stateSegment} onChange={handleSegmentInput} />

                        {('weapon' === stateMode || 'armor' === stateMode) ? (
                            <IconSelector
                                iconName="globe" defaultValue={stateType}
                                options={stateTypeList} onChange={handleTypeChange} />
                        ) : false}

                        {('weapon' === stateMode || 'armor' === stateMode) ? (
                            <IconSelector
                                iconName="globe" defaultValue={stateRare}
                                options={stateRareList} onChange={handleRareChange} />
                        ) : false}

                        <IconButton
                            iconName="times" altName={_('close')}
                            onClick={ModalState.setter.hideEquipItemSelector} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        {getContent}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
}