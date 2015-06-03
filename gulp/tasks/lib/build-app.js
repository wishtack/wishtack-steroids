/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function buildAppFactory(args) {

    var NamedParameters = require('named-parameters').NamedParameters;

    var args = new NamedParameters(args)
        .default('uglify', true)
        .values();

    var uglify = args.uglify;

    return function buildApp(done) {

        var del = require('del');
        var fs = require('fs');
        var gulp = require('gulp');
        var vinylPaths = require('vinyl-paths');

        var config = require('../../config')();
        var plugins = require('../../plugins');
        var loadenv = require('./loadenv');

        var _clean = function _clean(done) {

            try {
                fs.statSync(config.distPath);
                return gulp.src(config.distPath, {read: false})
                    .pipe(vinylPaths(del));
            }
            catch (exception) {
                if (exception.code === 'ENOENT') {
                    done();
                }
                else {
                    throw exception;
                }
            }

        };

        /**
         * Copy and rev angular templates then generate file rev mapping manifest.
         */
        var _copyAngularTemplates = function _copyAngularTemplates() {

            return gulp.src(config.appAngularTemplatesPattern)
                .pipe(plugins.rev())
                .pipe(gulp.dest(config.distAssetsAngularTemplatesPath))
                .pipe(plugins.rev.manifest())
                .pipe(gulp.dest(config.distPath));

        };

        /**
         * Replace revved files.
         */
        var _revReplace = function _revReplace() {
            return plugins.revReplace({manifest: gulp.src(config.distPath + '/rev-manifest.json')});
        };

        var _usemin = function _usemin() {

            return gulp.src(config.appDjangoTemplatesPattern)
                .pipe(plugins.htmlGlobExpansion({root: config.appPath}))
                /* @hack: https://github.com/zont/gulp-usemin/issues/91. */
                .pipe(plugins.foreach(function (stream, file) {
                    return stream
                        .pipe(plugins.usemin({
                            css: [
                                /* Replace references to angular templates. */
                                _revReplace(),
                                plugins.less(),
                                plugins.minifyCss(),
                                plugins.rev()
                            ],
                            html: [
                                plugins.minifyHtml({empty: true}),
                                /* @hack: That way we can control templates target directory without moving generated
                                 * assets. */
                                plugins.rename({dirname: config.djangoTemplatesDirectory})
                            ],
                            jsApp: [
                                /* Replace references to angular templates. */
                                _revReplace(),
                                plugins.if(uglify, plugins.ngAnnotate()),
                                plugins.if(uglify, plugins.uglify()),
                                plugins.rev()
                            ],
                            jsComponents: [
                                plugins.if(uglify, plugins.ngAnnotate()),
                                plugins.if(uglify, plugins.uglify()),
                                plugins.rev()
                            ]
                        }))
                        .pipe(gulp.dest(config.distPath));
                }));

        };

        return gulp.series(
            /* Load environment before building as we might cross-env build the project.
             * I.e.: Build the production project on local machine using 'gulp build --env=prod'. */
            loadenv(),
            'bower',
            _clean,
            _copyAngularTemplates,
            _usemin
        )(done);

    };

};
