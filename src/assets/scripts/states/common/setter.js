/**
 * Common State - Setter
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import Store from './store';

export default {

    // Required Sets
    addRequiredSet: (setId) => {
        Store.dispatch({
            type: 'ADD_REQUIRED_SET',
            payload: {
                setId: setId
            }
        });
    },
    removeRequiredSet: (setId) => {
        Store.dispatch({
            type: 'REMOVE_REQUIRED_SET',
            payload: {
                setId: setId
            }
        });
    },
    increaseRequiredSetStep: (setId) => {
        Store.dispatch({
            type: 'INCREASE_REQUIRED_SET_STEP',
            payload: {
                setId: setId
            }
        });
    },
    decreaseRequiredSetStep: (setId) => {
        Store.dispatch({
            type: 'DECREASE_REQUIRED_SET_STEP',
            payload: {
                setId: setId
            }
        });
    },
    cleanRequiredSets: () => {
        Store.dispatch({
            type: 'CLEAN_REQUIRED_SETS'
        });
    },

    // Required Skills
    addRequiredSkill: (skillId) => {
        Store.dispatch({
            type: 'ADD_REQUIRED_SKILL',
            payload: {
                skillId: skillId
            }
        });
    },
    removeRequiredSkill: (skillId) => {
        Store.dispatch({
            type: 'REMOVE_REQUIRED_SKILL',
            payload: {
                skillId: skillId
            }
        });
    },
    increaseRequiredSkillLevel: (skillId) => {
        Store.dispatch({
            type: 'INCREASE_REQUIRED_SKILL_LEVEL',
            payload: {
                skillId: skillId
            }
        });
    },
    decreaseRequiredSkillLevel: (skillId) => {
        Store.dispatch({
            type: 'DECREASE_REQUIRED_SKILL_LEVEL',
            payload: {
                skillId: skillId
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

    // Algorithm Params
    setAlgorithmParamsLimit: (limit) => {
        Store.dispatch({
            type: 'SET_ALGORITHM_PARAMS_LIMIT',
            payload: {
                limit: limit
            }
        });
    },
    setAlgorithmParamsSort: (sort) => {
        Store.dispatch({
            type: 'SET_ALGORITHM_PARAMS_SORT',
            payload: {
                sort: sort
            }
        });
    },
    setAlgorithmParamsOrder: (order) => {
        Store.dispatch({
            type: 'SET_ALGORITHM_PARAMS_ORDER',
            payload: {
                order: order
            }
        });
    },
    toggleAlgorithmParamsFlag: (target) => {
        Store.dispatch({
            type: 'TOGGLE_ALGORITHM_PARAMS_FLAG',
            payload: {
                target: target
            }
        });
    },
    setAlgorithmParamsUsingFactor: (target, flag, value) => {
        Store.dispatch({
            type: 'SET_ALGORITHM_PARAMS_USING_FACTOR',
            payload: {
                target: target,
                flag: flag,
                value: value
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
