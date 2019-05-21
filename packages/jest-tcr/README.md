<p align="center">
    <img src="https://github.com/wishtack/wishtack-steroids/raw/master/packages/jest-tcr/tcr.png" alt="TCR Diagram">
    <h1>Jest-TCR: Test && Commit || Revert for JavaScript
</p>

[![Build Status](https://travis-ci.org/wishtack/wishtack-steroids.svg?branch=master)](https://travis-ci.org/wishtack/wishtack-steroids)
[![Greenkeeper badge](https://badges.greenkeeper.io/wishtack/wishtack-steroids.svg)](https://greenkeeper.io/)

# What is @wishtack/jest-tcr?

`@wishtack/jest-tcr` is an implementation of TCR (`Test && Commit || Revert`) which is an idea from Oddmund Strømme.

In order to reduce code asymmetry by producing the most atomic changes to the code, every time you run the tests, TCR will commit if the tests pass and revert if they fail.

# Getting Started

## 1. Install

### with yarn

```shell
yarn add -D @wishtack/jest-tcr
```

### with npm

```shell
npm install --dev @wishtack/jest-tcr
```


## 2. Setup

Create a dedicated jest configuration `jest.config.tcr.js` next to `jest.config.js` with the following content:

```javascript
const config = require('./jest.config');

module.exports = {
  ...config,
  reporters: [
    'default',
    '@wishtack/jest-tcr'
  ]
};
```

## 3. Add this script to `package.json`

```json
{
  ...
  "scripts": {
    "jest:tcr": "jest --config jest.config.tcr.js --onlyChanged"
  },
  ...
}
```

## 4. Run Jest in TCR

```shell
yarn jest:tcr
```

or `npm run jest:tcr`

## 5. [optional] Relaxed TCR

If you don't want to revert your spec files when tests fail, you can tell `@wishtack/jest-tcr` not to reset specs using the following configuration:

```javascript
const config = require('./jest.config');

module.exports = {
  ...config,
  reporters: [
    'default',
    ['@wishtack/jest-tcr', {
      revertBlacklistPattern: /spec\.ts$/
    }]
  ]
};
```
