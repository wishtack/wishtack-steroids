/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function configDefault() {

    var minimist = require('minimist');
    var path = require('path');

    var projectPath = __dirname + '/..';

    var config = {};

    var options = minimist(process.argv.slice(2), {
        string: ['test-e2e-pattern']
    });

    var testE2ePattern = options['test-e2e-pattern'];

    /* Transforming relative path to absolute path. */
    if (testE2ePattern != null && !path.isAbsolute(testE2ePattern)) {
        testE2ePattern = path.join(process.cwd(), testE2ePattern);
    }

    config.appPath = 'app';
    config.appAngularPath = config.appPath + '/angular';
    config.appAngularPattern = config.appAngularPath + '/**';
    config.appAngularTemplatesPattern = config.appAngularPath + '/**/*.html';
    config.appDjangoTemplatesPath = config.appPath + '/templates';
    config.appDjangoTemplatesPattern = config.appDjangoTemplatesPath + '/**/*.html';
    config.distPath = 'dist';
    config.distAssetsPath = config.distPath + '/assets';
    config.distDjangoTemplatesPath = config.distPath + '/templates';
    config.testE2ePattern = testE2ePattern || projectPath + '/test/protractor/test-*.js';

    return config;

};
