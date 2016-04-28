/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function(config) {

    var webpackTestConfig = require('../../webpack.test.config');

    var nodeModulesPath = 'node_modules/';
    var testPath = 'test/karma/';
    var specBundleFileName = 'spec-bundle.js';
    var specBundlePath = testPath + specBundleFileName;

    var preprocessors = {};

    preprocessors[specBundlePath] = ['webpack', 'sourcemap'];

    config.set({
        basePath: '../..',
        browsers: ['Chrome'],
        files: [
            nodeModulesPath + 'angular/angular.js',
            {
                pattern: specBundlePath,
                watched: false
            }
        ],
        frameworks: ['jasmine'],
        preprocessors: preprocessors,
        webpack: webpackTestConfig
    });

};
