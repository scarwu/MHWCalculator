'use strict';
/**
 * Dataset Skills
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

export default [
    [ '體力增強', 'active', [ false, true, true ], [
        [ 1, '體力+15', {
            health: { value: 15 }
        } ],
        [ 2, '體力+30', {
            health: { value: 30 }
        } ],
        [ 3, '體力+50', {
            health: { value: 50 }
        } ]
    ] ],
    [ '體力回復量UP', 'active', [ false, true, true ], [
        [ 1, '回復量1.1倍', null ],
        [ 2, '回復量1.2倍', null ],
        [ 3, '回復量1.3倍', null ]
    ] ],
    [ 'KO術', 'active', [ false, true, true ], [
        [ 1, '昏厥威力1.1倍', null ],
        [ 2, '昏厥威力1.2倍', null ],
        [ 3, '昏厥威力1.3倍', null ]
    ] ],
    [ '體術', 'active', [ false, true, true ], [
        [ 1, '固定耐力消耗量減少10%', null ],
        [ 2, '固定耐力消耗量減少20%', null ],
        [ 3, '固定耐力消耗量減少30%', null ],
        [ 4, '固定耐力消耗量減少40%', null ],
        [ 5, '固定耐力消耗量減少50%', null ]
    ] ],
    [ '力量解放', 'passive', [ false, true, true ], [
        [ 1, '技能發動時，會心率+10%，耐力消耗量減少10%', {
            criticalRate: { value: 10 }
        } ],
        [ 2, '技能發動時，會心率+20%，耐力消耗量減少20%', {
            criticalRate: { value: 20 }
        } ],
        [ 3, '技能發動時，會心率+30%，耐力消耗量減少30%', {
            criticalRate: { value: 30 }
        } ],
        [ 4, '技能發動時，會心率+40%，耐力消耗量減少40%', {
            criticalRate: { value: 40 }
        } ],
        [ 5, '技能發動時，會心率+50%，耐力消耗量減少50%', {
            criticalRate: { value: 50 }
        } ]
    ] ],
    [ '水屬性攻擊強化', 'active', [ false, true, true ], [
        [ 1, '水屬性攻擊值+30', {
            elementAttack: { type: 'water', value: 30, multiple: 1 }
        } ],
        [ 2, '水屬性攻擊值+60', {
            elementAttack: { type: 'water', value: 60, multiple: 1 }
        } ],
        [ 3, '水屬性攻擊值+100', {
            elementAttack: { type: 'water', value: 100, multiple: 1 }
        } ],
        [ 4, '水屬性攻擊值變為1.05倍，水屬性攻擊值+100', {
            elementAttack: { type: 'water', value: 100, multiple: 1.05 }
        } ],
        [ 5, '水屬性攻擊值變為1.1倍，水屬性攻擊值+100', {
            elementAttack: { type: 'water', value: 100, multiple: 1.1 }
        } ]
    ] ],
    [ '火屬性攻擊強化', 'active', [ false, true, true ], [
        [ 1, '火屬性攻擊值+30', {
            elementAttack: { type: 'fire', value: 30, multiple: 1 }
        } ],
        [ 2, '火屬性攻擊值+60', {
            elementAttack: { type: 'fire', value: 60, multiple: 1 }
        } ],
        [ 3, '火屬性攻擊值+100', {
            elementAttack: { type: 'fire', value: 100, multiple: 1 }
        } ],
        [ 4, '火屬性攻擊值變為1.05倍，火屬性攻擊值+100', {
            elementAttack: { type: 'fire', value: 100, multiple: 1.05 }
        } ],
        [ 5, '火屬性攻擊值變為1.1倍，火屬性攻擊值+100', {
            elementAttack: { type: 'fire', value: 100, multiple: 1.1 }
        } ]
    ] ],
    [ '心眼／彈導強化', 'active', [ true, true, false ], [
        [ 1, '攻擊不會被彈開，縮短彈藥、箭矢達到最大威力時的距離', null ]
    ] ],
    [ '火耐性', 'active', [ false, true, true ], [
        [ 1, '火耐性+6', {
            resistance: { type: 'fire', value: 6 }
        } ],
        [ 2, '火耐性+12', {
            resistance: { type: 'fire', value: 12 }
        } ],
        [ 3, '火耐性+20、防禦力+10', {
            defense: { value: 10 },
            resistance: { type: 'fire', value: 20 }
        } ]
    ] ],
    [ '水耐性', 'active', [ false, true, true ], [
        [ 1, '水耐性+6', {
            resistance: { type: 'water', value: 6 }
        } ],
        [ 2, '水耐性+12', {
            resistance: { type: 'water', value: 12 }
        } ],
        [ 3, '水耐性+20、防禦力+10', {
            defense: { value: 10 },
            resistance: { type: 'water', value: 20 }
        } ]
    ] ],
    [ '不屈', 'passive', [ false, true, true ], [
        [ 1, '每次攻擊力1.1倍、防禦力1.15倍', {
            attackMultiple: { value: 1.1 },
            defenseMultiple: { value: 1.15 }
        } ]
    ] ],
    [ '火場怪力', 'passive', [ false, true, true ], [
        [ 1, '技能發動時，攻擊力1.05倍，防禦力+15', {
            attackMultiple: { value: 1.05 },
            defense: { value: 15 }
        } ],
        [ 2, '技能發動時，攻擊力1.1倍，防禦力+20', {
            attackMultiple: { value: 1.1 },
            defense: { value: 20 }
        } ],
        [ 3, '技能發動時，攻擊力1.15倍，防禦力+25', {
            attackMultiple: { value: 1.15 },
            defense: { value: 25 }
        } ],
        [ 4, '技能發動時，攻擊力1.2倍，防禦力+30', {
            attackMultiple: { value: 1.2 },
            defense: { value: 30 }
        } ],
        [ 5, '技能發動時，攻擊力1.3倍，防禦力+40', {
            attackMultiple: { value: 1.3 },
            defense: { value: 40 }
        } ]
    ] ],
    [ '加速再生', 'active', [ true, false, false ], [
        [ 1, '若持續攻擊命中魔物，便能回復體力。回復量會依武器種類不同而有所變動', null ]
    ] ],
    [ '冰耐性', 'active', [ false, true, true ], [
        [ 1, '冰耐性+6', {
            resistance: { type: 'ice', value: 6 }
        } ],
        [ 2, '冰耐性+12', {
            resistance: { type: 'ice', value: 12 }
        } ],
        [ 3, '冰耐性+20、防禦力+10', {
            defense: { value: 10 },
            resistance: { type: 'ice', value: 20 }
        } ]
    ] ],
    [ '地質學', 'active', [ false, true, true ], [
        [ 1, '駭骨採集點的採集次數+1', null ],
        [ 2, '追加特產品採集點的採集次數+1', null ],
        [ 3, '追加礦石採集點的採集次數+1', null ]
    ] ],
    [ '回復速度', 'active', [ false, true, true ], [
        [ 1, '紅色計量表的自動回復速度2倍', null ],
        [ 2, '紅色計量表的自動回復速度3倍', null ],
        [ 3, '紅色計量表的自動回復速度4倍', null ]
    ] ],
    [ '冰屬性攻擊強化', 'active', [ false, true, true ], [
        [ 1, '冰屬性攻擊值+30', {
            elementAttack: { type: 'ice', value: 30, multiple: 1 }
        } ],
        [ 2, '冰屬性攻擊值+60', {
            elementAttack: { type: 'ice', value: 60, multiple: 1 }
        } ],
        [ 3, '冰屬性攻擊值+100', {
            elementAttack: { type: 'ice', value: 100, multiple: 1 }
        } ],
        [ 4, '冰屬性攻擊值變為1.05倍，冰屬性攻擊值+100', {
            elementAttack: { type: 'ice', value: 100, multiple: 1.05 }
        } ],
        [ 5, '冰屬性攻擊值變為1.1倍，冰屬性攻擊值+100', {
            elementAttack: { type: 'ice', value: 100, multiple: 1.1 }
        } ]
    ] ],
    [ '收刀術', 'active', [ false, true, true ], [
        [ 1, '速度小幅上升', null ],
        [ 2, '速度上升', null ],
        [ 3, '速度大幅上升', null ]
    ] ],
    [ '耳塞', 'active', [ false, true, true ], [
        [ 1, '小幅減輕咆哮【小】的影響', null ],
        [ 2, '減輕咆哮【小】的影響', null ],
        [ 3, '使咆哮【小】無效', null ],
        [ 4, '使咆哮【小】無效，減輕咆哮【大】的影響', null ],
        [ 5, '使咆哮【小】【大】無效', null ]
    ] ],
    [ '死裡逃生', 'active', [ false, true, true ], [
        [ 1, '技能發動時，大幅延長迴避的無敵時間，並減少耐力消耗量', null ]
    ] ],
    [ '匠', 'active', [ false, true, true ], [
        [ 1, '武器的銳利度+10', {
            sharpness: { value: 10 }
        } ],
        [ 2, '武器的銳利度+20', {
            sharpness: { value: 20 }
        } ],
        [ 3, '武器的銳利度+30', {
            sharpness: { value: 30 }
        } ],
        [ 4, '武器的銳利度+40', {
            sharpness: { value: 40 }
        } ],
        [ 5, '武器的銳利度+50', {
            sharpness: { value: 50 }
        } ]
    ] ],
    [ '攻擊', 'active', [ false, true, true ], [
        [ 1, '基礎攻擊力+3', {
            attack: { value: 3 }
        } ],
        [ 2, '基礎攻擊力+6', {
            attack: { value: 6 }
        } ],
        [ 3, '基礎攻擊力+9', {
            attack: { value: 9 }
        } ],
        [ 4, '基礎攻擊力+12、會心率+5%', {
            attack: { value: 12 },
            criticalRate: { value: 5 }
        } ],
        [ 5, '基礎攻擊力+15、會心率+5%', {
            attack: { value: 15 },
            criticalRate: { value: 5 }
        } ],
        [ 6, '基礎攻擊力+18、會心率+5%', {
            attack: { value: 18 },
            criticalRate: { value: 5 }
        } ],
        [ 7, '基礎攻擊力+21、會心率+5%', {
            attack: { value: 21 },
            criticalRate: { value: 5 }
        } ]
    ] ],
    [ '吹笛名人', 'active', [ false, true, true ], [
        [ 1, '延長狩獵笛旋律效果時間，體力回復量的上升率UP', null ]
    ] ],
    [ '防禦強化', 'active', [ true, true, false ], [
        [ 1, '可以防禦一般無法防禦的攻擊', null ]
    ] ],
    [ '投射器裝填數UP', 'active', [ false, true, true ], [
        [ 1, '小幅增加在地面或植物取得的彈藥裝填數', null ],
        [ 2, '再小幅增加一部份魔物掉落的彈藥裝填數', null ],
        [ 3, '再小幅增加所有魔物掉落的彈藥裝填數', null ]
    ] ],
    [ '防御力DOWN耐性', 'active', [ false, true, true ], [
        [ 1, '減少防禦力DOWN狀態的時間30%', null ],
        [ 2, '減少防禦力DOWN狀態的時間60%', null ],
        [ 3, '不會變為防禦力DOWN狀態', null ]
    ] ],
    [ '防禦', 'active', [ false, true, true ], [
        [ 1, '防禦力+5', {
            defense: { value: 5 }
        } ],
        [ 2, '防禦力+10', {
            defense: { value: 10 }
        } ],
        [ 3, '防禦力+15', {
            defense: { value: 15 }
        } ],
        [ 4, '防禦力+20，全屬性耐性值+3', {
            defense: { value: 20 },
            resistance: { type: 'all', value: 3 }
        } ],
        [ 5, '防禦力+25，全屬性耐性值+3', {
            defense: { value: 25 },
            resistance: { type: '全部', value: 3 }
        } ],
        [ 6, '防禦力+30，全屬性耐性值+3', {
            defense: { value: 30 },
            resistance: { type: 'all', value: 3 }
        } ],
        [ 7, '防禦力+35，全屬性耐性值+3', {
            defense: { value: 35 },
            resistance: { type: 'all', value: 3 }
        } ]
    ] ],
    [ '利刃／彈藥節約', 'active', [ true, false, false ], [
        [ 1, '銳利度的消耗降低一半 ／ 有少量機會在射擊時不消耗弩槍的彈藥及弓的瓶', null ]
    ] ],
    [ '快吃', 'active', [ false, true, true ], [
        [ 1, '速度小幅上升', null ],
        [ 2, '速度上升', null ],
        [ 3, '速度大幅上升', null ]
    ] ],
    [ '防禦性能', 'active', [ false, true, true ], [
        [ 1, '小幅減少攻擊的威力', null ],
        [ 2, '小幅減少攻擊的威力，減少耐力消費量15%', null ],
        [ 3, '大幅減少攻擊的威力，減少耐力消費量15%', null ],
        [ 4, '大幅減少攻擊的威力，減少耐力消費量30%', null ],
        [ 5, '極大幅減少攻擊的威力，減少耐力消費量50%', null ]
    ] ],
    [ '拔刀術【力】', 'active', [ true, false, false ], [
        [ 1, '追加、強化武器拔刀攻擊所引起的昏厥的能力，攻擊力也會小幅提升', null ]
    ] ],
    [ '泥耐性', 'active', [ false, false, true ], [
        [ 1, '減輕移動速度、迴避行動的限制', null ]
    ] ],
    [ '拔刀術【技】', 'passive', [ false, true, true ], [
        [ 1, '武器拔刀攻擊的會心率+30%', {
            criticalRate: { value: 30 }
        } ],
        [ 2, '武器拔刀攻擊的會心率+60%', {
            criticalRate: { value: 60 }
        } ],
        [ 3, '武器拔刀攻擊的會心率+100%', {
            criticalRate: { value: 100 }
        } ]
    ] ],
    [ '幸運', 'active', [ true, false, false ], [
        [ 1, '完成任務獲得的報酬數量容易變多(從任務中途開始使用不會有效果)', null ]
    ] ],
    [ '昏厥耐性', 'active', [ false, true, true ], [
        [ 1, '減少昏厥狀態的時間30%', null ],
        [ 2, '減少昏厥狀態的時間60%', null ],
        [ 3, '不會變為昏厥狀態', null ]
    ] ],
    [ '昆蟲標本達人', 'active', [ false, true, true ], [
        [ 1, '屍體殘留的機率提高', null ],
        [ 2, '屍體殘留的機率大幅提高', null ],
        [ 3, '必定會有屍體殘留', null ]
    ] ],
    [ '看破', 'active', [ false, true, true ], [
        [ 1, '會心率+3%', {
            criticalRate: { value: 3 }
        } ],
        [ 2, '會心率+6%', {
            criticalRate: { value: 6 }
        } ],
        [ 3, '會心率+10%', {
            criticalRate: { value: 10 }
        } ],
        [ 4, '會心率+15%', {
            criticalRate: { value: 15 }
        } ],
        [ 5, '會心率+20%', {
            criticalRate: { value: 20 }
        } ],
        [ 6, '會心率+25%', {
            criticalRate: { value: 25 }
        } ],
        [ 7, '會心率+30%', {
            criticalRate: { value: 30 }
        } ]
    ] ],
    [ '指示隨從', 'active', [ false, true, true ], [
        [ 1, '隨從的攻擊力與防禦力變為1.05倍', null ],
        [ 2, '隨從的攻擊力與防禦力變為1.1倍', null ],
        [ 3, '隨從的攻擊力與防禦力變為1.15倍', null ],
        [ 4, '隨從的攻擊力與防禦力變為1.2倍', null ],
        [ 5, '隨從的攻擊力與防禦力變為1.25倍', null ]
    ] ],
    [ '飛身躍入', 'active', [ false, false, true ], [
        [ 1, '可以發動技能', null ]
    ] ],
    [ '炸彈客', 'active', [ false, true, true ], [
        [ 1, '威力1.1倍', null ],
        [ 2, '威力1.2倍', null ],
        [ 3, '威力1.3倍', null ]
    ] ],
    [ '毒屬性強化', 'active', [ false, true, true ], [
        [ 1, '毒素累積值變為1.05倍，毒素累積值+10', null ],
        [ 2, '毒素累積值變為1.1倍，毒素累積值+10', null ],
        [ 3, '毒素累積值變為1.2倍，毒素累積值+10', null ]
    ] ],
    [ '耐力急速回復', 'active', [ false, true, true ], [
        [ 1, '回復速度1.1倍', null ],
        [ 2, '回復速度1.2倍', null ],
        [ 3, '回復速度1.3倍', null ]
    ] ],
    [ '風壓完全無效', 'active', [ true, false, false ], [
        [ 1, '使全部的風壓無效', null ]
    ] ],
    [ '風壓耐性', 'active', [ false, true, true ], [
        [ 1, '小幅減輕風壓【小】', null ],
        [ 2, '減輕風壓【小】', null ],
        [ 3, '使風壓【小】無效', null ],
        [ 4, '使風壓【小】無效，減輕風壓【大】', null ],
        [ 5, '使風壓【小】【大】無效', null ]
    ] ],
    [ '突破耐力上限', 'active', [ true, false, false ], [
        [ 1, '增加耐力的上限值', {
            stamina: { value: 50 }
        } ]
    ] ],
    [ '耐震', 'active', [ false, true, true ], [
        [ 1, '使震動【小】無效', null ],
        [ 2, '使震動【小】無效，減輕震動【大】的影響', null ],
        [ 3, '使震動【小】【大】無效', null ]
    ] ],
    [ '飛燕', 'passive', [ false, true, true ], [
        [ 1, '跳躍攻擊的威力變為1.1倍', {
            attackMultiple: { value: 1.1 }
        } ]
    ] ],
    [ '飛燕【屬性】', 'passive', [ false, true, true ], [
        [ 1, '跳躍攻擊的屬性傷害UP', null ]
    ] ],
    [ '毒耐性', 'active', [ false, true, true ], [
        [ 1, '減少中毒狀態的時間30%', null ],
        [ 2, '減少中毒狀態的時間60%', null ],
        [ 3, '不會變為中毒狀態', null ]
    ] ],
    [ '威嚇', 'active', [ false, true, true ], [
        [ 1, '即使被發現也不容易進入戰鬥狀態', null ],
        [ 2, '即使被發現也幾乎不會進入戰鬥狀態', null ],
        [ 3, '即使被發現也不會變為戰鬥狀態', null ]
    ] ],
    [ '研究者', 'active', [ false, false, true ], [
        [ 1, '更容易調查及研究大型魔物', null ]
    ] ],
    [ '毒傷害強化', 'active', [ true, false, false ], [
        [ 1, '提高對魔物施毒的效果時間', null ]
    ] ],
    [ '挑戰者', 'passive', [ false, true, true ], [
        [ 1, '技能發動時，基礎攻擊力+4，會心率+3%', {
            attack: { value: 4 },
            criticalRate: { value: 3 }
        } ],
        [ 2, '技能發動時，基礎攻擊力+8，會心率+6%', {
            attack: { value: 8 },
            criticalRate: { value: 6 }
        } ],
        [ 3, '技能發動時，基礎攻擊力+12，會心率+9%', {
            attack: { value: 12 },
            criticalRate: { value: 9 }
        } ],
        [ 4, '技能發動時，基礎攻擊力+16，會心率+12%', {
            attack: { value: 16 },
            criticalRate: { value: 12 }
        } ],
        [ 5, '技能發動時，基礎攻擊力+20，會心率+15%', {
            attack: { value: 20 },
            criticalRate: { value: 15 }
        } ]
    ] ],
    [ '怨恨', 'passive', [ false, true, true ], [
        [ 1, '技能發動時，基礎攻擊力+5', {
            attack: { value: 5 }
        } ],
        [ 2, '技能發動時，基礎攻擊力+10', {
            attack: { value: 10 }
        } ],
        [ 3, '技能發動時，基礎攻擊力+15', {
            attack: { value: 15 }
        } ],
        [ 4, '技能發動時，基礎攻擊力+20', {
            attack: { value: 20 }
        } ],
        [ 5, '技能發動時，基礎攻擊力+25', {
            attack: { value: 25 }
        } ]
    ] ],
    [ '毒瓶追加', 'active', [ false, true, false ], [
        [ 1, '弓可以裝著毒瓶', null ]
    ] ],
    [ '砲術', 'active', [ false, true, true ], [
        [ 1, '對象的攻擊力1.1倍，減少龍擊砲的冷卻時間15%', null ],
        [ 2, '對象的攻擊力1.2倍，減少龍擊砲的冷卻時間30%', null ],
        [ 3, '對象的攻擊力1.3倍，減少龍擊砲的冷卻時間50%', null ]
    ] ],
    [ '迴避性能', 'active', [ false, true, true ], [
        [ 1, '無敵時間極小幅延長', null ],
        [ 2, '無敵時間小幅延長', null ],
        [ 3, '延長無敵時間', null ],
        [ 4, '大幅延長無敵時間', null ],
        [ 5, '極大幅延長無敵時間', null ]
    ] ],
    [ '破壞王', 'active', [ false, true, true ], [
        [ 1, '對部位的累積傷害1.1倍', null ],
        [ 2, '對部位的累積傷害1.2倍', null ],
        [ 3, '對部位的累積傷害1.3倍', null ]
    ] ],
    [ '剝取名人', 'active', [ true, false, false ], [
        [ 1, '剝取回數增加1回(從任務中途開始使用不會有效果)', null ]
    ] ],
    [ '迴避距離UP', 'active', [ false, true, true ], [
        [ 1, '迴避距離小幅延長', null ],
        [ 2, '延長迴避距離', null ],
        [ 3, '大幅延長迴避距離', null ]
    ] ],
    [ '振奮', 'active', [ true, false, false ], [
        [ 1, '體力降低至40%以下時，一定時間內耐力的消耗量會減少', null ]
    ] ],
    [ '追蹤達人', 'active', [ false, true, true ], [
        [ 1, '取得痕跡時的計量表上升量1.5倍', null ]
    ] ],
    [ '剝取鐵人', 'active', [ false, false, true ], [
        [ 1, '剝取中，後仰無效', null ]
    ] ],
    [ '砲擊手', 'active', [ false, true, true ], [
        [ 1, '威力1.1倍', null ],
        [ 2, '威力1.2倍', null ]
    ] ],
    [ '剛刃研磨', 'active', [ true, true, false ], [
        [ 1, '研磨武器後，一定時間內銳利度不會降低', null ]
    ] ],
    [ '砥石使用高速化', 'active', [ false, true, true ], [
        [ 1, '省略研磨動作1次', null ],
        [ 2, '省略研磨動作2次', null ],
        [ 3, '省略研磨動作3次', null ]
    ] ],
    [ '砲彈裝填數UP', 'active', [ false, true, true ], [
        [ 1, '裝填數+1', null ]
    ] ],
    [ '烤肉名人', 'active', [ false, false, false ], [
        [ 1, '更容易烤出全熟肉', null ]
    ] ],
    [ '飢餓耐性', 'active', [ false, true, true ], [
        [ 1, '到減少的時間延長30%', null ],
        [ 2, '到減少的時間延長60%', null ],
        [ 3, '使耐力最大值的減少無效', null ]
    ] ],
    [ '特殊射擊強化', 'active', [ false, true, true ], [
        [ 1, '弩的特殊彈藥和弓的龍之箭的威力變為1.1倍', null ],
        [ 2, '弩的特殊彈藥和弓的龍之箭的威力變為1.2倍', null ]
    ] ],
    [ '弱點特效', 'passive', [ false, true, true ], [
        [ 1, '攻擊有效部份時，會心率+15%', {
            criticalRate: { value: 15 }
        } ],
        [ 2, '攻擊有效部份時，會心率+30%', {
            criticalRate: { value: 30 }
        } ],
        [ 3, '攻擊有效部份時，會心率+50%', {
            criticalRate: { value: 50 }
        } ]
    ] ],
    [ '閃光強化', 'active', [ false, false, true ], [
        [ 1, '閃光效果的生效率UP', null ]
    ] ],
    [ '捕獲名人', 'active', [ true, false, false ], [
        [ 1, '捕獲獲取得的報酬數量變多的機率很高(從任務中途開始使用不會有效果)', null ]
    ] ],
    [ '採集達人', 'active', [ false, false, true ], [
        [ 1, '採集行動時，速度上升＆後仰無效', null ]
    ] ],
    [ '異臭名人', 'active', [ false, false, true ], [
        [ 1, '提高逃離投射器異臭彈的效果', null ]
    ] ],
    [ '貫通彈・龍之箭強化', 'active', [ false, true, true ], [
        [ 1, '貫通彈、龍之箭的威力UP', null ]
    ] ],
    [ '強化持續', 'active', [ false, true, true ], [
        [ 1, '持續時間1.1倍', null ],
        [ 2, '持續時間1.2倍', null ],
        [ 3, '持續時間1.3倍', null ]
    ] ],
    [ '釣魚名人', 'active', [ false, false, true ], [
        [ 1, '延長釣起魚的時間，就更容易釣起大魚', null ]
    ] ],
    [ '通常彈・通常箭強化', 'active', [ false, true, true ], [
        [ 1, '通常彈、通常箭的威力UP', null ]
    ] ],
    [ '麻痺耐性', 'active', [ false, true, true ], [
        [ 1, '減少麻痺狀態的時間30%', null ],
        [ 2, '減少麻痺狀態的時間60%', null ],
        [ 3, '不會變為麻痺狀態', null ]
    ] ],
    [ '麻痺屬性強化', 'active', [ false, true, true ], [
        [ 1, '麻痺累積值變為1.05倍，麻痺累積值+10', null ],
        [ 2, '麻痺累積值變為1.1倍，麻痺累積值+10', null ],
        [ 3, '麻痺累積值變為1.2倍，麻痺累積值+10', null ]
    ] ],
    [ '探索者的幸運', 'active', [ false, false, true ], [
        [ 1, '發生機率UP', null ]
    ] ],
    [ '強運', 'active', [ true, false, false ], [
        [ 1, '完成任務獲取得的報酬數量變多的機率很高(從任務中途開始使用不會有效果)', null ]
    ] ],
    [ '麻痺瓶追加', 'active', [ false, true, false ], [
        [ 1, '弓可以裝著麻痺瓶', null ]
    ] ],
    [ '跑者', 'active', [ false, true, true ], [
        [ 1, '持續耐力消耗量減少15%', null ],
        [ 2, '持續耐力消耗量減少30%', null ],
        [ 3, '持續耐力消耗量減少50%', null ]
    ] ],
    [ '集中', 'active', [ false, true, true ], [
        [ 1, '計量表上升率5%UP，蓄力時間縮短5%', null ],
        [ 2, '計量表上升率10%UP，蓄力時間縮短10%', null ],
        [ 3, '計量表上升率20%UP，蓄力時間縮短20%', null ]
    ] ],
    [ '植生學', 'active', [ false, true, true ], [
        [ 1, '草系消耗道具的取得數+1', null ],
        [ 2, '追加實、種系消耗道具的取得數+1', null ],
        [ 3, '追加蟲系消耗道具的取得數+1', null ],
        [ 4, '追加菇系消耗道具的取得數+1', null ]
    ] ],
    [ '鈍器能手', 'active', [ true, false, false ], [
        [ 1, '銳利度愈差攻擊力愈高。遠距離武器的近身攻擊威力與使敵人昏厥的容易度有大幅提升', null ]
    ] ],
    [ '最愛菇類', 'active', [ false, true, true ], [
        [ 1, '已可食用青菇與毒菇', null ],
        [ 2, '追加可食用爆炸菇與麻痺菇', null ],
        [ 3, '追加可食用風茄，鬼爆炸菇與心跳加速菇', null ]
    ] ],
    [ '裂傷耐性', 'active', [ false, true, true ], [
        [ 1, '將減輕裂傷狀態造成的傷害', null ],
        [ 2, '大幅減輕裂傷狀態造成的傷害', null ],
        [ 3, '不會變為裂傷狀態', null ]
    ] ],
    [ '無屬性強化', 'active', [ true, true, false ], [
        [ 1, '強化裝備中的無屬性武器', {
            noneElementAttackMutiple: { value: 1.1 }
        } ]
    ] ],
    [ '無傷', 'passive', [ false, true, true ], [
        [ 1, '技能發動時，基礎攻擊力+5', {
            attack: { value: 5 }
        } ],
        [ 2, '技能發動時，基礎攻擊力+10', {
            attack: { value: 10 }
        } ],
        [ 3, '技能發動時，基礎攻擊力+20', {
            attack: { value: 20 }
        } ]
    ] ],
    [ '散彈・剛射強化', 'active', [ false, true, true ], [
        [ 1, '散彈、剛射的威力UP', null ]
    ] ],
    [ '減輕膽怯', 'active', [ false, true, true ], [
        [ 1, '使後仰無效', null ],
        [ 2, '使後仰無效，將屁股著地減輕為後仰狀態', null ],
        [ 3, '使後仰、屁股著地無效', null ]
    ] ],
    [ '超會心', 'active', [ false, true, true ], [
        [ 1, '會心攻擊時的傷害倍率增強為1.3倍', {
            criticalMultiple: { value: 1.3 }
        } ],
        [ 2, '會心攻擊時的傷害倍率增強為1.35倍', {
            criticalMultiple: { value: 1.35 }
        } ],
        [ 3, '會心攻擊時的傷害倍率增強為1.4倍', {
            criticalMultiple: { value: 1.4 }
        } ]
    ] ],
    [ '超回復力', 'active', [ true, false, false ], [
        [ 1, '體力在達到計量表的最大值前會持續自動回復', null ]
    ] ],
    [ '雷屬性攻擊強化', 'active', [ false, true, true ], [
        [ 1, '雷屬性攻擊值+30', {
            elementAttack: { type: 'thunder', value: 30, multiple: 1 }
        } ],
        [ 2, '雷屬性攻擊值+60', {
            elementAttack: { type: 'thunder', value: 60, multiple: 1 }
        } ],
        [ 3, '雷屬性攻擊值+100', {
            elementAttack: { type: 'thunder', value: 100, multiple: 1 }
        } ],
        [ 4, '雷屬性攻擊值變為1.05倍，雷屬性攻擊值+100', {
            elementAttack: { type: 'thunder', value: 100, multiple: 1.05 }
        } ],
        [ 5, '雷屬性攻擊值變為1.1倍，雷屬性攻擊值+100', {
            elementAttack: { type: 'thunder', value: 100, multiple: 1.1 }
        } ]
    ] ],
    [ '道具使用強化', 'active', [ false, true, true ], [
        [ 1, '效果時間1.1倍', null ],
        [ 2, '效果時間1.25倍', null ],
        [ 3, '效果時間1.5倍', null ]
    ] ],
    [ '搬運達人', 'active', [ false, false, true ], [
        [ 1, '搬運時的移動速度上升，減輕著地時的反作用力', null ]
    ] ],
    [ '滑走強化', 'active', [ false, true, true ], [
        [ 1, '可發動技能', null ]
    ] ],
    [ '跳躍鐵人', 'active', [ false, false, true ], [
        [ 1, '跳躍中，後仰無效', null ]
    ] ],
    [ '達人藝', 'active', [ true, false, false ], [
        [ 1, '發生會心攻擊時，不會消耗銳利度', null ]
    ] ],
    [ '會心攻擊【屬性】', 'active', [ true, false, false ], [
        [ 1, '因攻擊而出現會心時，所造成的屬性傷害(火、水、雷、冰、龍)會提高', null ]
    ] ],
    [ '蜂蜜獵人', 'active', [ false, false, true ], [
        [ 1, '蜂蜜取得數+1', null ]
    ] ],
    [ '解放弓的蓄力階段', 'active', [ true, true, false ], [
        [ 1, '弓的蓄力階段增加1個階段', null ]
    ] ],
    [ '會心攻擊【特殊】', 'active', [ true, false, false ], [
        [ 1, '因攻擊而出現會心時，所造成的狀態異常值(麻痺、毒、睡眠、爆破)會提高', null ]
    ] ],
    [ '雷耐性', 'active', [ false, true, true ], [
        [ 1, '雷耐性+6', {
            resistance: { type: 'thunder', value: 6 }
        } ],
        [ 2, '雷耐性+12', {
            resistance: { type: 'thunder', value: 12 }
        } ],
        [ 3, '雷耐性+20、防禦力+10', {
            defense: { value: 10 },
            resistance: { type: 'thunder', value: 20 }
        } ]
    ] ],
    [ '睡眠屬性強化', 'active', [ false, true, true ], [
        [ 1, '睡眠累積值變為1.05倍，睡眠累積值+10', null ],
        [ 2, '睡眠累積值變為1.1倍，睡眠累積值+10', null ],
        [ 3, '睡眠累積值變為1.2倍，睡眠累積值+10', null ]
    ] ],
    [ '睡眠耐性', 'active', [ false, true, true ], [
        [ 1, '減少睡眠狀態的時間30%', null ],
        [ 2, '減少睡眠狀態的時間60%', null ],
        [ 3, '不會變為睡眠狀態', null ]
    ] ],
    [ '察覺', 'active', [ false, false, true ], [
        [ 1, '在生態MAP上標記', null ]
    ] ],
    [ '滿足感', 'active', [ false, true, true ], [
        [ 1, '效果發動率25%', null ]
    ] ],
    [ '奪取耐力', 'active', [ false, true, true ], [
        [ 1, '減氣威力1.1倍', null ],
        [ 2, '減氣威力1.2倍', null ],
        [ 3, '減氣威力1.3倍', null ]
    ] ],
    [ '精靈加護', 'active', [ false, true, true ], [
        [ 1, '效果發動時，傷害減輕15%', null ],
        [ 2, '效果發動時，傷害減輕30%', null ],
        [ 3, '效果發動時，傷害減輕50%', null ]
    ] ],
    [ '綿花孢子草的知識', 'active', [ false, true, true ], [
        [ 1, '體力回復20', null ],
        [ 2, '體力回復35', null ],
        [ 3, '體力回復60', null ]
    ] ],
    [ '精神抖擻', 'passive', [ false, true, true ], [
        [ 1, '效果發動時，會心率+10%', {
            criticalRate: { value: 10 }
        } ],
        [ 2, '效果發動時，會心率+20%', {
            criticalRate: { value: 20 }
        } ],
        [ 3, '效果發動時，會心率+30%', {
            criticalRate: { value: 30 }
        } ]
    ] ],
    [ '睡眠瓶追加', 'active', [ false, true, false ], [
        [ 1, '弓可以裝著睡眠瓶', null ]
    ] ],
    [ '廣域化', 'active', [ false, true, true ], [
        [ 1, '給予周圍的同伴1\/3的效果', null ],
        [ 2, '給予大範圍的同伴1\/3的效果', null ],
        [ 3, '給予大範圍的同伴2\/3的效果', null ],
        [ 4, '給予極大範圍的同伴2\/3的效果', null ],
        [ 5, '給予極大範圍的同伴同樣的效果', null ]
    ] ],
    [ '適應瘴氣環境', 'active', [ false, false, true ], [
        [ 1, '使瘴氣霧霾無效，減輕酸造成的傷害', null ]
    ] ],
    [ '潛伏', 'active', [ false, true, true ], [
        [ 1, '追丟的機率小幅提高', null ],
        [ 2, '追丟的機率提高', null ],
        [ 3, '追丟的機率大幅提高', null ]
    ] ],
    [ '熱傷害無效', 'active', [ false, false, true ], [
        [ 1, '使熱造成的傷害無效', null ]
    ] ],
    [ '適應水場', 'active', [ false, true, true ], [
        [ 1, '即使在水中移動速度也不會減慢', null ],
        [ 2, '在水中移動速度也不會減慢，提高在水中的迴避性能', null ],
        [ 3, '在水中移動速度也不會減慢，大幅提高在水中的迴避性能', null ]
    ] ],
    [ '毅力', 'active', [ true, false, false ], [
        [ 1, '當體力在一定程度以上時，即使承受了超過體力的傷害，也能撐住而不耗盡體力一次', null ]
    ] ],
    [ '龍耐性', 'active', [ false, true, true ], [
        [ 1, '龍耐性+6', {
            resistance: { type: 'dragon', value: 6 }
        } ],
        [ 2, '龍耐性+12', {
            resistance: { type: 'dragon', value: 12 }
        } ],
        [ 3, '龍耐性+20、防禦力+10', {
            defense: { value: 10 },
            resistance: { type: 'dragon', value: 20 }
        } ]
    ] ],
    [ '龍屬性攻擊強化', 'active', [ false, true, true ], [
        [ 1, '龍屬性攻擊值+30', {
            elementAttack: { type: 'dragon', value: 30, multiple: 1 }
        } ],
        [ 2, '龍屬性攻擊值+60', {
            elementAttack: { type: 'dragon', value: 60, multiple: 1 }
        } ],
        [ 3, '龍屬性攻擊值+100', {
            elementAttack: { type: 'dragon', value: 100, multiple: 1 }
        } ],
        [ 4, '龍屬性攻擊值變為1.05倍，龍屬性攻擊值+100', {
            elementAttack: { type: 'dragon', value: 100, multiple: 1.05 }
        } ],
        [ 5, '龍屬性攻擊值變為1.1倍，龍屬性攻擊值+100', {
            elementAttack: { type: 'dragon', value: 100, multiple: 1.1 }
        } ]
    ] ],
    [ '導蟲反應距離UP', 'active', [ false, false, true ], [
        [ 1, '反應距離擴張', null ]
    ] ],
    [ '整備', 'active', [ false, true, true ], [
        [ 1, '再使用時間縮短5%', null ],
        [ 2, '再使用時間縮短10%', null ],
        [ 3, '再使用時間縮短20%', null ]
    ] ],
    [ '瘴氣耐性', 'active', [ false, true, true ], [
        [ 1, '抑制瘴氣的侵蝕', null ],
        [ 2, '大幅抑制瘴氣的侵蝕', null ],
        [ 3, '使瘴氣侵蝕狀態無效', null ]
    ] ],
    [ '龍封力強化', 'active', [ false, true, true ], [
        [ 1, '龍封力強化一個階段', null ]
    ] ],
    [ '騎乘名人', 'active', [ false, false, true ], [
        [ 1, '容易騎乘怪物，更容易在騎乘狀態下成功', null ]
    ] ],
    [ '攀岩者', 'active', [ false, false, true ], [
        [ 1, '耐力消耗減少25%', null ]
    ] ],
    [ '爆破屬性強化', 'active', [ false, true, true ], [
        [ 1, '爆破累積值變為1.05倍，爆破累積值+10', null ],
        [ 2, '爆破累積值變為1.1倍，爆破累積值+10', null ],
        [ 3, '爆破累積值變為1.2倍，爆破累積值+10', null ]
    ] ],
    [ '蹲下移動速度UP', 'active', [ false, false, true ], [
        [ 1, '加快蹲下時的移動速度', null ]
    ] ],
    [ '爆破異常狀態的耐性', 'active', [ false, true, true ], [
        [ 1, '延長爆破前的間隔時間，減輕爆破時受到的傷害', null ],
        [ 2, '更加延長爆破前的間隔時間，大幅減輕爆破時遭受的傷害', null ],
        [ 3, '不會變為爆破異常狀態', null ]
    ] ],
    [ '爆破瓶追加', 'active', [ false, true, false ], [
        [ 1, '弓可以裝著爆破瓶', null ]
    ] ],
    [ '屬性解放／裝填擴充', 'active', [ false, true, true ], [
        [ 1, '激發出1\/3的隱藏屬性／增加部分彈藥裝填數', {
            enableElement: { multiple: 0.3333 }
        } ],
        [ 2, '激發出2\/3的隱藏屬性／增加多數彈藥裝填數', {
            enableElement: { multiple: 0.6666 }
        } ],
        [ 3, '激發出100%的隱藏屬性／幾乎增加所有彈藥裝填數', {
            enableElement: { multiple: 1 }
        } ]
    ] ],
    [ '屬性異常狀態耐性', 'active', [ false, true, true ], [
        [ 1, '全屬性異常狀態的效果時間減少30%', null ],
        [ 2, '全屬性異常狀態的效果時間減少60%', null ],
        [ 3, '使全屬性異常狀態無效', null ]
    ] ]
];
