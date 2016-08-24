
import 'core-js/es6';
import 'core-js/es7/reflect';

import './legacy-app';

import * as angular from 'angular';
import * as app from './app/app.module';

angular.element(document).ready(function() {
    angular.bootstrap(document, [app.name]);
});
