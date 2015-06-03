/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function testKarma(done) {

    var minimist = require('minimist');

    var options = minimist(process.argv.slice(2), {
        boolean: ['watch']
    });

    require('karma').server.start({
        configFile: __dirname + '/../../test/karma/karma.conf.js',
        singleRun: !options.watch
    }, done);

};
