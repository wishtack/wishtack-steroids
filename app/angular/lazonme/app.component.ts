
import {Component} from 'angular2/core';
import {UpgradeAdapter} from 'angular2/upgrade';

import {LzJobList} from './event/job/job-list.component';

@Component({
    directives: [LzJobList],
    selector: 'lz-app',
    template: require('./app.component.html')
})
export class LzApp {

}
