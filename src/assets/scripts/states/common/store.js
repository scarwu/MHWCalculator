/**
 * Common State - Store
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import { createStore, applyMiddleware } from 'redux';

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Constant
import Constant from 'constant';

// Load Json
import TestData from 'files/json/testData.json';

const statusPrefix = 'state:common';

// Middleware
const diffLogger = store => next => action => {
    let prevState = store.getState();
    let result = next(action);
    let nextState = store.getState();
    let diffState = {};

    for (let key in prevState) {
        if (JSON.stringify(prevState[key]) === JSON.stringify(nextState[key])) {
            continue;
        }

        diffState[key] = nextState[key];

        Status.set(statusPrefix + ':' + key, nextState[key]);
    }

    Helper.log('State: Common -> action', action);
    Helper.log('State: Common -> diffState', diffState);

    return result;
};

// Initial State
const initialState = {
    tempData: Status.get(statusPrefix + ':tempData') || {
        conditionOptions: {
            index: 1,
            list: []
        }
    },
    requiredSets: Status.get(statusPrefix + ':requiredSets') || Helper.deepCopy(TestData.requireList[0]).sets,
    requiredSkills: Status.get(statusPrefix + ':requiredSkills') || Helper.deepCopy(TestData.requireList[0]).skills,
    requiredEquipPins: Status.get(statusPrefix + ':requiredEquipPins') || Helper.deepCopy(Constant.default.equipsLock),
    currentEquips: Status.get(statusPrefix + ':currentEquips') || Helper.deepCopy(TestData.equipsList[0]),
    algorithmParams: Object.assign(
        Helper.deepCopy(Constant.default.algorithmParams),
        Status.get(statusPrefix + ':algorithmParams') || {}
    ),
    computedBundles: Status.get(statusPrefix + ':computedBundles') || [],
    reservedBundles: Status.get(statusPrefix + ':reservedBundles') || []
};

export default createStore((state = initialState, action) => {
    switch (action.type) {

    // Switch Temp Data
    case 'SWITCH_TEMP_DATA':
        return (() => {
            let setInfo = SetDataset.getInfo(action.payload.setId);

            if (Helper.isEmpty(setInfo)) {
                return state;
            }

            let requiredSets = Helper.deepCopy(state.requiredSets);

            for (let index in requiredSets) {
                if (action.payload.setId !== requiredSets[index].id) {
                    continue;
                }

                return state;
            }

            requiredSets.push({
                id: action.payload.setId,
                step: 1
            });

            return Object.assign({}, state, {
                requiredSets: requiredSets
            });
        })();

    // Required Sets
    case 'ADD_REQUIRED_SET':
        return (() => {
            let setInfo = SetDataset.getInfo(action.payload.setId);

            if (Helper.isEmpty(setInfo)) {
                return state;
            }

            let requiredSets = Helper.deepCopy(state.requiredSets);

            for (let index in requiredSets) {
                if (action.payload.setId !== requiredSets[index].id) {
                    continue;
                }

                return state;
            }

            requiredSets.push({
                id: action.payload.setId,
                step: 1
            });

            return Object.assign({}, state, {
                requiredSets: requiredSets
            });
        })();
    case 'REMOVE_REQUIRED_SET':
        return (() => {
            let setInfo = SetDataset.getInfo(action.payload.setId);

            if (Helper.isEmpty(setInfo)) {
                return state;
            }

            let requiredSets = Helper.deepCopy(state.requiredSets);
            let requiredSkills = Helper.deepCopy(state.requiredSkills);

            let enableSkillIdList = [];

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

            requiredSkills.map((skill) => {
                let skillInfo = SkillDataset.getInfo(skill.id);

                if (Helper.isEmpty(skillInfo)) {
                    return skill;
                }

                if (-1 !== enableSkillIdList.indexOf(skill.id)) {
                    let currentSkillLevel = 0;
                    let totalSkillLevel = 0;

                    skillInfo.list.forEach((item) => {
                        if (false === item.isHidden) {
                            currentSkillLevel++;
                        }

                        totalSkillLevel++;
                    });

                    skill.level = (skill.level > currentSkillLevel)
                        ? currentSkillLevel : skill.level;
                }

                return skill;
            });

            for (let index in requiredSets) {
                if (action.payload.setId !== requiredSets[index].id) {
                    continue;
                }

                requiredSets = requiredSets.filter((set) => {
                    return set.id !== action.payload.setId;
                });

                return Object.assign({}, state, {
                    requiredSets: requiredSets,
                    requiredSkills: requiredSkills,
                });
            }

            return state;
        })();
    case 'INCREASE_REQUIRED_SET_STEP':
        return (() => {
            let setInfo = SetDataset.getInfo(action.payload.setId);

            if (Helper.isEmpty(setInfo)) {
                return state;
            }

            let requiredSets = Helper.deepCopy(state.requiredSets);

            for (let index in requiredSets) {
                if (action.payload.setId !== requiredSets[index].id) {
                    continue;
                }

                if (setInfo.skills.length === requiredSets[index].step) {
                    return state;
                }

                requiredSets[index].step += 1;

                return Object.assign({}, state, {
                    requiredSets: requiredSets
                });
            }

            return state;
        })();
    case 'DECREASE_REQUIRED_SET_STEP':
        return (() => {
            let setInfo = SetDataset.getInfo(action.payload.setId);

            if (Helper.isEmpty(setInfo)) {
                return state;
            }

            let requiredSets = Helper.deepCopy(state.requiredSets);

            for (let index in requiredSets) {
                if (action.payload.setId !== requiredSets[index].id) {
                    continue;
                }

                if (1 === requiredSets[index].step) {
                    return state;
                }

                requiredSets[index].step -= 1;

                return Object.assign({}, state, {
                    requiredSets: requiredSets
                });
            }

            return state;
        })();
    case 'CLEAN_REQUIRED_SETS':
        return Object.assign({}, state, {
            requiredSets: []
        });

    // Required Skills
    case 'ADD_REQUIRED_SKILL':
        return (() => {
            let skillInfo = SkillDataset.getInfo(action.payload.skillId);

            if (Helper.isEmpty(skillInfo)) {
                return state;
            }

            let requiredSkills = Helper.deepCopy(state.requiredSkills);

            for (let index in requiredSkills) {
                if (action.payload.skillId !== requiredSkills[index].id) {
                    continue;
                }

                return state;
            }

            requiredSkills.push({
                id: action.payload.skillId,
                level: 1
            });

            return Object.assign({}, state, {
                requiredSkills: requiredSkills
            });
        })();
    case 'REMOVE_REQUIRED_SKILL':
        return (() => {
            let skillInfo = SkillDataset.getInfo(action.payload.skillId);

            if (Helper.isEmpty(skillInfo)) {
                return state;
            }

            let requiredSkills = Helper.deepCopy(state.requiredSkills);

            for (let index in requiredSkills) {
                if (action.payload.skillId !== requiredSkills[index].id) {
                    continue;
                }

                requiredSkills = requiredSkills.filter((skill) => {
                    return skill.id !== action.payload.skillId;
                });

                return Object.assign({}, state, {
                    requiredSkills: requiredSkills
                });
            }

            return state;
        })();
    case 'INCREASE_REQUIRED_SKILL_LEVEL':
        return (() => {
            let skillInfo = SkillDataset.getInfo(action.payload.skillId);

            if (Helper.isEmpty(skillInfo)) {
                return state;
            }

            let requiredSets = Helper.deepCopy(state.requiredSets);
            let requiredSkills = Helper.deepCopy(state.requiredSkills);

            let enableSkillIdList = [];

            requiredSets.forEach((set) => {
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

            for (let index in requiredSkills) {
                if (action.payload.skillId !== requiredSkills[index].id) {
                    continue;
                }

                if (skillInfo.list.length === requiredSkills[index].level) {
                    return state;
                }

                requiredSkills[index].level += 1;

                if (true === skillInfo.list[requiredSkills[index].level - 1].isHidden
                    && -1 === enableSkillIdList.indexOf(requiredSkills[index].id)
                ) {
                    return state;
                }

                return Object.assign({}, state, {
                    requiredSkills: requiredSkills
                });
            }

            return state;
        })();
    case 'DECREASE_REQUIRED_SKILL_LEVEL':
        return (() => {
            let skillInfo = SkillDataset.getInfo(action.payload.skillId);

            if (Helper.isEmpty(skillInfo)) {
                return state;
            }

            let requiredSkills = Helper.deepCopy(state.requiredSkills);

            for (let index in requiredSkills) {
                if (action.payload.skillId !== requiredSkills[index].id) {
                    continue;
                }

                if (0 === requiredSkills[index].level) {
                    return state;
                }

                requiredSkills[index].level -= 1;

                return Object.assign({}, state, {
                    requiredSkills: requiredSkills
                });
            }

            return state;
        })();
    case 'CLEAN_REQUIRED_SKILLS':
        return Object.assign({}, state, {
            requiredSkills: []
        });

    // Required Equip Pins
    case 'TOGGLE_REQUIRED_EQUIP_PINS':
        return Object.assign({}, state, {
            requiredEquipPins: (() => {
                let requiredEquipPins = Helper.deepCopy(state.requiredEquipPins);

                requiredEquipPins[action.payload.equipType] = !requiredEquipPins[action.payload.equipType];

                return requiredEquipPins;
            })()
        });
    case 'CLEAN_REQUIRED_EQUIP_PARTS':
        return Object.assign({}, state, {
            requiredEquipPins: Helper.deepCopy(Constant.default.equipsLock)
        });

    // Current Equips
    case 'SET_CURRENT_EQUIP':
        return (() => {
            let requiredEquipPins = Helper.deepCopy(state.requiredEquipPins);
            let currentEquips = Helper.deepCopy(state.currentEquips);

            if (Helper.isNotEmpty(action.payload.data.enhanceIndex)) {
                if (Helper.isEmpty(currentEquips.weapon.enhanceIds)) {
                    currentEquips.weapon.enhanceIds = {};
                }

                currentEquips.weapon.enhanceIds[action.payload.data.enhanceIndex] = action.payload.data.enhanceId;
            } else if (Helper.isNotEmpty(action.payload.data.slotIndex)) {
                if (Helper.isEmpty(currentEquips.weapon.slotIds)) {
                    currentEquips[action.payload.data.equipType].slotIds = {};
                }

                currentEquips[action.payload.data.equipType].slotIds[action.payload.data.slotIndex] = action.payload.data.jewelId;
            } else if ('weapon' === action.payload.data.equipType) {
                if (Helper.isEmpty(action.payload.data.equipId)) {
                    requiredEquipPins.weapon = false;
                }

                currentEquips.weapon = {
                    id: action.payload.data.equipId,
                    enhanceIds: {},
                    slotIds: {}
                };
            } else if ('helm' === action.payload.data.equipType
                || 'chest' === action.payload.data.equipType
                || 'arm' === action.payload.data.equipType
                || 'waist' === action.payload.data.equipType
                || 'leg' === action.payload.data.equipType
            ) {
                if (Helper.isEmpty(action.payload.data.equipId)) {
                    requiredEquipPins[action.payload.data.equipType] = false;
                }

                currentEquips[action.payload.data.equipType] = {
                    id: action.payload.data.equipId,
                    slotIds: {}
                };
            } else if ('charm' === action.payload.data.equipType) {
                if (Helper.isEmpty(action.payload.data.equipId)) {
                    requiredEquipPins.charm = false;
                }

                currentEquips.charm = {
                    id: action.payload.data.equipId
                };
            }

            return Object.assign({}, state, {
                requiredEquipPins: requiredEquipPins,
                currentEquips: currentEquips
            });
        })();
    case 'REPLACE_CURRENT_EQUIPS':
        return Object.assign({}, state, {
            requiredEquipPins: Helper.deepCopy(Constant.default.equipsLock),
            currentEquips: action.payload.data
        });
    case 'CLEAN_CURRENT_EQUIPS':
        return Object.assign({}, state, {
            requiredEquipPins: Helper.deepCopy(Constant.default.equipsLock),
            currentEquips: Helper.deepCopy(Constant.default.equips)
        });

    // Algorithm Params
    case 'SET_ALGORITHM_PARAMS_LIMIT':
        return (() => {
            let algorithmParams = Helper.deepCopy(state.algorithmParams);

            algorithmParams.limit = action.payload.limit;

            return Object.assign({}, state, {
                algorithmParams: algorithmParams
            });
        })();
    case 'SET_ALGORITHM_PARAMS_SORT':
        return (() => {
            let algorithmParams = Helper.deepCopy(state.algorithmParams);

            algorithmParams.sort = action.payload.sort;

            return Object.assign({}, state, {
                algorithmParams: algorithmParams
            });
        })();
    case 'SET_ALGORITHM_PARAMS_ORDER':
        return (() => {
            let algorithmParams = Helper.deepCopy(state.algorithmParams);

            algorithmParams.order = action.payload.order;

            return Object.assign({}, state, {
                algorithmParams: algorithmParams
            });
        })();
    case 'TOGGLE_ALGORITHM_PARAMS_FLAG':
        return (() => {
            let algorithmParams = Helper.deepCopy(state.algorithmParams);

            if (Helper.isEmpty(algorithmParams.flag[action.payload.target])) {
                return state;
            }

            algorithmParams.flag[action.payload.target] = !algorithmParams.flag[action.payload.target];

            return Object.assign({}, state, {
                algorithmParams: algorithmParams
            });
        })();
    case 'SET_ALGORITHM_PARAMS_USING_FACTOR':
        return (() => {
            let algorithmParams = Helper.deepCopy(state.algorithmParams);

            if (Helper.isEmpty(algorithmParams.usingFactor[action.payload.target])) {
                return state;
            }

            algorithmParams.usingFactor[action.payload.target][action.payload.flag] = action.payload.value;

            return Object.assign({}, state, {
                algorithmParams: algorithmParams
            });
        })();

    // Computed Bundles
    case 'UPDATE_COMPUTED_BUNDLES':
        return Object.assign({}, state, {
            computedBundles: action.payload.data
        });

    // Reserved Bundles
    case 'ADD_RESERVED_BUNDLE':
        return Object.assign({}, state, {
            reservedBundles: (() => {
                let reservedBundles = Helper.deepCopy(state.reservedBundles);

                reservedBundles.push(action.payload.data);

                return reservedBundles;
            })()
        });
    case 'UPDATE_RESERVED_BUNDLE_NAME':
        return Object.assign({}, state, {
            reservedBundles: (() => {
                let reservedBundles = Helper.deepCopy(state.reservedBundles);

                if (Helper.isEmpty(reservedBundles[action.payload.index])) {
                    return reservedBundles;
                }

                reservedBundles[action.payload.index].name = action.payload.name;

                return reservedBundles;
            })()
        });
    case 'REMOVE_RESERVED_BUNDLE':
        return Object.assign({}, state, {
            reservedBundles: (() => {
                let reservedBundles = Helper.deepCopy(state.reservedBundles);

                if (Helper.isEmpty(reservedBundles[action.payload.index])) {
                    return reservedBundles;
                }

                delete reservedBundles[action.payload.index];

                reservedBundles = reservedBundles.filter((euqipBundle) => {
                    return (Helper.isNotEmpty(euqipBundle));
                });

                return reservedBundles;
            })()
        });

    // Default
    default:
        return state;
    }
}, applyMiddleware(diffLogger));
