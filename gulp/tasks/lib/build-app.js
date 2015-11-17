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
                    .pipe(plugins.plumber())
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
         * Copy images.
         */
        var _copyImages = function _copyImages() {

            return gulp.src(config.appImagesPattern)
                .pipe(plugins.plumber())
                .pipe(plugins.rev())
                .pipe(gulp.dest(config.distAssetsImagesPath))
                .pipe(plugins.rev.manifest('rev-manifest-images.json', {merge: true}))
                .pipe(gulp.dest(config.distPath));

        };

        /**
         * Replace revved images.
         * @hack: rev.manifest({merge: true}) doesn't seem to work.
         */
        var _revReplaceImages = function _revReplaceImages() {
            return plugins.revReplace({manifest: gulp.src(config.distPath + '/rev-manifest-images.json')});
        };

        /**
         * Copy and rev angular templates then generate file rev mapping manifest.
         */
        var _copyAngularTemplates = function _copyAngularTemplates() {

            return gulp.src(config.appAngularTemplatesPattern)
                .pipe(plugins.plumber())
                .pipe(_revReplaceImages())
                .pipe(plugins.rev())
                .pipe(gulp.dest(config.distAssetsAngularTemplatesPath))
                .pipe(plugins.rev.manifest('rev-manifest-angular-templates.json'))
                .pipe(gulp.dest(config.distPath));

        };

        /**
         * Replace revved templates.
         */
        var _revReplaceAngularTemplates = function _revReplaceAngularTemplates() {
            return plugins.revReplace({manifest: gulp.src(config.distPath + '/rev-manifest-angular-templates.json')});
        };

        var _usemin = function _usemin() {

            return gulp.src(config.appDjangoTemplatesPattern)
                .pipe(plugins.plumber())
                .pipe(plugins.htmlGlobExpansion({root: config.appPath}))
                /* @hack: https://github.com/zont/gulp-usemin/issues/91. */
                .pipe(plugins.foreach(function (stream, file) {
                    return stream
                        .pipe(plugins.plumber())
                        .pipe(plugins.usemin({
                            css: [
                                plugins.plumber(),
                                plugins.less(),
                                plugins.minifyCss(),
                                plugins.rev()
                            ],
                            html: [
                                plugins.plumber(),
                                plugins.minifyHtml({empty: true}),
                                /* @hack: That way we can control templates target directory without moving generated
                                 * assets. */
                                plugins.rename({dirname: config.djangoTemplatesDirectory})
                            ],
                            jsApp: [
                                plugins.plumber(),
                                /* Replace references to angular templates and images. */
                                _revReplaceAngularTemplates(),
                                _revReplaceImages(),
                                plugins.if(uglify, plugins.ngAnnotate()),
                                plugins.if(uglify, plugins.uglify()),
                                plugins.rev()
                            ],
                            jsComponents: [
                                plugins.plumber(),
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
            _clean,
            _copyImages,
            _copyAngularTemplates,
            _usemin
        )(done);

    };

};
