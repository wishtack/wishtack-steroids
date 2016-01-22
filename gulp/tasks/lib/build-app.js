/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function buildAppFactory(args) {

    var NamedParameters = require('named-parameters').NamedParameters;

    args = new NamedParameters(args)
        .default('bower', true)
        .default('plumber', false)
        .default('uglify', true)
        .values();

    var bower = args.bower;
    var plumber = args.plumber;
    var uglify = args.uglify;

    return function buildApp(done) {

        var del = require('del');
        var fs = require('fs');
        var gulp = require('gulp');
        var vinylPaths = require('vinyl-paths');

        var config = require('../../config')();
        var plugins = require('../../plugins');
        var loadenv = require('./loadenv');

        var _angular = function _angular() {

            var tsProject = plugins.typescript.createProject('tsconfig.json', {
                typescript: require('typescript')
            });

            var result = gulp.src(config.appAngularPath + '/init.ts')
                .pipe(plugins.insert.prepend('declare var System;'))
                .pipe(plugins.if(plumber, plugins.plumber()))
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.typescript(tsProject));

            return result.js
                .pipe(plugins.if(uglify, plugins.uglify()))
                .pipe(plugins.sourcemaps.write())
                .pipe(plugins.rev())
                .pipe(gulp.dest(config.distAssetsScriptsPath))
                .pipe(plugins.rev.manifest('rev-manifest-typescript.json', {merge: true}))
                .pipe(gulp.dest(config.distPath));

        };

        var _clean = function _clean(done) {

            try {
                fs.statSync(config.distPath);
                return gulp.src(config.distPath, {read: false})
                    .pipe(plugins.if(plumber, plugins.plumber()))
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

        var _revReplace = function _revReplace(args) {

            var manifestFilePath = args.manifestFilePath;

            var source = gulp.src(manifestFilePath)
                .on('error', function (err) {
                    console.error(err);
                    console.error(err.stack);
                });

            return plugins.revReplace({manifest: source});

        };

        /**
         * Copy images.
         */
        var _copyImages = function _copyImages() {

            return gulp.src(config.appImagesPattern)
                .pipe(plugins.if(plumber, plugins.plumber()))
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
            return _revReplace({manifestFilePath: config.distPath + '/rev-manifest-images.json'});
        };

        /**
         * Copy and rev angular templates then generate file rev mapping manifest.
         */
        var _copyAngularTemplates = function _copyAngularTemplates() {

            return gulp.src(config.appAngularTemplatesPattern)
                .pipe(plugins.if(plumber, plugins.plumber()))
                .pipe(_revReplaceImages())
                .pipe(plugins.rev())
                .pipe(gulp.dest(config.distAssetsAngularPath))
                .pipe(plugins.rev.manifest('rev-manifest-angular-templates.json'))
                .pipe(gulp.dest(config.distPath));

        };

        /**
         * Replace revved templates.
         */
        var _revReplaceAngularTemplates = function _revReplaceAngularTemplates() {
            return _revReplace({manifestFilePath: config.distPath + '/rev-manifest-angular-templates.json'});
        };

        var _usemin = function _usemin() {

            return gulp.src(config.appDjangoTemplatesPattern)
                .pipe(plugins.if(plumber, plugins.plumber()))
                .pipe(plugins.htmlGlobExpansion({root: config.appPath}))
                /* @hack: https://github.com/zont/gulp-usemin/issues/91. */
                .pipe(plugins.foreach(function (stream, file) {
                    return stream
                        .pipe(plugins.if(plumber, plugins.plumber()))
                        .pipe(plugins.usemin({
                            css: [
                                plugins.if(plumber, plugins.plumber()),
                                plugins.less(),
                                plugins.minifyCss(),
                                plugins.rev()
                            ],
                            html: [
                                plugins.if(plumber, plugins.plumber()),
                                plugins.minifyHtml({empty: true}),
                                /* @hack: That way we can control templates target directory without moving generated
                                 * assets. */
                                plugins.rename({dirname: config.djangoTemplatesDirectory})
                            ],
                            jsApp: [
                                plugins.if(plumber, plugins.plumber()),
                                /* Replace references to angular templates and images. */
                                _revReplaceAngularTemplates(),
                                _revReplaceImages(),
                                plugins.if(uglify, plugins.ngAnnotate()),
                                plugins.if(uglify, plugins.uglify()),
                                plugins.rev()
                            ],
                            jsComponents: [
                                plugins.if(plumber, plugins.plumber()),
                                plugins.rev()
                            ]
                            //ts: [
                            //    plugins.if(plumber, plugins.plumber()),
                            //    plugins.insert.prepend('declare var System;'),
                            //    plugins.if(!uglify, plugins.sourcemaps.init()),
                            //    plugins.typescript({
                            //        experimentalDecorators: true,
                            //        module: 'commonjs',
                            //        moduleResolution: 'node'
                            //        //"target": "es5",
                            //        //"removeComments": true
                            //        //"emitDecoratorMetadata": true,
                            //    }),
                            //    plugins.if(uglify, plugins.uglify()),
                            //    plugins.if(!uglify, plugins.sourcemaps.write()),
                            //    plugins.rev()
                            //]
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
            bower ? ['bower'] : [],
            //function _browserify() {
            //    var bundler = require('browserify')({
            //        basedir: 'app/angular/',
            //        bundleExternal: false
            //    })
            //        .add('init.ts')
            //        .plugin(require('tsify'), {
            //            experimentalDecorators: true
            //        });
            //
            //    return bundler.bundle()
            //        .pipe(require('vinyl-source-stream')('app.js'))
            //        .pipe(gulp.dest('dist/assets/scripts/'));
            //},
            function _typescript() {
                return gulp.src('app/angular/**/*.ts')
                    .pipe(plugins.tsc({
                        experimentalDecorators: true,
                        module: 'commonjs',
                        moduleResolution: 'node',
                        target: 'ES5',
                        // Don't use the version of typescript that gulp-typescript depends on
                        // see https://github.com/ivogabe/gulp-typescript#typescript-version
                        typescript: require('typescript')
                    }))
                    .pipe(gulp.dest('dist/assets/scripts/app'));
            },
            function _systemjs() {

                var Builder = require('systemjs-builder');

                var builder = new Builder({
                    baseURL: 'dist/assets/scripts'
                });

                return builder.bundle('[**/*.js]', 'dist/assets/scripts/app.js');

            },
            _usemin,
            'cache-manifest'
        )(done);

    };

};
