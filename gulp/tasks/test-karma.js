/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function testKarma(done) {

    require('karma').server.start({
        configFile: __dirname + '/../../test/karma/karma.conf.js',
        singleRun: true
    }, done);

};
