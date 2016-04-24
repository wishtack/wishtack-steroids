
import 'es7-reflect-metadata/src/global/browser';
import 'zone.js/dist/zone-microtask';
import 'angular2/bundles/angular2-polyfills';

import {bootstrap}    from 'angular2/platform/browser';
import {LzApp} from './lazonme/app.component.ts';

bootstrap(LzApp);
