'use strict';
/**
 * Common States
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
    // case 'REQUIRED_SETS':
    //     return Object.assign({}, state, {
    //         requiredSets: action.payload.data
    //     });
    // case 'REQUIRED_SKILLS':
    //     return Object.assign({}, state, {
    //         requiredSkills: action.payload.data
    //     });
    // case 'REQUIRED_EQUIPPARTS':
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
    case 'UPDATE_COMPUTED_BUNDLES':

        Status.set('computedBundles', action.payload.data);

        return Object.assign({}, state, {
            computedBundles: Status.get('computedBundles')
        });
    case 'ADD_RESERVED_BUNDLES':
        let reservedBundles = state.reservedBundles;

        reservedBundles.add(action.payload.data)

        Status.set('reservedBundles', reservedBundles);

        return Object.assign({}, state, {
            reservedBundles: Status.get('reservedBundles')
        });
    default:
        return state
    }
});

const Setters = {
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
    addReservedBundle: (data) => {
        Store.dispatch({
            type: 'ADD_RESERVED_BUNDLES',
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
