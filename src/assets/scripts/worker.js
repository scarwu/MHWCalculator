/**
 * Bootstrap
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

const onSearch = (data) => {
    let startTime = new Date().getTime();
    let computedBundles = FittingAlgorithm.search(
        data.requiredSets,
        data.requiredSkills,
        data.requiredEquips,
        data.algorithmParams
    );
    let stopTime = new Date().getTime();
    let searchTime = (stopTime - startTime) / 1000;
    let weaponEnhanceIds = Helper.isNotEmpty(data.requiredEquips.weapon)
        ? data.requiredEquips.weapon.enhanceIds : null;

    computedBundles.map((bundle) => {
        bundle.meta.weaponEnhanceIds = weaponEnhanceIds;

        return bundle;
    });

    Helper.log('Bundle List:', computedBundles);
    Helper.log('Search Time:', searchTime);

    postMessage({
        action: 'result',
        payload: {
            computedBundles: computedBundles
        }
    });
};

onmessage = (e) => {
    switch (e.data.action) {
    case 'search':
        onSearch(e.data.payload);
    default:
        break;
    }
};
