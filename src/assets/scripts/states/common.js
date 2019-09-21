'use strict';
/**
 * Common State
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import { createStore, applyMiddleware } from 'redux'

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

    Helper.log('CommonState action', action);
    Helper.log('CommonState diffState', diffState);

    return result;
};

// Initial State
const initialState = {
    requiredSets: Status.get(statusPrefix + ':requiredSets') || Helper.deepCopy(TestData.requireList[0]).sets,
    requiredSkills: Status.get(statusPrefix + ':requiredSkills') || Helper.deepCopy(TestData.requireList[0]).skills,
    requiredEquipPins: Status.get(statusPrefix + ':requiredEquipPins') || Helper.deepCopy(Constant.defaultEquipsLock),
    currentEquips: Status.get(statusPrefix + ':currentEquips') || Helper.deepCopy(TestData.equipsList[0]),
    inventory: Status.get(statusPrefix + ':inventory') || {},
    algorithmParams: Status.get(statusPrefix + ':algorithmParams') || Helper.deepCopy(Constant.default.algorithmParams),
    computedBundles: Status.get(statusPrefix + ':computedBundles') || [],
    reservedBundles: Status.get(statusPrefix + ':reservedBundles') || []
};

// Store
const Store = createStore((state = initialState, action) => {
    switch (action.type) {

    // Required Sets
    case 'ADD_REQUIRED_SET':
        return Object.assign({}, state, {
            requiredSets: (() => {
                let requiredSets = Helper.deepCopy(state.requiredSets);

                requiredSets.push({
                    id: action.payload.data.setId,
                    step: 1
                });

                return requiredSets;
            })()
        });
    case 'REMOVE_REQUIRED_SET':
        return Object.assign({}, state, {
            requiredSets: (() => {
                let requiredSets = Helper.deepCopy(state.requiredSets);

                requiredSets = requiredSets.filter((set) => {
                    return set.id !== action.payload.data.setId;
                });

                return requiredSets;
            })()
        });
    case 'REMOVE_REQUIRED_SET_BY_INDEX':
        return Object.assign({}, state, {
            requiredSets: (() => {
                let requiredSets = Helper.deepCopy(state.requiredSets);

                delete requiredSets[action.payload.index];

                requiredSets = requiredSets.filter((set) => {
                    return Helper.isNotEmpty(set);
                });

                return requiredSets;
            })()
        });
    case 'INCREASE_REQUIRED_SET_STEP':
        return (() => {
            let requiredSets = Helper.deepCopy(state.requiredSets);
            let setInfo = SetDataset.getInfo(requiredSets[action.payload.index].id);

            if (Helper.isEmpty(setInfo)
                || setInfo.skills.length === requiredSets[action.payload.index].step
            ) {
                return state;
            }

            requiredSets[action.payload.index].step += 1;

            return Object.assign({}, state, {
                requiredSets: requiredSets
            });
        })();
    case 'DECREASE_REQUIRED_SET_STEP':
        return (() => {
            let requiredSets = Helper.deepCopy(state.requiredSets);
            let setInfo = SetDataset.getInfo(requiredSets[action.payload.index].id);

            if (Helper.isEmpty(setInfo)
                || 1 === requiredSets[action.payload.index].step
            ) {
                return state;
            }

            requiredSets[action.payload.index].step -= 1;

            return Object.assign({}, state, {
                requiredSets: requiredSets
            });
        })();
    case 'CLEAN_REQUIRED_SETS':
        return Object.assign({}, state, {
            requiredSets: []
        });

    // Required Skills
    case 'ADD_REQUIRED_SKILL':
        return Object.assign({}, state, {
            requiredSkills: (() => {
                let requiredSkills = Helper.deepCopy(state.requiredSkills);

                requiredSkills.push({
                    id: action.payload.data.skillId,
                    level: 1
                });

                return requiredSkills;
            })()
        });
    case 'REMOVE_REQUIRED_SKILL':
        return Object.assign({}, state, {
            requiredSkills: (() => {
                let requiredSkills = Helper.deepCopy(state.requiredSkills);

                requiredSkills = requiredSkills.filter((skill) => {
                    return skill.id !== action.payload.data.skillId;
                });

                return requiredSkills;
            })()
        });
    case 'REMOVE_REQUIRED_SKILL_BY_INDEX':
        return Object.assign({}, state, {
            requiredSkills: (() => {
                let requiredSkills = Helper.deepCopy(state.requiredSkills);

                delete requiredSkills[action.payload.index];

                requiredSkills = requiredSkills.filter((skill) => {
                    return Helper.isNotEmpty(skill);
                });

                return requiredSkills;
            })()
        });
    case 'INCREASE_REQUIRED_SKILL_LEVEL':
        return (() => {
            let requiredSkills = Helper.deepCopy(state.requiredSkills);
            let skillInfo = SkillDataset.getInfo(requiredSkills[action.payload.index].id);

            if (Helper.isEmpty(skillInfo)
                || skillInfo.list.length === requiredSkills[action.payload.index].level
            ) {
                return state;
            }

            requiredSkills[action.payload.index].level += 1;

            return Object.assign({}, state, {
                requiredSkills: requiredSkills
            });
        })();
    case 'DECREASE_REQUIRED_SKILL_LEVEL':
        return (() => {
            let requiredSkills = Helper.deepCopy(state.requiredSkills);
            let skillInfo = SkillDataset.getInfo(requiredSkills[action.payload.index].id);

            if (Helper.isEmpty(skillInfo)
                || 0 === requiredSkills[action.payload.index].level
            ) {
                return state;
            }

            requiredSkills[action.payload.index].level -= 1;

            return Object.assign({}, state, {
                requiredSkills: requiredSkills
            });
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
            requiredEquipPins: Helper.deepCopy(Constant.defaultEquipsLock)
        });

    // Current Equips
    case 'SET_CURRENT_EQUIP':
        return Object.assign({}, state, {
            currentEquips: (() => {
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

                    currentEquips[action.payload.data.equipType].slotIds[action.payload.data.slotIndex] = action.payload.data.slotId;
                } else if ('weapon' === action.payload.data.equipType) {
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
                    currentEquips[action.payload.data.equipType] = {
                        id: action.payload.data.equipId,
                        slotIds: {}
                    };
                } else if ('charm' === action.payload.data.equipType) {
                    currentEquips.charm = {
                        id: action.payload.data.equipId
                    };
                }

                return currentEquips;
            })()
        });
    case 'REPLACE_CURRENT_EQUIPS':
        return Object.assign({}, state, {
            currentEquips: action.payload.data
        });
    case 'CLEAN_CURRENT_EQUIPS':
        return Object.assign({}, state, {
            currentEquips: Helper.deepCopy(Constant.defaultEquips)
        });

    // Inventory
    case 'TOGGLE_INVENTORY_EQUIP':
        return Object.assign({}, state, {
            inventory: (() => {
                let inventory = Helper.deepCopy(state.inventory);

                if (Helper.isEmpty(inventory[action.payload.equip.type])) {
                    inventory[action.payload.equip.type] = {};
                }

                if (Helper.isEmpty(inventory[action.payload.equip.type][action.payload.equip.id])) {
                    inventory[action.payload.equip.type][action.payload.equip.id] = true;
                } else {
                    delete inventory[action.payload.equip.type][action.payload.equip.id];
                }

                return inventory;
            })()
        });

    // case 'ALGORITHM_PARAMS':
    //     return Object.assign({}, state, {
    //         algorithmParams: action.payload.data
    //     });

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

const Setter = {

    // Required Sets
    addRequiredSet: (data) => {
        Store.dispatch({
            type: 'ADD_REQUIRED_SET',
            payload: {
                data: data
            }
        });
    },
    removeRequiredSet: (data) => {
        Store.dispatch({
            type: 'REMOVE_REQUIRED_SET',
            payload: {
                data: data
            }
        });
    },
    removeRequiredSetByIndex: (index) => {
        Store.dispatch({
            type: 'REMOVE_REQUIRED_SET_BY_INDEX',
            payload: {
                index: index
            }
        });
    },
    increaseRequiredSetStep: (index) => {
        Store.dispatch({
            type: 'INCREASE_REQUIRED_SET_STEP',
            payload: {
                index: index
            }
        });
    },
    decreaseRequiredSetStep: (index) => {
        Store.dispatch({
            type: 'DECREASE_REQUIRED_SET_STEP',
            payload: {
                index: index
            }
        });
    },
    cleanRequiredSets: () => {
        Store.dispatch({
            type: 'CLEAN_REQUIRED_SETS'
        });
    },

    // Required Skills
    addRequiredSkill: (data) => {
        Store.dispatch({
            type: 'ADD_REQUIRED_SKILL',
            payload: {
                data: data
            }
        });
    },
    removeRequiredSkill: (data) => {
        Store.dispatch({
            type: 'REMOVE_REQUIRED_SKILL',
            payload: {
                data: data
            }
        });
    },
    removeRequiredSkillByIndex: (index) => {
        Store.dispatch({
            type: 'REMOVE_REQUIRED_SKILL_BY_INDEX',
            payload: {
                index: index
            }
        });
    },
    increaseRequiredSkillLevel: (index) => {
        Store.dispatch({
            type: 'INCREASE_REQUIRED_SKILL_LEVEL',
            payload: {
                index: index
            }
        });
    },
    decreaseRequiredSkillLevel: (index) => {
        Store.dispatch({
            type: 'DECREASE_REQUIRED_SKILL_LEVEL',
            payload: {
                index: index
            }
        });
    },
    cleanRequiredSkills: () => {
        Store.dispatch({
            type: 'CLEAN_REQUIRED_SKILLS'
        });
    },


    // Required Equip Pins
    toggleRequiredEquipPins: (equipType) => {
        Store.dispatch({
            type: 'TOGGLE_REQUIRED_EQUIP_PINS',
            payload: {
                equipType: equipType
            }
        });
    },
    cleanRequiredEquipPins: () => {
        Store.dispatch({
            type: 'CLEAN_REQUIRED_EQUIP_PINS'
        });
    },

    // CurrentEquips
    setCurrentEquip: (data) => {
        Store.dispatch({
            type: 'SET_CURRENT_EQUIP',
            payload: {
                data: data
            }
        });
    },
    replaceCurrentEquips: (data) => {
        Store.dispatch({
            type: 'REPLACE_CURRENT_EQUIPS',
            payload: {
                data: data
            }
        });
    },
    cleanCurrentEquips: () => {
        Store.dispatch({
            type: 'CLEAN_CURRENT_EQUIPS'
        });
    },

    // Inventory
    toggleInventoryEquip: (equip) => {
        Store.dispatch({
            type: 'TOGGLE_INVENTORY_EQUIP',
            payload: {
                equip: equip
            }
        });
    },

    // Computed Bundles
    saveComputedBundles: (data) => {
        Store.dispatch({
            type: 'UPDATE_COMPUTED_BUNDLES',
            payload: {
                data: data
            }
        });
    },
    cleanComputedBundles: () => {
        Store.dispatch({
            type: 'UPDATE_COMPUTED_BUNDLES',
            payload: {
                data: []
            }
        });
    },

    // Reserved Bundles
    addReservedBundle: (data) => {
        Store.dispatch({
            type: 'ADD_RESERVED_BUNDLE',
            payload: {
                data: data
            }
        });
    },
    updateReservedBundleName: (index, name) => {
        Store.dispatch({
            type: 'UPDATE_RESERVED_BUNDLE_NAME',
            payload: {
                index: index,
                name: name
            }
        });
    },
    removeReservedBundle: (index) => {
        Store.dispatch({
            type: 'REMOVE_RESERVED_BUNDLE',
            payload: {
                index: index
            }
        });
    }
};

const Getter = {
    getRequiredSets: () => {
        return Store.getState().requiredSets;
    },
    getRequiredSkills: () => {
        return Store.getState().requiredSkills;
    },
    getRequiredEquipPins: () => {
        return Store.getState().requiredEquipPins;
    },
    getCurrentEquips: () => {
        return Store.getState().currentEquips;
    },
    getInventory: () => {
        return Store.getState().inventory;
    },
    getAlgorithmParams: () => {
        return Store.getState().algorithmParams;
    },
    getComputedBundles: () => {
        return Store.getState().computedBundles;
    },
    getReservedBundles: () => {
        return Store.getState().reservedBundles;
    }
};

export default {
    store: Store,
    setter: Setter,
    getter: Getter
};
