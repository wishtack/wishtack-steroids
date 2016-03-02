var path = require('path');

var WebpackHelper = function () {

};

WebpackHelper.prototype = {

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

    rootNode: function rootNode(args) {
        args = Array.prototype.slice.call(arguments, 0);
        return root.apply(path, ['node_modules'].concat(args));
    }

};

module.exports = new WebpackHelper();
