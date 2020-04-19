/**
 * Condition Options
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import IconButton from 'components/common/iconButton';
import IconTab from 'components/common/iconTab';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

/**
 * Handle Functions
 */
const handleRequireConditionRefresh = () => {
    CommonState.setter.cleanRequiredEquips();
    CommonState.setter.cleanRequiredSets();
    CommonState.setter.cleanRequiredSkills();
};

const handleShowSetItemSelector = () => {
    ModalState.setter.showConditionItemSelector({
        mode: 'set'
    });
};

const handleShowSkillItemSelector = () => {
    ModalState.setter.showConditionItemSelector({
        mode: 'skill'
    });
};

const handleSwitchTempData = (index) => {
    CommonState.setter.switchTempData('conditionOptions', index);
};

/**
 * Render Functions
 */
const renderEquipItem = (equipType, requiredEquip) => {
    if (Helper.isEmpty(requiredEquip)
        || Helper.isEmpty(requiredEquip.id)
    ) {
        return false;
    }

    let equipInfo = null;

    if ('weapon' === equipType) {
        equipInfo = ArmorDataset.getInfo(requiredEquip.id);
    } else if ('helm' === equipType
        || 'chest' === equipType
        || 'arm' === equipType
        || 'waist' === equipType
        || 'leg' === equipType
    ) {
        equipInfo = ArmorDataset.getInfo(requiredEquip.id);
    } else if ('charm' === equipType) {
        equipInfo = CharmDataset.getInfo(requiredEquip.id);
    } else {
        return false;
    }

    if (Helper.isEmpty(equipInfo)) {
        return false;
    }

    return (
        <div key={equipInfo.id} className="col-12 mhwc-content">
            <div className="col-12 mhwc-value">
                <span>{_(equipInfo.name)}</span>

                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.setRequiredSet(equipInfo.id, null)}} />
                </div>
            </div>
        </div>
    );
};

const renderSetItem = (set) => {
    let setInfo = SetDataset.getInfo(set.id);

    if (Helper.isEmpty(setInfo)) {
        return false;
    }

    let setRequire = setInfo.skills[set.step - 1].require;

    return (
        <div key={setInfo.id} className="col-12 mhwc-content">
            <div className="col-12 mhwc-name">
                <span>{_(setInfo.name)} x {setRequire}</span>

                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="minus-circle" altName={_('down')}
                        onClick={() => {CommonState.setter.decreaseRequiredSetStep(set.id)}} />
                    <IconButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonState.setter.increaseRequiredSetStep(set.id)}} />
                    <IconButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.removeRequiredSet(set.id)}} />
                </div>
            </div>
            <div className="col-12 mhwc-value">
                {setInfo.skills.map((skill) => {
                    if (setRequire < skill.require) {
                        return false;
                    }

                    let skillInfo = SkillDataset.getInfo(skill.id);

                    return (Helper.isNotEmpty(skillInfo)) ? (
                        <div key={skill.id}>
                            <span>({skill.require}) {_(skillInfo.name)}</span>
                        </div>
                    ) : false;
                })}
            </div>
        </div>
    );
};

const renderSkillItem = (skill, enableSkillIdList) => {
    let skillInfo = SkillDataset.getInfo(skill.id);

    if (Helper.isEmpty(skillInfo)) {
        return false;
    }

    let currentSkillLevel = 0;
    let totalSkillLevel = 0;

    skillInfo.list.forEach((item) => {
        if (false === item.isHidden || -1 !== enableSkillIdList.indexOf(skillInfo.id)) {
            currentSkillLevel++;
        }

        totalSkillLevel++;
    });

    return (
        <div key={skillInfo.id} className="col-12 mhwc-content">
            <div className="col-12 mhwc-name">
                {(currentSkillLevel === totalSkillLevel) ? (
                    <span>{_(skillInfo.name)} Lv.{skill.level} / {currentSkillLevel}</span>
                ) : (
                    <span>{_(skillInfo.name)} Lv.{skill.level} / {currentSkillLevel} ({totalSkillLevel})</span>
                )}

                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="minus-circle" altName={_('down')}
                        onClick={() => {CommonState.setter.decreaseRequiredSkillLevel(skill.id)}} />
                    <IconButton
                        iconName="plus-circle" altName={_('up')}
                        onClick={() => {CommonState.setter.increaseRequiredSkillLevel(skill.id)}} />
                    <IconButton
                        iconName="times" altName={_('clean')}
                        onClick={() => {CommonState.setter.removeRequiredSkill(skill.id)}} />
                </div>
            </div>
            <div className="col-12 mhwc-value mhwc-description">
                <span>
                    {(0 !== skill.level)
                        ? _(skillInfo.list[skill.level - 1].description)
                        : _('skillLevelZero')}
                </span>
            </div>
        </div>
    );
};

/**
 * Sub Components
 */
const EquipList = (props) => {

    /**
     * Hooks
     */
    const [stateRequiredEquips, updateRequiredEquips] = useState(CommonState.getter.getRequiredEquips());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredEquips(CommonState.getter.getRequiredEquips());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: ConditionOptions -> EquipList');

        if (Helper.isEmpty(stateRequiredEquips)) {
            return false;
        }

        return Object.keys(stateRequiredEquips).map((equipType) => {
            renderEquipItem(equipType, stateRequiredEquips[equipType])
        });
    }, [stateRequiredEquips]);
};

const SetList = (props) => {

    /**
     * Hooks
     */
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredSets(CommonState.getter.getRequiredSets());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: ConditionOptions -> SetList');

        return stateRequiredSets.map(renderSetItem);
    }, [stateRequiredSets]);
};

const SkillList = (props) => {

    /**
     * Hooks
     */
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredSets(CommonState.getter.getRequiredSets());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.log('Component: ConditionOptions -> SkillList');

        let enableSkillIdList = [];

        stateRequiredSets.forEach((set) => {
            let setInfo = SetDataset.getInfo(set.id);

            if (Helper.isEmpty(setInfo)) {
                return;
            }

            setInfo.skills.forEach((skill) => {
                let skillInfo = SkillDataset.getInfo(skill.id);

                if (Helper.isEmpty(skillInfo)) {
                    return;
                }

                skillInfo.list.forEach((item) => {
                    if (Helper.isEmpty(item.reaction)
                        || Helper.isEmpty(item.reaction.enableSkillLevel)
                    ) {
                        return;
                    }

                    enableSkillIdList.push(item.reaction.enableSkillLevel.id);
                });
            });
        });

        return stateRequiredSkills.map((skill) => {
            return renderSkillItem(skill, enableSkillIdList);
        });
    }, [stateRequiredSkills, stateRequiredSets]);
};

export default function ConditionOptions(props) {

    /**
     * Hooks
     */
    const [stateTempData, updateTempData] = useState(CommonState.getter.getTempData());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateTempData(CommonState.getter.getTempData());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="col mhwc-conditions">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('requireCondition')}</span>

                <div className="mhwc-icons_bundle-left">
                    <IconTab
                        iconName="circle-o" altName={_('tab') + ' 1'}
                        isActive={0 === stateTempData.conditionOptions.index}
                        onClick={() => {handleSwitchTempData(0)}} />
                    <IconTab
                        iconName="circle-o" altName={_('tab') + ' 2'}
                        isActive={1 === stateTempData.conditionOptions.index}
                        onClick={() => {handleSwitchTempData(1)}} />
                    <IconTab
                        iconName="circle-o" altName={_('tab') + ' 3'}
                        isActive={2 === stateTempData.conditionOptions.index}
                        onClick={() => {handleSwitchTempData(2)}} />
                </div>

                <div className="mhwc-icons_bundle-right">
                    <IconButton
                        iconName="refresh" altName={_('reset')}
                        onClick={handleRequireConditionRefresh} />
                </div>
            </div>

            <div className="mhwc-list">
                <div className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('equip')}</span>
                    </div>
                    <EquipList />
                </div>

                <div className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('set')}</span>
                        <div className="mhwc-icons_bundle">
                            <IconButton
                                iconName="plus" altName={_('add')}
                                onClick={handleShowSetItemSelector} />
                        </div>
                    </div>
                    <SetList />
                </div>

                <div className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('skill')}</span>
                        <div className="mhwc-icons_bundle">
                            <IconButton
                                iconName="plus" altName={_('add')}
                                onClick={handleShowSkillItemSelector} />
                        </div>
                    </div>
                    <SkillList />
                </div>
            </div>
        </div>
    );
}
