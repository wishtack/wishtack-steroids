/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

var _loadEnvFromFile = function _loadEnvFromFile(args) {

    var _ = require('underscore');
    var fs = require('fs');

    var data = null;
    var filePath = args.filePath;

    try {
        data = fs.readFileSync(filePath, 'utf-8');
    }
    catch (exception) {
        if (exception.code === 'ENOENT') {
            console.warn('Env file \'' + filePath + '\' not found.');
            return;
        }
        else {
            throw exception;
        }
    }

    _.forEach(data.split('\n'), function (line) {

        var key = null;
        var separator = '=';
        var tokens = null;
        var value = null;

        line = line.trim();

        if (!_(line).contains(separator)) {
            return;
        }

        tokens = line.split('=');
        key = tokens.shift();
        value = tokens.join('=');

        process.env[key] = value;

    });

};

/* Load environment from local or test files (.env-local*, .env-test*) or even heroku. */
module.exports = function loadenvFactory(args) {

    return function loadenv(done) {

        var _ = require('underscore');
        var config = require('../../config')();
        var minimist = require('minimist');
        var options = minimist(process.argv.slice(2), {
            string: ['env']
        });

        var env = ((args != null) ? args.env : null) || options.env;

        /* Do not load environment if running on heroku and no env been specified explicitly
         * Hacky but works fine. */
        if ((env == null) && process.env['BUILDPACK_URL']) {
            grunt.log.write('Environment not loaded as app seems to be running on heroku and no env has been specified explicitly.');
            return;
        }

        /* Setting default locale. */
        env = env || 'local';

        /* Setting env. */
        process.env.env = env;

        /* Requested environment is local or test. */
        if (_.contains(['local', 'test'], env)) {
            _loadEnvFromFile({filePath: '.env-common'});
            _loadEnvFromFile({filePath: '.env-' + env});
            _loadEnvFromFile({filePath: '.env-' + env + '-secret'});
            done();
        }

        /* Requested environment is a heroku app. */
        else {
            require('./herokuenv')({herokuApp: config.herokuAppDict[env]})(done);
        }

    };

};
