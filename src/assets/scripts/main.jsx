'use strict';
/**
 * Application Bootstrap
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

// Load Core Libraries
import Status from 'core/status';
import Event from 'core/event';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Load Apps
import MainPage from 'app/main';

// Router
ReactDOM.render((
    <Router>
        <div>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/:base64" component={MainPage} />
        </div>
    </Router>
), document.getElementById('mhwc-router'));
