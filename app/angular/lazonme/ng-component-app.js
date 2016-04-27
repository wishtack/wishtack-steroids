/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {UpgradeAdapter} from 'angular2/upgrade';

var adapter = new UpgradeAdapter();
var lazonme = require('./ng-module-lazonme');

import {LzApp} from './app.component';

lazonme.directive('lzApp', adapter.downgradeNg2Component(LzApp));
