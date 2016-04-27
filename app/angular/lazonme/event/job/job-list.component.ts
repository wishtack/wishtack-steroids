import {FORM_DIRECTIVES} from 'angular2/common';
import {Component} from 'angular2/core';
import {UpgradeAdapter} from "angular2/upgrade";

var angular = require('angular');
var moment = require('moment');

import {Job} from "./job";

var adapter = new UpgradeAdapter();

angular.module('lazonme')
    .component('lzGreetings', {
        bindings: {},
        template: '<div>Hello !</div>'
    });


@Component({
    //directives: [FORM_DIRECTIVES, adapter.upgradeNg1Component('lzGreetings')],
    directives: [FORM_DIRECTIVES],
    selector: 'lz-job-list',
    template: require('./job-list.component.html')
})
export class LzJobList {

    job:Job;
    jobList:Array<Job> = [];

    constructor() {
        this._resetJob();
    }

    onJobAdd() {

        this.jobList.push(this.job);
        this._resetJob()

    }

    private _resetJob() {

        var now = moment();

        this.job = new Job();
        this.job.startDate = now.format('YYYY-MM-DD');
        this.job.startTime = now.format('HH:00');
        this.job.duration = 4;

    }

}
