import {FORM_DIRECTIVES} from 'angular2/common';
import {Component} from 'angular2/core';
import {upgradeAdapter} from '../../../upgrade-adapter';

var angular = require('angular');
var moment = require('moment');

import {Job} from "./job";

require('../../ng-module-lazonme')
    .component('lzGreetings', {
        bindings: {
            name: '='
        },
        template: '<div><span>Hello </span><span ng-bind="$ctrl.name"></span><span>!</span></div>' +
        '<md-button ng-click="$ctrl.name = null">test</md-button>' +
        '<input ng-model="$ctrl.name">'
    });

@Component({
    directives: [FORM_DIRECTIVES, upgradeAdapter.upgradeNg1Component('lzGreetings')],
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
        this.job.name = 'TEST';

    }

}

