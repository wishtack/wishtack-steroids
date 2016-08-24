/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */


import * as angular from 'angular';
import {AppComponent} from './app.component';

export const name = 'app';
export const app = angular.module(name, []);

app.component(AppComponent.name, AppComponent);
