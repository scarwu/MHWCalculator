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
import { createStore } from 'redux'

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Load Json
import TestData from 'files/json/testData.json';

const Store = createStore((state, action) => {
    if (undefined === state) {
        state = {
            requiredSets: Status.get('state:requiredSets') || Helper.deepCopy(TestData.requireList[0]).sets,
            requiredSkills: Status.get('state:requiredSkills') || Helper.deepCopy(TestData.requireList[0]).skills,
            requiredEquipPins: Status.get('state:requiredEquipPins') || Helper.deepCopy(Constant.defaultEquipsLock),
            currentEquips: Status.get('state:currentEquips') || Helper.deepCopy(TestData.equipsList[0]),
            inventory: Status.get('state:inventory') || {},
            algorithmParams: Status.get('state:algorithmParams') || {},
            computedBundles: Status.get('state:computedBundles') || [],
            reservedBundles: Status.get('state:reservedBundles') || []
        };
    }

    Helper.log('Common States', action);

    switch (action.type) {

    // Required Sets
    case 'ADD_REQUIRED_SET':
        Status.set('state:requiredSets', (() => {
            let requiredSets = state.requiredSets;

            requiredSets.push({
                id: action.payload.data.setId,
                step: 1
            });

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('state:requiredSets')
        });
    case 'REMOVE_REQUIRED_SET':
        Status.set('state:requiredSets', (() => {
            let requiredSets = state.requiredSets;

            requiredSets = requiredSets.filter((set) => {
                return set.id !== action.payload.data.setId;
            });

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('state:requiredSets')
        });
    case 'REMOVE_REQUIRED_SET_BY_INDEX':
        Status.set('state:requiredSets', (() => {
            let requiredSets = state.requiredSets;

            delete requiredSets[action.payload.index];

            requiredSets = requiredSets.filter((set) => {
                return Helper.isNotEmpty(set);
            });

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('state:requiredSets')
        });
    case 'INCREASE_REQUIRED_SET_STEP':
        Status.set('state:requiredSets', (() => {
            let requiredSets = state.requiredSets;
            let setInfo = SetDataset.getInfo(requiredSets[action.payload.index].id);

            if (Helper.isEmpty(setInfo)) {
                return requiredSets;
            }

            if (setInfo.skills.length === requiredSets[action.payload.index].step) {
                return requiredSets;
            }

            requiredSets[action.payload.index].step += 1;

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('state:requiredSets')
        });
    case 'DECREASE_REQUIRED_SET_STEP':
        Status.set('state:requiredSets', (() => {
            let requiredSets = state.requiredSets;

            if (1 === requiredSets[action.payload.index].step) {
                return requiredSets;
            }

            requiredSets[action.payload.index].step -= 1;

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('state:requiredSets')
        });
    case 'CLEAN_REQUIRED_SETS':
        Status.set('state:requiredSets', []);

        return Object.assign({}, state, {
            requiredSets: Status.get('state:requiredSets')
        });

    // Required Skills
    case 'ADD_REQUIRED_SKILL':
        Status.set('state:requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            requiredSkills.push({
                id: action.payload.data.skillId,
                level: 1
            });

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('state:requiredSkills')
        });
    case 'REMOVE_REQUIRED_SKILL':
        Status.set('state:requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            requiredSkills = requiredSkills.filter((skill) => {
                return skill.id !== action.payload.data.skillId;
            });

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('state:requiredSkills')
        });
    case 'REMOVE_REQUIRED_SKILL_BY_INDEX':
        Status.set('state:requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            delete requiredSkills[action.payload.index];

            requiredSkills = requiredSkills.filter((skill) => {
                return Helper.isNotEmpty(skill);
            });

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('state:requiredSkills')
        });
    case 'INCREASE_REQUIRED_SKILL_LEVEL':
        Status.set('state:requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;
            let skillInfo = SkillDataset.getInfo(requiredSkills[action.payload.index].id);

            if (Helper.isEmpty(skillInfo)) {
                return requiredSkills;
            }

            if (skillInfo.list.length === requiredSkills[action.payload.index].level) {
                return requiredSkills;
            }

            requiredSkills[action.payload.index].level += 1;

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('state:requiredSkills')
        });
    case 'DECREASE_REQUIRED_SKILL_LEVEL':
        Status.set('state:requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            if (0 === requiredSkills[action.payload.index].level) {
                return requiredSkills;
            }

            requiredSkills[action.payload.index].level -= 1;

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('state:requiredSkills')
        });
    case 'CLEAN_REQUIRED_SKILLS':
        Status.set('state:requiredSkills', []);

        return Object.assign({}, state, {
            requiredSkills: Status.get('state:requiredSkills')
        });

    // Required Equip Pins
    case 'TOGGLE_REQUIRED_EQUIP_PINS':
        Status.set('state:requiredEquipPins', (() => {
            let requiredEquipPins = state.requiredEquipPins;

            requiredEquipPins[action.payload.equipType] = !requiredEquipPins[action.payload.equipType];

            return requiredEquipPins;
        })());

        return Object.assign({}, state, {
            requiredEquipPins: Status.get('state:requiredEquipPins')
        });
    case 'CLEAN_REQUIRED_EQUIP_PARTS':
        Status.set('state:requiredEquipPins', Helper.deepCopy(Constant.defaultEquipsLock));

        return Object.assign({}, state, {
            requiredEquipPins: Status.get('state:requiredEquipPins')
        });

    // Current Equips
    case 'SET_CURRENT_EQUIP':
        Status.set('state:currentEquips', (() => {
            let currentEquips = state.currentEquips;

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
        })());

        return Object.assign({}, state, {
            currentEquips: Status.get('state:currentEquips')
        });
    case 'REPLACE_CURRENT_EQUIPS':
        Status.set('state:currentEquips', action.payload.data);

        return Object.assign({}, state, {
            currentEquips: Status.get('state:currentEquips')
        });
    case 'CLEAN_CURRENT_EQUIPS':
        Status.set('state:currentEquips', Helper.deepCopy(Constant.defaultEquips));

        return Object.assign({}, state, {
            currentEquips: Status.get('state:currentEquips')
        });

    // Inventory
    case 'TOGGLE_INVENTORY_EQUIP':
        Status.set('state:inventory', (() => {
            let inventory = state.inventory;

            if (Helper.isEmpty(inventory[data.type])) {
                inventory[data.type] = {};
            }

            if (Helper.isEmpty(inventory[data.type][data.id])) {
                inventory[data.type][data.id] = true;
            } else {
                delete inventory[data.type][data.id];
            }

            return inventory;
        })());

        return Object.assign({}, state, {
            inventory: Status.get('state:inventory')
        });

    // case 'ALGORITHM_PARAMS':
    //     return Object.assign({}, state, {
    //         algorithmParams: action.payload.data
    //     });

    // Computed Bundles
    case 'UPDATE_COMPUTED_BUNDLES':
        Status.set('state:computedBundles', action.payload.data);

        return Object.assign({}, state, {
            computedBundles: Status.get('state:computedBundles')
        });

    // Reserved Bundles
    case 'ADD_RESERVED_BUNDLE':
        Status.set('state:reservedBundles', (() => {
            let reservedBundles = state.reservedBundles;

            reservedBundles.push(action.payload.data);

            return reservedBundles;
        })());

        return Object.assign({}, state, {
            reservedBundles: Status.get('state:reservedBundles')
        });
    case 'UPDATE_RESERVED_BUNDLE_NAME':
        Status.set('state:reservedBundles', (() => {
            let reservedBundles = state.reservedBundles;

            if (Helper.isEmpty(reservedBundles[action.payload.index])) {
                return reservedBundles;
            }

            reservedBundles[action.payload.index].name = action.payload.name;

            return reservedBundles;
        })());

        return Object.assign({}, state, {
            reservedBundles: Status.get('state:reservedBundles')
        });
    case 'REMOVE_RESERVED_BUNDLE':
        Status.set('state:reservedBundles', (() => {
            let reservedBundles = state.reservedBundles;

            if (Helper.isEmpty(reservedBundles[action.payload.index])) {
                return reservedBundles;
            }

            delete reservedBundles[action.payload.index];

            reservedBundles = reservedBundles.filter((euqipBundle) => {
                return (Helper.isNotEmpty(euqipBundle));
            });

            return reservedBundles;
        })());

        return Object.assign({}, state, {
            reservedBundles: Status.get('state:reservedBundles')
        });

    // Default
    default:
        return state
    }
});

const Setters = {

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
    toggleInventoryEquip: (data) => {
        Store.dispatch({
            type: 'TOGGLE_INVENTORY_EQUIP',
            payload: {
                data: data
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

const Getters = {
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
    setters: Setters,
    getters: Getters
};
