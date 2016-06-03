'use strict';

var path = require('path');

class WebpackHelper {
    
    constructor() {

        this.rootPath = __dirname;
        
        this.distDirectoryName = 'dist';
        this.templatesDirectoryName = 'templates';

        this.assetsRelativePath = 'assets';
        this.assetsScriptsRelativePath = path.join(this.assetsRelativePath, 'scripts');
        
        this.appPath = path.join(this.rootPath, 'app');
        this.appAngularPath = path.join(this.appPath, 'angular');
        this.appTemplatesPath = path.join(this.appPath, this.templatesDirectoryName);
        this.distPath = path.join(this.rootPath, this.distDirectoryName);
        
    }

    prepend(extensions, args) {
        args = args || [];
        if (!Array.isArray(args)) {
            args = [args]
        }
        return extensions.reduce(function (memo, val) {
            return memo.concat(val, args.map(function (prefix) {
                return prefix + val
            }));
        }, ['']);
    }
    
}

module.exports = new WebpackHelper();
