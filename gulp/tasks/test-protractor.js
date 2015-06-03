/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function testProtractor(done) {

    var gulp = require('gulp');

    var config = require('../config')();

    gulp.series(
        require('./lib/loadenv')(),
        function protractorRun(done) {
            require('wt-protractor-runner')(config.protractorConfigurator())(done);
        }
    )(done);

};
