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
    config.appImagesPattern = config.appPath + '/images/**';
    config.bowerJsonPath = 'bower.json';
    config.distPath = 'dist';
    config.distAssetsPath = config.distPath + '/assets';
    config.distAssetsPattern = config.distAssetsPath + '/**';
    config.distAssetsAngularPath = config.distAssetsPath + '/angular';
    config.distAssetsImagesPath = config.distAssetsPath + '/images';
    config.distAssetsScriptsPath = config.distAssetsPath + '/scripts';
    config.djangoTemplatesDirectory = 'templates';

    /* Default protractor configuration. */
    config.protractorConfigurator = require('./config-protractor').protractorConfigurator;

    return config;

};
