'use strict';

var path = require('path');

class WebpackHelper {
    
    constructor() {

        this.rootPath = path.join(__dirname, '..');
        
        this.distDirectoryName = 'dist';

        this.assetsRelativePath = 'assets';
        this.assetsScriptsRelativePath = path.join(this.assetsRelativePath, 'scripts');
        
        this.appPath = path.join(this.rootPath, 'app');
        this.appAngularPath = path.join(this.appPath, 'angular');
        this.appIndexHtmlPath = path.join(this.appPath, 'index.html');
        this.distPath = path.join(this.rootPath, this.distDirectoryName);
        this.distIndexHtmlRelativePath = path.join('index.html');

        this.publicPath = './';

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
