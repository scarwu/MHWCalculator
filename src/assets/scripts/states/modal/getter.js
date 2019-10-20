/**
 * Modal State - Getter
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import Store from './store';

export default {
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
