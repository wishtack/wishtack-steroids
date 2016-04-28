/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function testKarma(done) {

    const karma = require('karma');
    const minimist = require('minimist');

    const options = minimist(process.argv.slice(2), {
        boolean: ['watch']
    });

    new karma.Server({
        configFile: __dirname + '/../../test/karma/karma.conf.js',
        singleRun: !options.watch
    }, done)
        .start();

};
