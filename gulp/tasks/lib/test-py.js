/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */


/**
 * @param args{testPath: string}
 */
module.exports = function testPyFactory(args) {

    var testsPath = args.testsPath;

    return function testPy(done) {

        var child_process = require('child_process');
        var gulp = require('gulp');

        var loadenv = require('./loadenv');

        var _testPy = function _testPy(done) {

            var argv = ['test', testsPath];

            child_process.spawn('./manage.py', argv, {
                stdio: 'inherit'
            }).once('close', done);

        };

        return gulp.series(
            loadenv(),
            _testPy
        )(done);

    };

};
