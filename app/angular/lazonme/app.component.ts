
import {Component} from 'angular2/core';
import {MdButton} from '@angular2-material/button/button';
import {UpgradeAdapter} from 'angular2/upgrade';

import {LzJobList} from './event/job/job-list.component';

@Component({
    directives: [MdButton, LzJobList],
    selector: 'lz-app',
    template: require('./app.component.html')
})
export class LzApp {

}
