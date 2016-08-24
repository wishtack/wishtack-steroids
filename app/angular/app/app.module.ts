/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */


import * as angular from 'angular';
import {UserStore} from './common/user/user-store';
import {userListModule} from './user-list/user-list.module';

export const appModule = angular.module('app', [
    userListModule.name
]);
