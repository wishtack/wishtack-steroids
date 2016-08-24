/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */


interface UserSchema {
    firstName?: string;
    lastName?: string;
}

export class User implements UserSchema {

    firstName: string;
    lastName: string;

    constructor(args: UserSchema) {
        this.firstName = args.firstName;
        this.lastName = args.lastName;
    }

    isEqual({user}: {user: User}) {
        return this === user;
    }

}
