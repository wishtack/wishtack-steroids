import * as angular from 'angular';
import {appModule} from '../../app/angular/app/app.module';

describe('appComponent', () => {

    beforeEach(angular.mock.module(appModule.name));

    beforeEach(inject(($compile,
                       $rootScope,
                       $templateCache) => {
        this._$compile = $compile;
        this._$templateCache = $templateCache;
        this._scope = $rootScope.$new();
    }));

    beforeEach(() => {
        this._$templateCache.put(
            require('../../app/angular/app/app.component.html'),
            require('!!raw-loader!../../app/angular/app/app.component.html')
        );
    });

    it('should say hi', () => {

        let rawElement = this._$compile('<wt-app></wt-app>')(this._scope);
        let element = angular.element(rawElement);

        this._scope.$digest();

        expect(element.find('div').text()).toEqual('Hello !!!');
        expect(element.find('a').text()).toEqual('https://www.wishtack.com');

    });

});

