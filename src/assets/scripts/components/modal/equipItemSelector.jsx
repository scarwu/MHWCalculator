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
import React, { useState, useEffect, useRef } from 'react';

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
import FunctionalIcon from 'components/common/functionalIcon';
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
    const [stateIncludeList, updateIncludeList] = useState([]);
    const [stateIgnoreList, updateIgnoreList] = useState([]);
    const [stateType, updateType] = useState(null);
    const [stateRare, updateRare] = useState(8);
    const [stateSegment, updateSegment] = useState(null);
    const refModal = useRef();
    const refSegment = useRef();
    const refType = useRef();
    const refRare = useRef();

    useEffect(() => {
        if (Helper.isEmpty(stateBypassData)) {
            return;
        }

        let mode = null;
        let includeList = [];
        let ignoreList = [];
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
                            ignoreList.push(equip);
                        } else {
                            includeList.push(equip);
                        }
                    });
                }

                WeaponDataset.typeIs(weaponType).rareIs(0).getItems().forEach((equip) => {
                    if (Helper.isNotEmpty(stateInventory['weapon'])
                        && true === stateInventory['weapon'][equip.id]
                    ) {
                        ignoreList.push(equip);
                    } else {
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
                        ignoreList.push(equip);
                    } else {
                        includeList.push(equip);
                    }
                });
            }

            ArmorDataset.typeIs(stateBypassData.equipType).rareIs(0).getItems().forEach((equip) => {
                if (Helper.isNotEmpty(stateInventory[equip.type])
                    && true === stateInventory[equip.type][equip.id]
                ) {
                    ignoreList.push(equip);
                } else {
                    includeList.push(equip);
                }
            });
        } else if ('charm' === stateBypassData.equipType) {
            mode = 'charm';

            CharmDataset.getItems().forEach((equip) => {
                if (Helper.isNotEmpty(stateInventory['charm'])
                    && true === stateInventory['charm'][equip.id]
                ) {
                    ignoreList.push(equip);
                } else {
                    includeList.push(equip);
                }
            });
        }

        updateMode(mode);
        updateIncludeList(includeList);
        updateIgnoreList(ignoreList);
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

    let handleSegmentInput = () => {
        let segment = refSegment.current.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    };

    let handleTypeChange = () => {
        updateType(refType.current.value);
    };

    let handleRareChange = () => {
        updateRare(parseInt(refRare.current.value, 10));
    };

    /**
     * Render Functions
     */
    let renderWeaponRow = (data, index, isIgnore) => {
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
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{_(data.series)}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.attack}</span></td>
                <td className="mhwc-sharpness">
                    {Helper.isNotEmpty(data.sharpness) ? <SharpnessBar data={originalSharpness} /> :  false}
                    {Helper.isNotEmpty(data.sharpness) ? <SharpnessBar data={enhancedSharpness} /> :  false}
                </td>
                <td><span>{data.criticalRate}%</span></td>
                <td>
                    {Helper.isNotEmpty(data.element.attack) ? (
                        <div>
                            <span>{_(data.element.attack.type)}</span>
                            &nbsp;
                            {data.element.attack.isHidden ? (
                                <span key="value_1">({data.element.attack.minValue}-{data.element.attack.maxValue})</span>
                            ) : (
                                <span key="value_2">{data.element.attack.minValue}-{data.element.attack.maxValue}</span>
                            )}
                        </div>
                    ) : false}

                    {Helper.isNotEmpty(data.element.status) ? (
                        <div>
                            <span>{_(data.element.status.type)}</span>
                            &nbsp;
                            {data.element.status.isHidden ? (
                                <span key="value_1">({data.element.status.minValue}-{data.element.status.maxValue})</span>
                            ) : (
                                <span key="value_2">{data.element.status.minValue}-{data.element.status.maxValue}</span>
                            )}
                        </div>
                    ) : false}
                </td>
                <td>
                    {Helper.isNotEmpty(data.elderseal) ? (
                        <span>{_(data.elderseal.affinity)}</span>
                    ) : false}
                </td>
                <td><span>{data.defense}</span></td>
                <td>
                    {data.slots.map((data, index) => {
                        return (
                            <span key={index}>[{data.size}]</span>
                        );
                    })}
                </td>
                <td>
                    {data.skills.map((data, index) => {
                        let skillInfo = SkillDataset.getInfo(data.id);

                        return (Helper.isNotEmpty(skillInfo)) ? (
                            <div key={index}>
                                <span>{_(skillInfo.name)} Lv.{data.level}</span>
                            </div>
                        ) : false;
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? _('include') : _('exclude')}
                            onClick={() => {handleItemToggle('weapon', data.id)}} />

                        {(stateBypassData.equipId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    let renderWeaponTable = () => {
        let segment = stateSegment;

        return (
            <table className="mhwc-weapon_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('series')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('attack')}</td>
                        <td>{_('sharpness')}</td>
                        <td>{_('criticalRate')}</td>
                        <td>{_('element')}</td>
                        <td>{_('elderseal')}</td>
                        <td>{_('defense')}</td>
                        <td>{_('slot')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {stateIncludeList.map((data, index) => {

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
                        if (Helper.isNotEmpty(segment)
                            && -1 === text.toLowerCase().search(segment.toLowerCase())
                        ) {
                            return false;
                        }

                        return renderWeaponRow(data, index, false);
                    })}

                    {stateIgnoreList.map((data, index) => {
                        return renderWeaponRow(data, index, true);
                    })}
                </tbody>
            </table>
        );
    };

    let renderArmorRow = (data, index, isIgnore) => {
        let skillInfo = null;

        if (Helper.isNotEmpty(data.set)) {
            skillInfo = SetDataset.getInfo(data.set.id);
        }

        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{_(data.series)}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.defense}</span></td>
                <td>
                    <div><span>{_('fire')} {data.resistance.fire}</span></div>
                    <div><span>{_('water')} {data.resistance.water}</span></div>
                    <div><span>{_('thunder')} {data.resistance.thunder}</span></div>
                    <div><span>{_('ice')} {data.resistance.ice}</span></div>
                    <div><span>{_('dragon')} {data.resistance.dragon}</span></div>
                </td>
                <td>
                    {data.slots.map((data, index) => {
                        return (
                            <span key={index}>[{data.size}]</span>
                        );
                    })}
                </td>
                <td>
                    {(Helper.isNotEmpty(skillInfo)) ? (
                        <span>{_(skillInfo.name)}</span>
                    ) : false}
                </td>
                <td>
                    {data.skills.map((data, index) => {
                        let skillInfo = SkillDataset.getInfo(data.id);

                        return (Helper.isNotEmpty(skillInfo)) ? (
                            <div key={index}>
                                <span>{_(skillInfo.name)} Lv.{data.level}</span>
                            </div>
                        ) : false;
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? _('include') : _('exclude')}
                            onClick={() => {handleItemToggle(data.type, data.id)}} />

                        {(stateBypassData.equipId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    let renderArmorTable = () => {
        let segment = stateSegment;

        return (
            <table className="mhwc-armor_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('series')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('defense')}</td>
                        <td>{_('resistance')}</td>
                        <td>{_('slot')}</td>
                        <td>{_('set')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {stateIncludeList.map((data, index) => {

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
                        if (Helper.isNotEmpty(segment)
                            && -1 === text.toLowerCase().search(segment.toLowerCase())
                        ) {
                            return false;
                        }

                        return renderArmorRow(data, index, false);
                    })}

                    {stateIgnoreList.map((data, index) => {
                        return renderArmorRow(data, index, true);
                    })}
                </tbody>
            </table>
        );
    };

    let renderCharmRow = (data, index, isIgnore) => {
        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{data.rare}</span></td>
                <td>
                    {data.skills.map((data, index) => {
                        let skillInfo = SkillDataset.getInfo(data.id);

                        return (Helper.isNotEmpty(skillInfo)) ? (
                            <div key={index}>
                                <span>{_(skillInfo.name)} Lv.{data.level}</span>
                            </div>
                        ) : false;
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName={isIgnore ? 'star-o' : 'star'}
                            altName={isIgnore ? _('include') : _('exclude')}
                            onClick={() => {handleItemToggle('charm', data.id)}} />

                        {(stateBypassData.equipId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    let renderCharmTable = () => {
        let segment = stateSegment;

        return (
            <table className="mhwc-charm_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {stateIncludeList.map((data, index) => {

                        // Create Text
                        let text = _(data.name);

                        data.skills.forEach((data) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            if (Helper.isNotEmpty(skillInfo)) {
                                text += _(skillInfo.anem);
                            }
                        });

                        // Search Nameword
                        if (Helper.isNotEmpty(segment)
                            && -1 === text.toLowerCase().search(segment.toLowerCase())
                        ) {
                            return false;
                        }

                        return renderCharmRow(data, index, false);
                    })}

                    {stateIgnoreList.map((data, index) => {
                        return renderCharmRow(data, index, true);
                    })}
                </tbody>
            </table>
        );
    };

    let renderJewelRow = (data, index) => {
        let skillInfo = SkillDataset.getInfo(data.skill.id);

        return (
            <tr key={data.id}>
                <td><span>{_(data.name)}</span></td>
                <td><span>{data.rare}</span></td>
                <td><span>{data.size}</span></td>
                <td>
                    {(Helper.isNotEmpty(skillInfo)) ? (
                        <span>{_(skillInfo.name)} Lv.{data.skill.level}</span>
                    ) : false}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        {(stateBypassData.jewelId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    let renderJewelTable = () => {
        let segment = stateSegment;

        return (
            <table className="mhwc-jewel_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('rare')}</td>
                        <td>{_('size')}</td>
                        <td>{_('skill')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {stateIncludeList.map((data, index) => {

                        // Create Text
                        let text = _(data.name);

                        let skillInfo = SkillDataset.getInfo(data.skill.id);

                        if (Helper.isNotEmpty(skillInfo)) {
                            text += _(skillInfo.name);
                        }

                        // Search Nameword
                        if (Helper.isNotEmpty(segment)
                            && -1 === text.toLowerCase().search(segment.toLowerCase())
                        ) {
                            return false;
                        }

                        return renderJewelRow(data, index);
                    })}
                </tbody>
            </table>
        );
    };

    let renderEnhanceRow = (data, index) => {
        return (
            <tr key={data.id}>
                <td>{_(data.name)}</td>
                <td>
                    {data.list.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>Lv.{data.level}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    {data.list.map((data, index) => {
                        return (
                            <div key={index}>
                                <span>{_(data.description)}</span>
                            </div>
                        );
                    })}
                </td>
                <td>
                    <div className="mhwc-icons_bundle">
                        {(stateBypassData.enhanceId !== data.id) ? (
                            <FunctionalIcon
                                iconName="check" altName={_('select')}
                                onClick={() => {handleItemPickUp(data.id)}} />
                        ) : false}
                    </div>
                </td>
            </tr>
        );
    };

    let renderEnhanceTable = () => {
        let segment = stateSegment;

        return (
            <table className="mhwc-enhance_table">
                <thead>
                    <tr>
                        <td>{_('name')}</td>
                        <td>{_('level')}</td>
                        <td>{_('description')}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {stateIncludeList.map((data, index) => {

                        // Create Text
                        let text = _(data.name);

                        data.list.forEach((data) => {
                            text += _(data.description);
                        });

                        // Search Nameword
                        if (Helper.isNotEmpty(segment)
                            && -1 === text.toLowerCase().search(segment.toLowerCase())
                        ) {
                            return false;
                        }

                        return renderEnhanceRow(data, index);
                    })}
                </tbody>
            </table>
        );
    };

    let renderContent = () => {
        if (Helper.isEmpty(stateBypassData)) {
            return false;
        }

        switch (stateMode) {
        case 'weapon':
            return renderWeaponTable();
        case 'armor':
            return renderArmorTable();
        case 'charm':
            return renderCharmTable();
        case 'jewel':
            return renderJewelTable();
        case 'enhance':
            return renderEnhanceTable();
        default:
            return false;
        }
    };

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <input className="mhwc-text_segment" type="text"
                        placeholder={_('inputKeyword')}
                        ref={refSegment} onChange={handleSegmentInput} />

                    {('weapon' === stateMode) ? (
                        <select defaultValue={stateType} ref={refType} onChange={handleTypeChange}>
                            {Constant.weaponTypes.map((type) => {
                                return (
                                    <option key={type} value={type}>{_(type)}</option>
                                );
                            })}
                        </select>
                    ) : false}

                    {('weapon' === stateMode || 'armor' === stateMode) ? (
                        <select defaultValue={stateRare} ref={refRare} onChange={handleRareChange}>
                            {[8, 7, 6, 5].map((rare) => {
                                return (
                                    <option key={rare} value={rare}>{_('rare') + `: ${rare}`}</option>
                                );
                            })}
                        </select>
                    ) : false}

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list">
                    {renderContent()}
                </div>
            </div>
        </div>
    ) : false;
}
