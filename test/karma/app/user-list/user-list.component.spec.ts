/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */


import * as $ from 'jquery';
import {User} from '../../../../app/angular/app/common/user/user';
import {userListModule} from '../../../../app/angular/app/user-list/user-list.module';

describe('UserListComponent', () => {

    beforeEach(angular.mock.module(userListModule.name));
    beforeEach(angular.mock.module('wishtack.templates'));

    beforeEach(inject(($compile,
                       $http,
                       $q,
                       $rootScope,
                       $templateCache,
                       userStore) => {

        this.$compile = $compile;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$templateCache = $templateCache;
        this.scope = this.$rootScope.$new();
        this.userStore = userStore;

    }));

    it('should display user list', () => {

        let rawElement;
        let element;

        spyOn(this.userStore, 'userList').and.returnValue(this.$q.resolve([
            new User({
                firstName: 'Foo',
                lastName: 'BAR'
            }),
            new User({
                firstName: 'John',
                lastName: 'BAR'
            })
        ]));
        spyOn(this.userStore, 'addUser');

        rawElement = this.$compile(`<wt-user-list>`)(this.scope);
        element = $(rawElement);

        this.scope.$apply();

        expect(element.find('wt-user-preview').length).toEqual(2);
        expect($(element.find('wt-user-preview span')[0]).text()).toEqual('Foo');
        expect($(element.find('wt-user-preview span')[1]).text()).toEqual('John');

        expect(this.userStore.userList.calls.count()).toEqual(1);
        expect(this.userStore.userList).toHaveBeenCalled();
        
        element.find('form input').val('Test').triggerHandler('input');
        // this.scope.
        element.find('form button').click();

        this.scope.$apply();

        expect(this.userStore.addUser.calls.count()).toEqual(1);
        // expect(this.userStore.addUser.calls.argsFor(0)[0].firstName).toEqual('Test');

    });

});