/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = {

    protractorConfigurator: function protractorConfigurator() {

        var minimist = require('minimist');
        var path = require('path');
        var wtProtractorUtils = require('wt-protractor-utils');

        var options = minimist(process.argv.slice(2), {
            string: ['test-protractor-pattern']
        });

        var testProtractorPattern = options.testProtractorPattern;

        var projectPath = __dirname + '/..';

        /* Transforming relative path to absolute path. */
        if (testProtractorPattern != null && !path.isAbsolute(testProtractorPattern)) {
            testProtractorPattern = path.join(process.cwd(), testProtractorPattern);
        }

        testProtractorPattern = testProtractorPattern || projectPath + '/test/protractor/test-*.js';

        var configListByEnv = {};
        var protractorBaseConfig = {
            jasmineNodeOpts: {
                defaultTimeoutInterval: 600000,
                isVerbose: true
            },
            onPrepare: __dirname + '/config-protractor-on-prepare.js',
            specs: testProtractorPattern
        };

        /* Settings for local environment testing. */
        configListByEnv['local'] = [
            wtProtractorUtils.mergeConfig({
                configList: [
                    protractorBaseConfig,
                    wtProtractorUtils.platform.local,
                    wtProtractorUtils.browser.chrome
                ]
            })
        ];

        return {configList: configListByEnv[process.env.env] || []};

    }

};
