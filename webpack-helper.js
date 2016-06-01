var path = require('path');

var WebpackHelper = function () {};

WebpackHelper.prototype = {

    appAngularPath: function appAngularPath() {
        return this.rootPath() + 'app/angular/';
    },
    
    distDirectoryName: function distDirectoryName() {
        return 'dist';
    },

    prepend: function prepend(extensions, args) {
        args = args || [];
        if (!Array.isArray(args)) {
            args = [args]
        }
        return extensions.reduce(function (memo, val) {
            return memo.concat(val, args.map(function (prefix) {
                return prefix + val
            }));
        }, ['']);
    },

    root: function root(args) {
        args = Array.prototype.slice.call(arguments, 0);
        return path.join.apply(path, [__dirname].concat(args));
    },

    rootPath: function rootPath() {
        return this.root('./');
    }

};

module.exports = new WebpackHelper();
