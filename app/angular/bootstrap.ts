
import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';

import {upgradeAdapter} from './upgrade-adapter';

/* Bootstrapping AngularJS. */
import {LzApp} from './app/app.component';

const lazonme = require('./app/ng-module-app');
lazonme.directive('lzApp', upgradeAdapter.downgradeNg2Component(LzApp));

upgradeAdapter.bootstrap(document.body, ['app']);

/*
 * @todo: Call `bootstrap(LzApp)` once we get rid of AngularJS 1.
 */

