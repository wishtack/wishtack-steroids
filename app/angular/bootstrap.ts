
import 'es7-reflect-metadata/src/global/browser';
import 'zone.js/dist/zone-microtask';
import 'angular2/bundles/angular2-polyfills';

import {bootstrap}    from 'angular2/platform/browser';
import {UpgradeAdapter} from 'angular2/upgrade';

const adapter = new UpgradeAdapter();

/* Bootstrapping AngularJS. */
const lazonme = require('./lazonme/ng-module-lazonme');

import {LzApp} from './lazonme/app.component';

lazonme.directive('lzApp', adapter.downgradeNg2Component(LzApp));

adapter.bootstrap(document.body, ['lazonme']);

/*
 * @todo: Call `bootstrap(LzApp)` once we get rid of AngularJS 1.
 */

