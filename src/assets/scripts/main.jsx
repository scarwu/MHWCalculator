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

// Load App
import App from 'app';

// Router
ReactDOM.render((
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route exact path="/:hash" component={App} />
        </div>
    </Router>
), document.getElementById('mhwc-router'));
