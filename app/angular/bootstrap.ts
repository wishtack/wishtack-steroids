
import 'es7-reflect-metadata/src/global/browser';
import 'zone.js/dist/zone-microtask';
import 'angular2/bundles/angular2-polyfills';

import {bootstrap}    from 'angular2/platform/browser';
import {upgradeAdapter} from './upgrade-adapter';

/* Bootstrapping AngularJS. */
const lazonme = require('./lazonme/ng-module-lazonme');

import {LzApp} from './lazonme/app.component';

lazonme.directive('lzApp', upgradeAdapter.downgradeNg2Component(LzApp));

upgradeAdapter.bootstrap(document.body, ['lazonme']);

/*
 * @todo: Call `bootstrap(LzApp)` once we get rid of AngularJS 1.
 */
