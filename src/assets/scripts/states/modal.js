/**
 * Modal State
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

const statusPrefix = 'state:modal';

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

    Helper.log('State: Modal -> action', action);
    Helper.log('State: Modal -> diffState', diffState);

    return result;
};

// Initial State
const initialState = {
    changelog: Status.get(statusPrefix + ':changelog') || {
        isShow: false
    },
    algorithmSetting: Status.get(statusPrefix + ':algorithmSetting') || {
        isShow: false
    },
    bundleItemSelector: Status.get(statusPrefix + ':bundleItemSelector') || {
        isShow: false
    },
    conditionItemSelector: Status.get(statusPrefix + ':conditionItemSelector') || {
        isShow: false,
        bypassData: null
    },
    equipItemSelector: Status.get(statusPrefix + ':equipItemSelector') || {
        isShow: false,
        bypassData: null
    }
};

// Store
const Store = createStore((state = initialState, action) => {
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
                isShow: action.payload.isShow
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

const Setter = {
    showChangelog: () => {
        Store.dispatch({
            type: 'UPDATE_CHANGELOG',
            payload: {
                isShow: true
            }
        });
    },
    hideChangelog: () => {
        Store.dispatch({
            type: 'UPDATE_CHANGELOG',
            payload: {
                isShow: false
            }
        });
    },
    showAlgorithmSetting: () => {
        Store.dispatch({
            type: 'UPDATE_ALGORITHM_SETTING',
            payload: {
                isShow: true
            }
        });
    },
    hideAlgorithmSetting: () => {
        Store.dispatch({
            type: 'UPDATE_ALGORITHM_SETTING',
            payload: {
                isShow: false
            }
        });
    },
    showBundleItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_BUNDLE_ITEM_SELECTOR',
            payload: {
                isShow: true
            }
        });
    },
    hideBundleItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_BUNDLE_ITEM_SELECTOR',
            payload: {
                isShow: false
            }
        });
    },
    showConditionItemSelector: (bypassData = null) => {
        Store.dispatch({
            type: 'UPDATE_CONDITION_ITEM_SELECTOR',
            payload: {
                isShow: true,
                bypassData: bypassData
            }
        });
    },
    hideConditionItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_CONDITION_ITEM_SELECTOR',
            payload: {
                isShow: false,
                bypassData: null
            }
        });
    },
    showEquipItemSelector: (bypassData = null) => {
        Store.dispatch({
            type: 'UPDATE_EQUIP_ITEM_SELECTOR',
            payload: {
                isShow: true,
                bypassData: bypassData
            }
        });
    },
    hideEquipItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_EQUIP_ITEM_SELECTOR',
            payload: {
                isShow: false,
                bypassData: null
            }
        });
    }
};

const Getter = {
    isShowChangelog: () => {
        return Store.getState().changelog.isShow;
    },
    isShowAlgorithmSetting: () => {
        return Store.getState().algorithmSetting.isShow;
    },
    isShowBundleItemSelector: () => {
        return Store.getState().bundleItemSelector.isShow;
    },
    isShowConditionItemSelector: () => {
        return Store.getState().conditionItemSelector.isShow;
    },
    getConditionItemSelectorBypassData: () => {
        return Store.getState().conditionItemSelector.bypassData;
    },
    isShowEquipItemSelector: () => {
        return Store.getState().equipItemSelector.isShow;
    },
    getEquipItemSelectorBypassData: () => {
        return Store.getState().equipItemSelector.bypassData;
    }
};

export default {
    store: Store,
    setter: Setter,
    getter: Getter
};
