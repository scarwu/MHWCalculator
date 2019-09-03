'use strict';
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

// Load Config
import Config from 'config';

const statusPrefix = 'state:modal';

// Middleware
const diffLogger = store => next => action => {
    let prevState = Helper.deepCopy(store.getState());
    let result = next(action);
    let nextState = Helper.deepCopy(store.getState());
    let diffState = {};

    for (let key in prevState) {
        if (JSON.stringify(prevState[key]) === JSON.stringify(nextState[key])) {
            continue;
        }

        diffState[key] = nextState[key];

        Status.set(statusPrefix + ':' + key, nextState[key]);
    }

    Helper.log('ModalState action', action);
    Helper.log('ModalState diffState', diffState);

    return result;
};

// Store
const Store = createStore((state, action) => {
    if (undefined === state) {
        state = {
            changelog: ('production' === Config.env) ? {
                isShow: (Config.buildTime !== parseInt(Status.get('sys:buildTime')))
            } : Status.get(statusPrefix + ':changelog') || {
                isShow: false
            },
            algorithmSetting: Status.get(statusPrefix + ':algorithmSetting') || {
                isShow: false
            },
            inventorySetting: Status.get(statusPrefix + ':inventorySetting') || {
                isShow: false
            },
            equipBundleSelector: Status.get(statusPrefix + ':equipBundleSelector') || {
                isShow: false
            },
            setItemSelector: Status.get(statusPrefix + ':setItemSelector') || {
                isShow: false
            },
            skillItemSelector: Status.get(statusPrefix + ':skillItemSelector') || {
                isShow: false
            },
            equipItemSelector: Status.get(statusPrefix + ':equipItemSelector') || {
                isShow: false,
                bypassData: null
            }
        };
    }

    switch (action.type) {
    case 'UPDATE_CHANGELOG':
        return Object.assign({}, state, {
            changelog: {
                isShow: action.payload.isShow
            }
        });
    case 'UPDATE_INVENTORY_SETTING':
        return Object.assign({}, state, {
            inventorySetting: {
                isShow: action.payload.isShow
            }
        });
    case 'UPDATE_ALGORITHM_SETTING':
        return Object.assign({}, state, {
            algorithmSetting: {
                isShow: action.payload.isShow
            }
        });
    case 'UPDATE_EQUIP_BUNDLE_SELECTOR':
        return Object.assign({}, state, {
            equipBundleSelector: {
                isShow: action.payload.isShow
            }
        });
    case 'UPDATE_SET_ITEM_SELECTOR':
        return Object.assign({}, state, {
            setItemSelector: {
                isShow: action.payload.isShow
            }
        });
    case 'UPDATE_SKILL_ITEM_SELECTOR':
        return Object.assign({}, state, {
            skillItemSelector: {
                isShow: action.payload.isShow
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
        return state
    }
}, applyMiddleware(diffLogger));

const Setters = {
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
    showInventorySetting: () => {
        Store.dispatch({
            type: 'UPDATE_INVENTORY_SETTING',
            payload: {
                isShow: true
            }
        });
    },
    hideInventorySetting: () => {
        Store.dispatch({
            type: 'UPDATE_INVENTORY_SETTING',
            payload: {
                isShow: false
            }
        });
    },
    showEquipBundleSelector: () => {
        Store.dispatch({
            type: 'UPDATE_EQUIP_BUNDLE_SELECTOR',
            payload: {
                isShow: true
            }
        });
    },
    hideEquipBundleSelector: () => {
        Store.dispatch({
            type: 'UPDATE_EQUIP_BUNDLE_SELECTOR',
            payload: {
                isShow: false
            }
        });
    },
    showSetItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_SET_ITEM_SELECTOR',
            payload: {
                isShow: true
            }
        });
    },
    hideSetItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_SET_ITEM_SELECTOR',
            payload: {
                isShow: false
            }
        });
    },
    showSkillItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_SKILL_ITEM_SELECTOR',
            payload: {
                isShow: true
            }
        });
    },
    hideSkillItemSelector: () => {
        Store.dispatch({
            type: 'UPDATE_SKILL_ITEM_SELECTOR',
            payload: {
                isShow: false
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

const Getters = {
    isShowChangelog: () => {
        return Store.getState().changelog.isShow;
    },
    isShowAlgorithmSetting: () => {
        return Store.getState().algorithmSetting.isShow;
    },
    isShowInventorySetting: () => {
        return Store.getState().inventorySetting.isShow;
    },
    isShowEquipBundleSelector: () => {
        return Store.getState().equipBundleSelector.isShow;
    },
    isShowSetItemSelector: () => {
        return Store.getState().setItemSelector.isShow;
    },
    isShowSkillItemSelector: () => {
        return Store.getState().skillItemSelector.isShow;
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
    setters: Setters,
    getters: Getters
};
