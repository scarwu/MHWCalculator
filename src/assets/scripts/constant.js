'use strict';
/**
 * Constant
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

export default {
    // 大劍 4.8
    // 大鎚 5.2
    // 太刀 3.3
    // 片手劍/雙劍 1.4
    // 長槍/銃槍 2.3
    // 斬斧 3.5
    // 盾斧 3.6
    // 狩獵笛 4.2
    // 操蟲棍 3.1
    // 輕弩 1.3
    // 重弩 1.5
    // 弓 1.2
    defaultSets: {
        '狂暴雙刀': {
            weapon: {
                key: '罪【真】',
                slots: [],
                enhances: [
                    {
                        'key': '賦予回復能力'
                    }
                ]
            },
            helm: {
                key: '龍王的獨眼α',
                slots: [
                    {
                        key: '耐衝珠'
                    }
                ]
            },
            chest: {
                key: '杜賓鎧甲β',
                slots: [
                    {
                        key: '痛擊珠'
                    }
                ]
            },
            arm: {
                key: '異種大型鋼爪α',
                slots: [
                    {
                        key: '達人珠'
                    }
                ]
            },
            waist: {
                key: '慘爪龍腰甲β',
                slots: [
                    {
                        key: '無擊珠'
                    }
                ]
            },
            leg: {
                key: '杜賓護腿β',
                slots: [
                    {
                        key: '達人珠'
                    }
                ]
            },
            charm: {
                key: '攻擊護石 III'
            }
        },
        '破壞大劍': {
            weapon: {
                key: '龍熱機關式【鋼翼】改',
                slots: [
                    {
                        key: '奪氣珠'
                    },
                    {
                        key: '奪氣珠'
                    }
                ],
                enhances: []
            },
            helm: {
                key: '龍王的獨眼α',
                slots: [
                    {
                        key: 'KO珠'
                    }
                ]
            },
            chest: {
                key: '爆鎚龍鎧甲α',
                slots: [
                    {
                        key: '達人珠'
                    }
                ]
            },
            arm: {
                key: '帝王手β',
                slots: [
                    {
                        key: 'KO珠'
                    }
                ]
            },
            waist: {
                key: '爆鎚龍腰甲β',
                slots: [
                    {
                        key: '無擊珠'
                    },
                    {
                        key: '達人珠'
                    }
                ]
            },
            leg: {
                key: '死神護腿β',
                slots: [
                    {
                        key: '攻擊珠'
                    },
                    {
                        key: '攻擊珠'
                    }
                ]
            },
            charm: {
                key: '匠之護石 III'
            }
        }
    }
};
