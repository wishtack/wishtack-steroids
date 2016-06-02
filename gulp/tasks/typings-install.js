/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

module.exports = (done) => {

    var child_process = require('child_process');

    child_process.spawn('node_modules/.bin/typings', ['install'], {
        stdio: 'inherit'
    }).once('close', done);
    
};
