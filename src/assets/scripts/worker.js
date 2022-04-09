/**
 * Worker
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import * as Sentry from '@sentry/browser'

// Load Config
import Config from 'config'

// Load Core
import Helper from 'core/helper'

// Load Libraries
import FittingAlgorithm from 'libraries/fittingAlgorithm'

// Set Sentry Endpoint
if ('production' === Config.env) {
    Sentry.configureScope((scope) => {
        scope.setLevel('error')
    })
    Sentry.init({
        dsn: Config.sentryDsn,
        release: Config.buildTime
    })
}

onmessage = (event) => {
    const requiredEquips = event.data.requiredEquips
    const requiredSets = event.data.requiredSets
    const requiredSkills = event.data.requiredSkills
    const algorithmParams = event.data.algorithmParams

    let startTime = new Date().getTime()
    let list = FittingAlgorithm.search(
        requiredEquips,
        requiredSets,
        requiredSkills,
        algorithmParams,
        (payload) => {
            postMessage({
                action: 'progress',
                payload: payload
            })
        }
    )
    let stopTime = new Date().getTime()
    let searchTime = (stopTime - startTime) / 1000

    list.map((bundle) => {
        return bundle
    })

    Helper.log('Worker: Bundle List:', list)
    Helper.log('Worker: Search Time:', searchTime)

    postMessage({
        action: 'result',
        payload: {
            computedResult: {
                list: list,
                required: {
                    equips: requiredEquips,
                    sets: requiredSets,
                    skills: requiredSkills
                }
            }
        }
    })
}
