/**
 * Worker
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import * as Sentry from '@sentry/browser'

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import FittingAlgorithm from 'libraries/fittingAlgorithm';

// Load Config
import Config from 'config';

// Set Sentry Endpoint
if ('production' === Config.env) {
    Sentry.configureScope((scope) => {
        scope.setLevel('error');
    });
    Sentry.init({
        dsn: 'https://000580e8cc8a4f3bbf668d4acfc90da2@sentry.io/1400031',
        release: Config.buildTime
    });
}

onmessage = (event) => {
    const requiredSets = event.data.requiredSets;
    const requiredSkills = event.data.requiredSkills;
    const requiredEquips = event.data.requiredEquips;
    const algorithmParams = event.data.algorithmParams;

    let startTime = new Date().getTime();
    let list = FittingAlgorithm.search(
        requiredSets,
        requiredSkills,
        requiredEquips,
        algorithmParams,
        (payload) => {
            postMessage({
                action: 'progress',
                payload: payload
            });
        }
    );
    let stopTime = new Date().getTime();
    let searchTime = (stopTime - startTime) / 1000;

    list.map((bundle) => {
        return bundle;
    });

    Helper.debug('Bundle List:', list);
    Helper.debug('Search Time:', searchTime);

    let meta = {};

    if (Helper.isNotEmpty(requiredEquips.weapon)) {
        meta.weaponEnhances = requiredEquips.weapon.enhances;

        if ('customWeapon' === requiredEquips.weapon.id) {
            meta.customWeapon = requiredEquips.weapon.customWeapon;
        }
    }

    postMessage({
        action: 'result',
        payload: {
            computedResult: {
                list: list,
                meta: meta
            }
        }
    });
};
