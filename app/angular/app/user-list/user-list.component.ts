/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {User} from '../common/user/user';

export class UserListComponent {

    static config = {
        controller: UserListComponent,
        templateUrl: require('./user-list.component.html')
    };

    userList: User[];

    constructor(private userStore) {
        'ngInject';

        this._updateUserList();

    }

    addUser(user: User) {

        this.userStore.addUser(user);

        this._updateUserList();

    }

    removeUser(user: User) {

        this.userStore.removeUser(user);

        this._updateUserList();

    }

    private _updateUserList() {
        this.userStore.userList()
            .then(userList => this.userList = userList);
    }

}
