'use strict';
/**
 * Change Log
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React from 'react';

// Load Core Libraries
import Status from 'core/status';

// Load Custom Libraries
import _ from 'libraries/lang';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

export default function (props) {

    /**
     * Handle Functions
     */
    let handleWindowClose = () => {
        props.onClose();
    };

    /**
     * Render Functions
     */
    let renderChangelog = () => {
        let LogMap = {
            zhTW: (
                <div>
                    <span>2019/03/24</span>
                    <ul>
                        <li>調整裝備選擇器界面</li>
                        <li>修正部份數值錯誤</li>
                    </ul>

                    <span>2019/03/01</span>
                    <ul>
                        <li>新增狩魔獵人武器</li>
                        <li>新增團旗長槍武器</li>
                        <li>新增盛裝α套裝</li>
                        <li>修正演算法錯誤</li>
                    </ul>

                    <span>2019/02/24</span>
                    <ul>
                        <li>修正大部分造成白畫面的錯誤</li>
                    </ul>

                    <span>2019/02/21</span>
                    <ul>
                        <li>多國語系界面</li>
                        <li>修正功能及文字錯誤</li>
                    </ul>

                    <span>2019/02/12</span>
                    <ul>
                        <li>新增絢輝龍鎧羅γ套裝</li>
                        <li>新增冥燈幽火γ套裝</li>
                        <li>新增鑄島熔岩γ套裝</li>
                    </ul>

                    <span>2018/09/04</span>
                    <ul>
                        <li>新增帝王γ套裝</li>
                        <li>新增鋼龍γ套裝</li>
                    </ul>

                    <span>2018/08/25</span>
                    <ul>
                        <li>新增潛水夫及獨角仙后裝備</li>
                        <li>新增貝希摩斯裝備及武器</li>
                    </ul>

                    <span>2018/06/26</span>
                    <ul>
                        <li>新增麒麟γ套裝</li>
                        <li>新增烏德爾γ套裝</li>
                        <li>補完炎妃龍武器斬位</li>
                    </ul>

                    <span>2018/06/02</span>
                    <ul>
                        <li>新增炎妃龍裝備</li>
                        <li>可以在裝備選擇界面排除裝備，排除的裝備將不會加入演算法計算</li>
                    </ul>

                    <span>2018/05/09</span>
                    <ul>
                        <li>新增絢輝龍 R7/R8 武器</li>
                        <li>更新武器選擇界面</li>
                        <li>已選裝備新增列表功能，可 儲存/讀取 裝備組</li>
                        <li>優化搜尋演算法</li>
                    </ul>

                    <span>2018/05/04</span>
                    <ul>
                        <li>修正杜賓α插槽遺漏問題</li>
                        <li>新增蒼星之將套裝及武器</li>
                        <li>備選套裝可調整顯示筆數</li>
                        <li>技能界面將不再出現只有套裝效果能達成的技能</li>
                    </ul>
                </div>
            ),
            jaJP: (
                <div>
                    <span></span>
                </div>
            ),
            enUS: (
                <div>
                    <span></span>
                </div>
            )
        };

        return LogMap[Status.get('lang')];
    };

    return (
        <div className="mhwc-selector">
            <div className="mhwc-dialog mhwc-slim-dialog">
                <div className="mhwc-panel">
                    <strong>{_('changelog')}</strong>

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list">
                    {renderChangelog()}
                </div>
            </div>
        </div>
    );
};
