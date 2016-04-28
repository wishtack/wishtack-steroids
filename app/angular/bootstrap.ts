
import 'es7-reflect-metadata/src/global/browser';
import 'zone.js/dist/zone-microtask';
import 'angular2/bundles/angular2-polyfills';
import 'angular-material';

import {upgradeAdapter} from './upgrade-adapter';

/* Bootstrapping AngularJS. */
import {LzApp} from './lazonme/app.component';

const lazonme = require('./lazonme/ng-module-lazonme');
lazonme.directive('lzApp', upgradeAdapter.downgradeNg2Component(LzApp));

upgradeAdapter.bootstrap(document.body, ['lazonme']);

/*
 * @todo: Call `bootstrap(LzApp)` once we get rid of AngularJS 1.
 */
