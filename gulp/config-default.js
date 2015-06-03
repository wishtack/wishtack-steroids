/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function configDefault() {

    var config = {};

    config.appPath = 'app';
    config.appAngularPath = config.appPath + '/angular';
    config.appAngularPattern = config.appAngularPath + '/**';
    config.appAngularTemplatesPattern = config.appAngularPath + '/**/*.html';
    config.appDjangoTemplatesPath = config.appPath + '/templates';
    config.appDjangoTemplatesPattern = config.appDjangoTemplatesPath + '/**/*.html';
    config.distPath = 'dist';
    config.distAssetsPath = config.distPath + '/assets';
    config.distAssetsAngularTemplatesPath = config.distAssetsPath + '/angular';
    config.djangoTemplatesDirectory = 'templates';

    /* Default protractor configuration. */
    config.protractorConfigurator = require('./config-protractor').protractorConfigurator;

    return config;

};
