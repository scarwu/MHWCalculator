/**
 * Modal State - Store
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

const statusMapping = {
    changelog:              'state:modal:1:changelog',
    algorithmSetting:       'state:modal:1:algorithmSetting',
    bundleItemSelector:     'state:modal:1:bundleItemSelector',
    conditionItemSelector:  'state:modal:1:conditionItemSelector',
    equipItemSelector:      'state:modal:1:equipItemSelector'
};

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

        Status.set(statusMapping[key], nextState[key]);
    }

    Helper.debug('State: Modal -> action', action);
    Helper.debug('State: Modal -> diffState', diffState);

    return result;
};

// Initial State
const initialState = {
    changelog: Status.get(statusMapping.changelog) || {
        isShow: false
    },
    algorithmSetting: Status.get(statusMapping.algorithmSetting) || {
        isShow: false,
        bypassData: null
    },
    bundleItemSelector: Status.get(statusMapping.bundleItemSelector) || {
        isShow: false
    },
    conditionItemSelector: Status.get(statusMapping.conditionItemSelector) || {
        isShow: false,
        bypassData: null
    },
    equipItemSelector: Status.get(statusMapping.equipItemSelector) || {
        isShow: false,
        bypassData: null
    }
};

export default createStore((state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_CHANGELOG':
        return Object.assign({}, state, {
            changelog: {
                isShow: action.payload.isShow
            }
        });
    case 'UPDATE_ALGORITHM_SETTING':
        return Object.assign({}, state, {
            algorithmSetting: {
                isShow: action.payload.isShow,
                bypassData: action.payload.bypassData
            }
        });
    case 'UPDATE_BUNDLE_ITEM_SELECTOR':
        return Object.assign({}, state, {
            bundleItemSelector: {
                isShow: action.payload.isShow
            }
        });
    case 'UPDATE_CONDITION_ITEM_SELECTOR':
        return Object.assign({}, state, {
            conditionItemSelector: {
                isShow: action.payload.isShow,
                bypassData: action.payload.bypassData
            }
        });
    case 'UPDATE_EQUIP_ITEM_SELECTOR':
        return Object.assign({}, state, {
            equipItemSelector: {
                isShow: action.payload.isShow,
                bypassData: action.payload.bypassData
            }
        });
    default:
        return state;
    }
}, applyMiddleware(diffLogger));
