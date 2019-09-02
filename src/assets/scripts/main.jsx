'use strict';
/**
 * Bootstrap
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import * as Sentry from '@sentry/browser'

// Load Config & Constant
import Config from 'config';

// Load App
import App from 'app';

// Load Components
import Changelog from 'components/modal/changelog';
import InventorySetting from 'components/modal/inventorySetting';

// Polyfill
const polyfillObjectValues = (object) => {
    return Object.keys(object).map((key) => {
        return object[key];
    });
};

Object.values = Object.values || polyfillObjectValues;

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

// Router
ReactDOM.render((
    <Router key="router">
        <Route exact path="/:hash?" component={App} />

        <Changelog />
        <InventorySetting />
    </Router>
), document.querySelector('#mhwc'));
