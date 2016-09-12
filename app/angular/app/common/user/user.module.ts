/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {UserStore} from './user-store';

export const userModule = angular.module('app.common.user', []);

userModule.service('userStore', UserStore);