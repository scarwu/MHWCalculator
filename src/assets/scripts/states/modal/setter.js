/**
 * Modal State - Setter
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import store from './store'

export const showChangelog = () => {
    store.dispatch({
        type: 'UPDATE_CHANGELOG',
        payload: {
            isShow: true
        }
    })
}

export const hideChangelog = () => {
    store.dispatch({
        type: 'UPDATE_CHANGELOG',
        payload: {
            isShow: false
        }
    })
}

export const showAlgorithmSetting = (bypassData = null) => {
    store.dispatch({
        type: 'UPDATE_ALGORITHM_SETTING',
        payload: {
            isShow: true,
            bypassData: bypassData
        }
    })
}

export const hideAlgorithmSetting = () => {
    store.dispatch({
        type: 'UPDATE_ALGORITHM_SETTING',
        payload: {
            isShow: false,
            bypassData: null
        }
    })
}

export const showBundleItemSelector = () => {
    store.dispatch({
        type: 'UPDATE_BUNDLE_ITEM_SELECTOR',
        payload: {
            isShow: true
        }
    })
}

export const hideBundleItemSelector = () => {
    store.dispatch({
        type: 'UPDATE_BUNDLE_ITEM_SELECTOR',
        payload: {
            isShow: false
        }
    })
}

export const showConditionItemSelector = (bypassData = null) => {
    store.dispatch({
        type: 'UPDATE_CONDITION_ITEM_SELECTOR',
        payload: {
            isShow: true,
            bypassData: bypassData
        }
    })
}

export const hideConditionItemSelector = () => {
    store.dispatch({
        type: 'UPDATE_CONDITION_ITEM_SELECTOR',
        payload: {
            isShow: false,
            bypassData: null
        }
    })
}

export const showEquipItemSelector = (bypassData = null) => {
    store.dispatch({
        type: 'UPDATE_EQUIP_ITEM_SELECTOR',
        payload: {
            isShow: true,
            bypassData: bypassData
        }
    })
}

export const hideEquipItemSelector = () => {
    store.dispatch({
        type: 'UPDATE_EQUIP_ITEM_SELECTOR',
        payload: {
            isShow: false,
            bypassData: null
        }
    })
}

export default {
    showChangelog,
    hideChangelog,
    showAlgorithmSetting,
    hideAlgorithmSetting,
    showBundleItemSelector,
    hideBundleItemSelector,
    showConditionItemSelector,
    hideConditionItemSelector,
    showEquipItemSelector,
    hideEquipItemSelector
}
