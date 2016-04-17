
require('es7-reflect-metadata/src/global/browser');
require('./ng-module-app');
require('./ng-run-app');

import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';

bootstrap(AppComponent);
