/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {User} from '../../common/user/user';

export class UserFormComponent {

    static config = {
        bindings: <any>{
            onUserAdd: '&wtOnUserAdd'
        },
        controller: UserFormComponent,
        templateUrl: require('./user-form.component.html')
    };

    user: User;

    constructor() {
        this._resetUser();
    }

    addUser({user}: {user: User}) {
        (<any>this).onUserAdd({user: user});
        this._resetUser();
    }

    private _resetUser() {
        this.user = new User({});
    }

}
