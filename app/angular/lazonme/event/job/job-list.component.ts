import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';

import {Job} from "./job";

@Component({
    directives: [FORM_DIRECTIVES],
    selector: 'lz-job-list',
    template: require('./job-list.component.html')
})
export class LzJobList {

    public job:Job = new Job();
    public jobList:Array<Job> = [];

    public onJobAdd() {

        this.jobList.push(this.job);
        this.job = new Job();

    }

}
