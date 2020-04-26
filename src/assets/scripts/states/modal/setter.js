/**
 * Modal State - Setter
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import Store from './store';

export default {
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
    showAlgorithmSetting: (bypassData = null) => {
        Store.dispatch({
            type: 'UPDATE_ALGORITHM_SETTING',
            payload: {
                isShow: true,
                bypassData: bypassData
            }
        });
    },
    hideAlgorithmSetting: () => {
        Store.dispatch({
            type: 'UPDATE_ALGORITHM_SETTING',
            payload: {
                isShow: false,
                bypassData: null
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
