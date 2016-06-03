/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function watch(done) {

    var minimist = require('minimist');
    var options = minimist(process.argv.slice(2), {
        boolean: ['debug']
    });
    
    var args = {
        debug: options.debug,
        dev: true,
        watch: true
    };

    var build = require('./lib/build');

    return build(args)(done);

};
