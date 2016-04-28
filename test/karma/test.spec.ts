import {
    it,
    inject,
    injectAsync,
    beforeEachProviders,
    TestComponentBuilder
} from 'angular2/testing';

import {LzJobList} from '../../app/angular/lazonme/event/job/job-list.component';
import {ComponentFixture} from 'angular2/testing';
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

        console.log(document.body);

        upgradeAdapter.bootstrap(document.body, ['lazonme']);

        return tcb.createAsync(LzJobList)
            .then((componentFixture:ComponentFixture) => {
                const element = componentFixture.nativeElement;
                componentFixture.detectChanges();
                console.log(element);
            });
    }));

});

