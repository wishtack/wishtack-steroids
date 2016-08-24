/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */


import * as angular from 'angular';
<<<<<<< ebb98802b9050d72639a308d573dc45ae8658c65
import {UserStore} from './common/user/user-store';
import {userListModule} from './user-list/user-list.module';

export const appModule = angular.module('app', [
    userListModule.name
]);
=======
import {AppComponent} from './app.component';

export const name = 'app';
export const app = angular.module(name, []);

app.component(AppComponent.name, AppComponent);
>>>>>>> Removed angular 2 code.
