/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */


import * as angular from 'angular';
import {AppComponent} from './app.component';

export const appModule = angular.module('app', []);

appModule.component(AppComponent.name, AppComponent);
