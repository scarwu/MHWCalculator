/**
 * Main Module
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useParams as useRouteParams } from 'react-router-dom'

// Load Core Libraries
import _ from 'core/lang'
import Status from 'core/status'
import Helper from 'core/helper'

// Load Components
import IconButton from 'components/common/iconButton'
import IconSelector from 'components/common/iconSelector'

import ConditionOptionsBlock from 'components/block/conditionOptions'
import CandidateBundlesBlock from 'components/block/candidateBundles'
import EquipsDisplayerBlock from 'components/block/equipsDisplayer'
import CharacterStatusBlock from 'components/block/characterStatus'

import ChangelogModal from 'components/modal/changelog'
import AlgorithmSettingModal from 'components/modal/algorithmSetting'
import ConditionItemSelectorModal from 'components/modal/conditionItemSelector'
import EquipItemSelectorModal from 'components/modal/equipItemSelector'
import BundleItemSelectorModal from 'components/modal/bundleItemSelector'

// Load State Control
import CommonState from 'states/common'
import ModalState from 'states/modal'

// Load Config & Constant
import Config from 'config'
import Constant from 'constant'

if ('production' === Config.env) {
    if (Config.buildTime !== Status.get('sys:buildTime')) {
        ModalState.setter.showChangelog()
    }

    Status.set('sys:buildTime', Config.buildTime)
}

/**
 * Variables
 */
const langList = Object.keys(Constant.langs).map((lang) => {
    return { key: lang, value: Constant.langs[lang] }
})

/**
 * Handle Functions
 */
const handleBundleExport = () => {
    let equips = Helper.deepCopy(CommonState.getter.getCurrentEquips())
    let hash = Helper.base64Encode(JSON.stringify(equips))

    let protocol = window.location.protocol
    let hostname = window.location.hostname
    let pathname = window.location.pathname

    window.open(`${protocol}//${hostname}${pathname}#/${hash}`, '_blank')
}

const handleOpenReadme = () => {
    window.open('https://scar.tw/article/2018/05/02/mhw-calculator-readme/','_blank')
}

export default function App(props) {

    /**
     * Hooks
     */
    const [stateLang, setLang] = useState(Status.get('sys:lang'))

    let routeParams = useRouteParams()

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {

        // Restore Equips from Url to State
        if (Helper.isNotEmpty(routeParams['*']) && '' !== routeParams['*']) {
            CommonState.setter.replaceCurrentEquips(
                JSON.parse(Helper.base64Decode(routeParams['*']))
            )
        }
    }, [])

    /**
     * Handle Functions
     */
    const handleLangChange = useCallback((event) => {
        Status.set('sys:lang', event.target.value)
        setLang(event.target.value)
    }, [])

    /**
     * Render Functions
     */
    return (
        <div key={stateLang} id="mhwc-app" className="container-fluid">
            <div className="mhwc-header">
                <a className="mhwc-title" href="./">
                    <h1>{_('title')}</h1>
                </a>

                <div className="mhwc-icons_bundle">
                    <IconButton
                        iconName="link" altName={_('exportBundle')}
                        onClick={handleBundleExport} />
                    <IconButton
                        iconName="info" altName={_('changelog')}
                        onClick={ModalState.setter.showChangelog} />
                    <IconButton
                        iconName="question" altName={_('readme')}
                        onClick={handleOpenReadme} />
                    <IconSelector
                        iconName="globe"
                        defaultValue={stateLang} options={langList}
                        onChange={handleLangChange} />
                </div>
            </div>

            <div className="row mhwc-container">
                <ConditionOptionsBlock />
                <CandidateBundlesBlock />
                <EquipsDisplayerBlock />
                <CharacterStatusBlock />
            </div>

            <div className="row mhwc-footer">
                <div className="col-12">
                    <span>Copyright (c) Scar Wu</span>
                </div>

                <div className="col-12">
                    <a href="//scar.tw" target="_blank">
                        <span>Blog</span>
                    </a>
                    &nbsp|&nbsp
                    <a href="https://github.com/scarwu/MHWCalculator" target="_blank">
                        <span>Github</span>
                    </a>
                </div>
            </div>

            <ChangelogModal />
            <AlgorithmSettingModal />
            <ConditionItemSelectorModal />
            <EquipItemSelectorModal />
            <BundleItemSelectorModal />
        </div>
    )
}
