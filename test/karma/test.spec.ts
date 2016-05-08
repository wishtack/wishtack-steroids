import {
    it,
    inject,
    injectAsync,
    beforeEachProviders,
    ComponentFixture,
    TestComponentBuilder
} from 'angular2/testing';

import {LzJobList} from '../../app/angular/lazonme/event/job/job-list.component';
import {upgradeAdapter} from "../../app/angular/upgrade-adapter";

describe('123', () => {

    it('123', inject([], () => {

        class Test {
            double(x:number) {
                return 2 * x;
            }
        }

        expect(new Test().double(2)).toEqual(4);

    }));

    it('should render list', injectAsync([TestComponentBuilder], (tcb) => {

        let resolve;
        let reject;
        let promise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });

        require('../../app/angular/lazonme/ng-module-lazonme');

        const lazonme = require('../../app/angular/lazonme/ng-module-lazonme');
        lazonme.directive('lzJobList', upgradeAdapter.downgradeNg2Component(LzJobList));

        document.body.innerHTML = '<lz-job-list></lz-job-list>';

        upgradeAdapter.bootstrap(document.body, ['lazonme'])
            .ready(function () {

                console.log(document.body.innerHTML);

                //tcb.createAsync(LzJobList)
                //    .then((componentFixture:ComponentFixture) => {
                //        const element = componentFixture.nativeElement;
                //        componentFixture.detectChanges();
                //        console.log(element);
                //        resolve();
                //    })
                //    .catch(reject);

                resolve();

            });

        return promise;

    }));

});

