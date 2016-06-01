/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {UpgradeAdapter} from '@angular/upgrade';

var adapter = new UpgradeAdapter();
var app = require('./ng-module-app');

import {LzApp} from './app.component';

app.directive('lzApp', adapter.downgradeNg2Component(LzApp));
