'use strict';
/**
 * Modal States
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

const Store = createStore((state, action) => {
    if (undefined === state) {
        state = {
            inventorySetting: {
                isShow: false,
                data: null
            },
            equipBundleSelector: {
                isShow: false,
                data: null
            },
            setItemSelector: {
                isShow: false,
                data: null
            },
            skillItemSelector: {
                isShow: false,
                data: null
            },
            equipItemSelector: {
                isShow: false,
                data: null
            },
            changelog: {
                isShow: ('production' === Config.env)
                    ? (Config.buildTime !== parseInt(Status.get('sys:buildTime'))) : false,
                data: null
            }
        };
    }

    Helper.log('Modal States', action);

    switch (action.type) {
    case 'CHANGE_INVENTORY_SETTING':
        return Object.assign({}, state, {
            inventorySetting: {
                isShow: action.payload.isShow,
                data: action.payload.data
            }
        });
    case 'CHANGE_EQUIP_BUNDLE_SELECTOR':
        return Object.assign({}, state, {
            equipBundleSelector: {
                isShow: action.payload.isShow,
                data: action.payload.data
            }
        });
    case 'CHANGE_SET_ITEM_SELECTOR':
        return Object.assign({}, state, {
            setItemSelector: {
                isShow: action.payload.isShow,
                data: action.payload.data
            }
        });
    case 'CHANGE_SKILL_ITEM_SELECTOR':
        return Object.assign({}, state, {
            skillItemSelector: {
                isShow: action.payload.isShow,
                data: action.payload.data
            }
        });
    case 'CHANGE_EQUIP_ITEM_SELECTOR':
        return Object.assign({}, state, {
            equipItemSelector: {
                isShow: action.payload.isShow,
                data: action.payload.data
            }
        });
    case 'CHANGE_CHANGELOG':
        return Object.assign({}, state, {
            changelog: {
                isShow: action.payload.isShow,
                data: action.payload.data
            }
        });
    default:
        return state
    }
});

const Setters = {
    showInventorySetting: (data = null) => {
        Store.dispatch({
            type: 'CHANGE_INVENTORY_SETTING',
            payload: {
                isShow: true,
                data: data
            }
        });
    },
    hideInventorySetting: () => {
        Store.dispatch({
            type: 'CHANGE_INVENTORY_SETTING',
            payload: {
                isShow: false,
                data: null
            }
        });
    },
    showEquipBundleSelector: (data = null) => {
        Store.dispatch({
            type: 'CHANGE_EQUIP_BUNDLE_SELECTOR',
            payload: {
                isShow: true,
                data: data
            }
        });
    },
    hideEquipBundleSelector: () => {
        Store.dispatch({
            type: 'CHANGE_EQUIP_BUNDLE_SELECTOR',
            payload: {
                isShow: false,
                data: null
            }
        });
    },
    showSetItemSelector: (data = null) => {
        Store.dispatch({
            type: 'CHANGE_SET_ITEM_SELECTOR',
            payload: {
                isShow: true,
                data: data
            }
        });
    },
    hideSetItemSelector: () => {
        Store.dispatch({
            type: 'CHANGE_SET_ITEM_SELECTOR',
            payload: {
                isShow: false,
                data: null
            }
        });
    },
    showSkillItemSelector: (data = null) => {
        Store.dispatch({
            type: 'CHANGE_SKILL_ITEM_SELECTOR',
            payload: {
                isShow: true,
                data: data
            }
        });
    },
    hideSkillItemSelector: () => {
        Store.dispatch({
            type: 'CHANGE_SKILL_ITEM_SELECTOR',
            payload: {
                isShow: false,
                data: null
            }
        });
    },
    showEquipItemSelector: (data = null) => {
        Store.dispatch({
            type: 'CHANGE_EQUIP_ITEM_SELECTOR',
            payload: {
                isShow: true,
                data: data
            }
        });
    },
    hideEquipItemSelector: () => {
        Store.dispatch({
            type: 'CHANGE_EQUIP_ITEM_SELECTOR',
            payload: {
                isShow: false,
                data: null
            }
        });
    },
    showChangelog: (data = null) => {
        Store.dispatch({
            type: 'CHANGE_CHANGELOG',
            payload: {
                isShow: true,
                data: data
            }
        });
    },
    hideChangelog: () => {
        Store.dispatch({
            type: 'CHANGE_CHANGELOG',
            payload: {
                isShow: false,
                data: null
            }
        });
    }
};

const Getters = {
    isShowInventorySetting: () => {
        return Store.getState().inventorySetting.isShow;
    },
    getInventorySettingData: () => {
        return Store.getState().inventorySetting.data;
    },
    isShowEquipBundleSelector: () => {
        return Store.getState().equipBundleSelector.isShow;
    },
    getEquipBundleSelectorData: () => {
        return Store.getState().equipBundleSelector.data;
    },
    isShowSetItemSelector: () => {
        return Store.getState().setItemSelector.isShow;
    },
    getSetItemSelectorData: () => {
        return Store.getState().setItemSelector.data;
    },
    isShowSkillItemSelector: () => {
        return Store.getState().skillItemSelector.isShow;
    },
    getSkillItemSelectorData: () => {
        return Store.getState().skillItemSelector.data;
    },
    isShowEquipItemSelector: () => {
        return Store.getState().equipItemSelector.isShow;
    },
    getEquipItemSelectorData: () => {
        return Store.getState().equipItemSelector.data;
    },
    isShowChangelog: () => {
        return Store.getState().changelog.isShow;
    },
    getChangelogData: () => {
        return Store.getState().changelog.data;
    }
};

export default {
    store: Store,
    setters: Setters,
    getters: Getters
};
