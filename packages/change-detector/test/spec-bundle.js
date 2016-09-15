
require('angular');
require('angular-mocks');

const context = require.context(__dirname, true, /\.spec\.ts$/);
context.keys().forEach(context);
