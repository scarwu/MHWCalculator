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
            requiredSets: Status.get('requiredSets') || Helper.deepCopy(TestData.requireList[0]).sets,
            requiredSkills: Status.get('requiredSkills') || Helper.deepCopy(TestData.requireList[0]).skills,
            requiredEquipParts: Status.get('requiredEquipParts') || Helper.deepCopy(Constant.defaultEquipsLock),
            currentEquips: Status.get('currentEquips') || Helper.deepCopy(TestData.equipsList[0]),
            inventory: Status.get('inventory') || {},
            algorithmParams: Status.get('algorithmParams') || {},
            computedBundles: Status.get('computedBundles') || [],
            reservedBundles: Status.get('reservedEquipBundles') || []
        };
    }

    Helper.log('Common States', action);

    switch (action.type) {

    // Required Sets
    case 'ADD_REQUIRED_SET':
        Status.set('requiredSets', (() => {
            let requiredSets = state.requiredSets;

            requiredSets.push({
                id: action.payload.data.setId,
                step: 1
            });

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('requiredSets')
        });
    case 'REMOVE_REQUIRED_SET':
        Status.set('requiredSets', (() => {
            let requiredSets = state.requiredSets;

            requiredSets = requiredSets.filter((set) => {
                return set.id !== action.payload.data.setId;
            });

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('requiredSets')
        });
    case 'REMOVE_REQUIRED_SET_BY_INDEX':
        Status.set('requiredSets', (() => {
            let requiredSets = state.requiredSets;

            delete requiredSets[action.payload.index];

            requiredSets = requiredSets.filter((set) => {
                return Helper.isNotEmpty(set);
            });

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('requiredSets')
        });
    case 'INCREASE_REQUIRED_SET_STEP':
        Status.set('requiredSets', (() => {
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
            requiredSets: Status.get('requiredSets')
        });
    case 'DECREASE_REQUIRED_SET_STEP':
        Status.set('requiredSets', (() => {
            let requiredSets = state.requiredSets;

            if (1 === requiredSets[action.payload.index].step) {
                return requiredSets;
            }

            requiredSets[action.payload.index].step -= 1;

            return requiredSets;
        })());

        return Object.assign({}, state, {
            requiredSets: Status.get('requiredSets')
        });
    case 'CLEAN_REQUIRED_SETS':
        Status.set('requiredSets', []);

        return Object.assign({}, state, {
            requiredSets: Status.get('requiredSets')
        });

    // Required Skills
    case 'ADD_REQUIRED_SKILL':
        Status.set('requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            requiredSkills.push({
                id: action.payload.data.skillId,
                level: 1
            });

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('requiredSkills')
        });
    case 'REMOVE_REQUIRED_SKILL':
        Status.set('requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            requiredSkills = requiredSkills.filter((skill) => {
                return skill.id !== action.payload.data.skillId;
            });

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('requiredSkills')
        });
    case 'REMOVE_REQUIRED_SKILL_BY_INDEX':
        Status.set('requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            delete requiredSkills[action.payload.index];

            requiredSkills = requiredSkills.filter((skill) => {
                return Helper.isNotEmpty(skill);
            });

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('requiredSkills')
        });
    case 'INCREASE_REQUIRED_SKILL_LEVEL':
        Status.set('requiredSkills', (() => {
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
            requiredSkills: Status.get('requiredSkills')
        });
    case 'DECREASE_REQUIRED_SKILL_LEVEL':
        Status.set('requiredSkills', (() => {
            let requiredSkills = state.requiredSkills;

            if (0 === requiredSkills[action.payload.index].level) {
                return requiredSkills;
            }

            requiredSkills[action.payload.index].level -= 1;

            return requiredSkills;
        })());

        return Object.assign({}, state, {
            requiredSkills: Status.get('requiredSkills')
        });
    case 'CLEAN_REQUIRED_SKILLS':
        Status.set('requiredSkills', []);

        return Object.assign({}, state, {
            requiredSkills: Status.get('requiredSkills')
        });

    // case 'REQUIRED_EQUIP_PARTS':
    //     return Object.assign({}, state, {
    //         requiredEquipParts: action.payload.data
    //     });
    // case 'CURRENT_EQUIPS':
    //     return Object.assign({}, state, {
    //         currentEquips: action.payload.data
    //     });
    // case 'INVENTORY':
    //     return Object.assign({}, state, {
    //         inventory: action.payload.data
    //     });
    // case 'ALGORITHM_PARAMS':
    //     return Object.assign({}, state, {
    //         algorithmParams: action.payload.data
    //     });

    // Computed Bundles
    case 'UPDATE_COMPUTED_BUNDLES':
        Status.set('computedBundles', (() => {
            return action.payload.data;
        })());

        return Object.assign({}, state, {
            computedBundles: Status.get('computedBundles')
        });

    // Reserved Bundles
    case 'ADD_RESERVED_BUNDLE':
        Status.set('reservedBundles', (() => {
            let reservedBundles = state.reservedBundles;

            reservedBundles.add(action.payload.data);

            return reservedBundles;
        })());

        return Object.assign({}, state, {
            reservedBundles: Status.get('reservedBundles')
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

    /////

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
    }
};

const Getters = {
    getRequiredSets: () => {
        return Store.getState().requiredSets;
    },
    getRequiredSkills: () => {
        return Store.getState().requiredSkills;
    },
    getRequiredEquipParts: () => {
        return Store.getState().requiredEquipParts;
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
