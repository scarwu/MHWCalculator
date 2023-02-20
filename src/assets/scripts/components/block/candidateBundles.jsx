/**
 * Candidate Bundles
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { Fragment, useState, useEffect, useCallback } from 'react'

// Load Config & Constant
import Config from 'config'
import Constant from 'constant'

// Load Core
import _ from 'core/lang'
import Helper from 'core/helper'
import Event from 'core/event'

// Load Components
import QuickSetting from 'components/sub/candidateBundles/quickSetting'
import RequiredConditions from 'components/sub/candidateBundles/requiredConditions'
import BundleList from 'components/sub/candidateBundles/bundleList'
import IconButton from 'components/common/iconButton'
import IconTab from 'components/common/iconTab'

// Load State Control
import CommonState from 'states/common'
import ModalState from 'states/modal'

// Variables
let workers = {}

/**
 * Handle Functions
 */
const handleShowAllAlgorithmSetting = () => {
    ModalState.setter.showAlgorithmSetting({
        mode: 'all'
    })
}

const handleSwitchTempData = (index) => {
    CommonState.setter.switchTempData('candidateBundles', index)
}

const convertTimeFormat = (seconds) => {
    let text = ''

    if (seconds > 3600) {
        let hours = parseInt(seconds / 3600)

        seconds -= hours * 3600
        text += hours + ' ' + _('hour') + ' '
    }

    if (seconds > 60) {
        let minutes = parseInt(seconds / 60)

        seconds -= minutes * 60
        text += minutes + ' ' + _('minute') + ' '
    }

    text += seconds + ' ' + _('second')

    return text
}

export default function CandidateBundles(props) {

    /**
     * Hooks
     */
    const [stateTempData, updateTempData] = useState(CommonState.getter.getTempData())
    const [stateComputedResult, updateComputedResult] = useState(CommonState.getter.getComputedResult())
    const [stateTasks, updateTasks] = useState({})

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateTempData(CommonState.getter.getTempData())
            updateComputedResult(CommonState.getter.getComputedResult())
        })

        return () => {
            unsubscribe()
        }
    }, [])

    // Worker Callback
    useEffect(() => {
        Event.on('workerCallback', 'tasks', (data) => {
            let tabIndex = data.tabIndex
            let action = data.action
            let payload = data.payload

            switch (action) {
            case 'progress':
                if (Helper.isNotEmpty(payload.bundleCount)) {
                    stateTasks[tabIndex].bundleCount = payload.bundleCount
                }

                if (Helper.isNotEmpty(payload.searchPercent)) {
                    stateTasks[tabIndex].searchPercent = payload.searchPercent
                }

                if (Helper.isNotEmpty(payload.timeRemaining)) {
                    stateTasks[tabIndex].timeRemaining = payload.timeRemaining
                }

                updateTasks(Helper.deepCopy(stateTasks))

                break
            case 'result':
                handleSwitchTempData(tabIndex)

                CommonState.setter.saveComputedResult(payload.computedResult)

                // workers[tabIndex].terminate()
                // workers[tabIndex] = null

                stateTasks[tabIndex] = null

                updateTasks(Helper.deepCopy(stateTasks))

                break
            default:
                break
            }
        })

        return () => {
            Event.off('workerCallback', 'tasks')
        }
    }, [stateTasks])

    // Search Remaining Timer
    useEffect(() => {
        let tabIndex = stateTempData.candidateBundles.index

        if (Helper.isEmpty(stateTasks[tabIndex])) {
            return
        }

        let timerId = setInterval(() => {
            if (0 === stateTasks[tabIndex].timeRemaining) {
                return
            }

            stateTasks[tabIndex].timeRemaining--

            updateTasks(Helper.deepCopy(stateTasks))
        }, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [stateTasks, stateTempData])

    /**
     * Handle Functions
     */
    const handleCandidateBundlesSearch = useCallback(() => {
        let tabIndex = stateTempData.candidateBundles.index

        if (Helper.isNotEmpty(stateTasks[tabIndex])) {
            return
        }

        // Get All Data From Store
        let customWeapon = CommonState.getter.getCustomWeapon()
        let requiredEquips = CommonState.getter.getRequiredEquips()
        let requiredSets = CommonState.getter.getRequiredSets()
        let requiredSkills = CommonState.getter.getRequiredSkills()
        let algorithmParams = CommonState.getter.getAlgorithmParams()

        if (0 === requiredSets.length && 0 === requiredSkills.length) {
            return
        }

        stateTasks[tabIndex] = {
            bundleCount: 0,
            searchPercent: 0,
            timeRemaining: 0,
            required: {
                equips: requiredEquips,
                sets: requiredSets,
                skills: requiredSkills
            }
        }

        updateTasks(Helper.deepCopy(stateTasks))

        if (Helper.isEmpty(workers[tabIndex])) {
            workers[tabIndex] = new Worker('assets/scripts/worker.min.js?' + Config.buildTime + '&' + tabIndex)
            workers[tabIndex].onmessage = (event) => {
                Event.trigger('workerCallback', {
                    tabIndex: tabIndex,
                    action: event.data.action,
                    payload: event.data.payload
                })
            }
        }

        workers[tabIndex].postMessage({
            customWeapon: customWeapon,
            requiredSets: requiredSets,
            requiredSkills: requiredSkills,
            requiredEquips: requiredEquips,
            algorithmParams: algorithmParams
        })
    }, [stateTasks, stateTempData])

    const handleCandidateBundlesCancel = useCallback(() => {
        let tabIndex = stateTempData.candidateBundles.index

        workers[tabIndex].terminate()
        workers[tabIndex] = null

        stateTasks[tabIndex] = null

        updateTasks(Helper.deepCopy(stateTasks))
    }, [stateTasks, stateTempData])

    let tabIndex = stateTempData.candidateBundles.index

    return (
        <div className="col mhwc-bundles">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('candidateBundle')}</span>

                <div className="mhwc-icons_bundle-left">
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[0]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 1'}
                        isActive={0 === tabIndex}
                        onClick={() => {handleSwitchTempData(0)}} />
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[1]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 2'}
                        isActive={1 === tabIndex}
                        onClick={() => {handleSwitchTempData(1)}} />
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[2]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 3'}
                        isActive={2 === tabIndex}
                        onClick={() => {handleSwitchTempData(2)}} />
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[3]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 4'}
                        isActive={3 === tabIndex}
                        onClick={() => {handleSwitchTempData(3)}} />
                </div>

                <div className="mhwc-icons_bundle-right">
                    <IconButton
                        iconName="refresh" altName={_('reset')}
                        onClick={CommonState.setter.cleanComputedResult} />
                    <IconButton
                        iconName="cog" altName={_('setting')}
                        onClick={handleShowAllAlgorithmSetting} />
                    <IconButton
                        iconName="search" altName={_('search')}
                        onClick={handleCandidateBundlesSearch} />
                </div>
            </div>

            <div key="list" className="mhwc-list">
                {Helper.isNotEmpty(stateTasks[tabIndex]) ? (
                    <Fragment>
                        <div className="mhwc-item mhwc-item-3-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('searching')} ...</span>
                                <div className="mhwc-icons_bundle">
                                    <IconButton
                                        iconName="times" altName={_('cancel')}
                                        onClick={handleCandidateBundlesCancel} />
                                </div>
                            </div>
                            <div className="col-12 mhwc-content">
                                <div className="col-3 mhwc-name">
                                    <span>{_('bundleCount')}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <span>{stateTasks[tabIndex].bundleCount}</span>
                                </div>
                                <div className="col-3 mhwc-name">
                                    <span>{_('searchPercent')}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <span>{stateTasks[tabIndex].searchPercent} %</span>
                                </div>
                                <div className="col-3 mhwc-name">
                                    <span>{_('timeRemaining')}</span>
                                </div>
                                <div className="col-9 mhwc-value">
                                    <span>{convertTimeFormat(stateTasks[tabIndex].timeRemaining)}</span>
                                </div>
                            </div>
                        </div>
                        <RequiredConditions data={stateTasks[tabIndex].required} />
                    </Fragment>
                ) : (
                    Helper.isEmpty(stateComputedResult) ? (
                        <QuickSetting />
                    ) : (
                        <Fragment>
                            <RequiredConditions data={stateComputedResult.required} />
                            <BundleList />
                        </Fragment>
                    )
                )}
            </div>
        </div>
    )
}
