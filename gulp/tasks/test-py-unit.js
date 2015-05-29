/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function pyUnit(done) {

    var child_process = require('child_process');
    var gulp = require('gulp');

    var loadenv = require('./lib/loadenv');

    var _pyUnit = function _pyUnit(done) {

        var argv = ['test', 'test/unit'];

        child_process.spawn('./manage.py', argv, {
            stdio: 'inherit'
        }).once('close', done);

    };

    return gulp.series(
        loadenv(),
        _pyUnit
    )(done);

};