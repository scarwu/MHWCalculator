'use strict';
/**
 * Dataset Enhances
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

export default [
    [ '強化攻擊力', [
        [ 1, '基礎攻擊力+5', { attack: { value: 5 } } ],
        [ 2, '基礎攻擊力+10', { attack: { value: 10 } } ],
        [ 3, '基礎攻擊力+15', { attack: { value: 15 } } ]
    ] ],
    [ '強化會心率', [
        [ 1, '會心率+10%', { criticalRate: { value: 10 } } ],
        [ 2, '會心率+15%', { criticalRate: { value: 15 } } ],
        [ 3, '會心率+20%', { criticalRate: { value: 20 } } ]
    ] ],
    [ '強化防禦力', [
        [ 1, '防禦力+10', { defense: { value: 10 } } ],
        [ 2, '防禦力+20', { defense: { value: 20 } } ],
        [ 3, '防禦力+30', { defense: { value: 30 } } ]
    ] ],
    [ '強化鑲嵌槽', [
        [ 1, '1級鑲嵌槽+1', { addSlot: { size: 1 } } ],
        [ 2, '2級鑲嵌槽+1', { addSlot: { size: 2 } } ],
        [ 3, '3級鑲嵌槽+1', { addSlot: { size: 3 } } ]
    ] ],
    [ '賦予回復能力', [
        [ 1, '造成傷害時回復少量體力', null ],
        [ 2, '造成傷害時回復少量體力', null ],
        [ 3, '造成傷害時回復少量體力', null ]
    ] ]
].map((enhance) => {

    // Format
    // [
    //     0: name,
    //     1: list [
    //         [
    //             0: level,
    //             1: description,
    //             2: reaction { ... }
    //         ],
    //         [ ... ]
    //     ]
    // ]
    return {
        name: enhance[0],
        list: enhance[1].map((item) => {
            return {
                level: item[0],
                description: item[1],
                reaction: item[2]
            }
        })
    };
});
