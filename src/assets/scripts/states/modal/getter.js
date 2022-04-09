/**
 * Modal State - Getter
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import store from './store'

export const isShowChangelog = () => {
    return store.getState().changelog.isShow
}

export const isShowAlgorithmSetting = () => {
    return store.getState().algorithmSetting.isShow
}

export const getAlgorithmSettingBypassData = () => {
    return store.getState().algorithmSetting.bypassData
}

export const isShowBundleItemSelector = () => {
    return store.getState().bundleItemSelector.isShow
}

export const isShowConditionItemSelector = () => {
    return store.getState().conditionItemSelector.isShow
}

export const getConditionItemSelectorBypassData = () => {
    return store.getState().conditionItemSelector.bypassData
}

export const isShowEquipItemSelector = () => {
    return store.getState().equipItemSelector.isShow
}

export const getEquipItemSelectorBypassData = () => {
    return store.getState().equipItemSelector.bypassData
}

export default {
    isShowChangelog,
    isShowAlgorithmSetting,
    getAlgorithmSettingBypassData,
    isShowBundleItemSelector,
    isShowConditionItemSelector,
    getConditionItemSelectorBypassData,
    isShowEquipItemSelector,
    getEquipItemSelectorBypassData
}
