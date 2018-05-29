/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const path = require('path');
const { WebpackConfigFactory } = require('./webpack-config-factory');

module.exports = config => {

    /* Enable code coverage if single run.
     * This avoids slowing down tests and breaking sourcemap for debug. */
    const coverage = config.singleRun;
    const projectTestPath = path.dirname(config.configFile);
    const projectPath = path.join(projectTestPath, '..');
    const specBundleRelativeFilePath = path.join(projectTestPath, 'spec-bundle.js');

    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['jasmine'],
        reporters: [
            'mocha',
            ...coverage ? ['coverage-istanbul'] : []
        ],
        files: [
            specBundleRelativeFilePath
        ],
        preprocessors: {
            [specBundleRelativeFilePath]: ['webpack']
        },
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text-summary'],
            dir: path.join(projectPath, 'coverage'),
            fixWebpackSourcePaths: true
        },
        webpack: new WebpackConfigFactory().testConfig({
            coverage,
            projectPath
        })
    });

};