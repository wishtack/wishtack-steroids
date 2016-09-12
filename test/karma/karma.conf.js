/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function (config) {

    var webpackTestConfig = require('../../webpack/webpack.test.config');

    var testPath = 'test/karma/';
    var specBundleFileName = 'spec-bundle.js';
    var specBundlePath = testPath + specBundleFileName;

    var preprocessors = {};

    preprocessors[specBundlePath] = ['coverage', 'webpack', 'sourcemap'];
    preprocessors['app/angular/**/*.html'] = ['ng-html2js'];

    config.set({
        basePath: '../..',
        browsers: ['PhantomJS'],
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {type: 'text-summary'},
                {type: 'json'},
                {type: 'html'}
            ]
        },
        files: [
            {
                pattern: specBundlePath,
                watched: false
            },
            {
                pattern: 'app/**/*.html'
            }
        ],
        frameworks: ['jasmine'],
        ngHtml2JsPreprocessor: {
            stripPrefix: '',
            prependPrefix: '/_karma_webpack_//assets/',
            moduleName: 'wishtack.templates'
        },
        preprocessors: preprocessors,
        reporters: ['progress', 'coverage'],
        webpack: webpackTestConfig
    });

};
