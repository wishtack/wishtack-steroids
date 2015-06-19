/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function(config) {

    var appPath = 'app/';
    var appAngularPath = appPath + 'angular/';
    var appAngularPattern = appAngularPath + '**/*.js';
    var appBowerComponentsPath = appPath + '/bower_components/';
    var testPath = 'test/karma/';

    var preprocessors = {};

    /* Enable karma coverage on app's angular code. */
    preprocessors[appAngularPattern] = ['coverage'];

    config.set({
        basePath: '../..',
        browsers: ['PhantomJS'],
        files: [

            /* Bower components. */
            appBowerComponentsPath + 'angular/angular.js',

            /* Angular mocks. */
            appBowerComponentsPath + 'angular-mocks/angular-mocks.js',

            /* App. */
            appPath + 'angular/**/ng-module-*.js',
            appPath + 'angular/**/ng-{config,controller,directive,filter,model,run,service}-*.js',

            /* Tests. */
            testPath + '**/test-*.js'
        ],
        frameworks: ['jasmine'],
        preprocessors: preprocessors
    });

};
