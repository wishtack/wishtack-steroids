/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function runserver(done) {

    var child_process = require('child_process');
    var gulp = require('gulp');

    var loadenv = require('./lib/loadenv');

    var _runserver = function _runserver(done) {

        var argv = ['runserver'];

        child_process.spawn('./manage.py', argv, {
            stdio: 'inherit'
        }).once('close', done);

    };

    return gulp.series(
        loadenv(),
        _runserver
    )(done);

};
