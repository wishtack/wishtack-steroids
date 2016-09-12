/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {UserFormComponent} from './user-form/user-form.component';
import {UserListComponent} from './user-list.component';
import {UserPreviewComponent} from './user-preview/user-preview.component';
import {userModule} from '../common/user/user.module';

export const userListModule = angular.module('app.userList', [
    userModule.name
]);

userListModule.component('wtUserForm', UserFormComponent.config);
userListModule.component('wtUserList', UserListComponent.config);
userListModule.component('wtUserPreview', UserPreviewComponent.config);
