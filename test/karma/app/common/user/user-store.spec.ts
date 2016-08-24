/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import {UserStore} from '../../../../../app/angular/app/common/user/user-store';
import {User} from '../../../../../app/angular/app/common/user/user';
import {appModule} from '../../../../../app/angular/app/app.module';

describe('UserStore', () => {

    beforeEach(angular.mock.module(appModule.name));

    beforeEach(angular.mock.module((userStoreProvider) => {}));

    beforeEach(inject(($httpBackend,
                       $rootScope,
                       userStore) => {
        this.$httpBackend = $httpBackend;
        this.$rootScope = $rootScope;
        this.userStore= userStore;
    }));

    xit('should load user list', () => {

        let userList;
        let userStore = this.userStore;

        let user1 = new User({firstName: 'Foo', lastName: 'BAR'});
        let user2 = new User({firstName: 'John', lastName: 'BAR'});
        let user3 = new User({firstName: 'Foo', lastName: 'BAR'});

        this.$httpBackend.expectGET('/api/v1/users/').respond({
            meta: {
                count: 2
            },
            objects: [
                {
                    firstName: 'Foo'
                },
                {
                    firstName: 'John',
                    lastName: 'BAR',
                }
            ]
        });

        userStore.userList().then(_userList_ => userList = _userList_);

        this.$httpBackend.flush();

        expect(userList.length).toEqual(2);
        expect(userList[0].firstName).toEqual('Foo');
        expect(userList[0].lastName).toEqual(undefined);
        expect(userList[1].firstName).toEqual('John');
        expect(userList[1].lastName).toEqual('BAR');

    });

});
