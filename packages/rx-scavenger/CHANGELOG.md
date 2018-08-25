# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.2"></a>
## [1.0.2](https://github.com/wishtack/wishtack-steroids/compare/@wishtack/rx-scavenger@1.0.0...@wishtack/rx-scavenger@1.0.2) (2018-08-25)


### Bug Fixes

* Set more flexible compatibility window for core-js peer dependency. ([57b5860](https://github.com/wishtack/wishtack-steroids/commit/57b5860))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/wishtack/wishtack-steroids/compare/@wishtack/rx-scavenger@1.0.0...@wishtack/rx-scavenger@1.0.1) (2018-05-30)


### Bug Fixes

* Set more flexible compatibility window for core-js peer dependency. ([57b5860](https://github.com/wishtack/wishtack-steroids/commit/57b5860))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/wishtack/wishtack-steroids/compare/@wishtack/rx-scavenger@0.2.0...@wishtack/rx-scavenger@1.0.0) (2018-05-30)


### Bug Fixes

* `Scavenger.unsubscribe()` was not called if `ngOnDestroy()` is not implemented due to Angular not calling dynamically added `ngOnDestroy()` method. Fixes [#146](https://github.com/wishtack/wishtack-steroids/issues/146). ([d108d60](https://github.com/wishtack/wishtack-steroids/commit/d108d60))


### BREAKING CHANGES

* The component given to Scavenger's constructor must have an `ngOnDestroy` method.




<a name="0.2.0"></a>
# 0.2.0 (2018-05-30)


### Bug Fixes

* Fixed typing issue as `rxjs` should be a peer dependency in order to avoid version mismatch. ([5a4099f](https://github.com/wishtack/wishtack-steroids/commit/5a4099f))


### Features

* Added `Scavenger.collect()` pipe factory. ([26649f0](https://github.com/wishtack/wishtack-steroids/commit/26649f0))
* Added `Scavenger.collectByKey()`. ([e08d5fb](https://github.com/wishtack/wishtack-steroids/commit/e08d5fb))
* Scavenger should unsubscribe from all subscriptions when component's ngOnDestroy method is called. ([9cc1dca](https://github.com/wishtack/wishtack-steroids/commit/9cc1dca))




<a name="0.1.0"></a>
# 0.1.0 (2018-05-29)


### Bug Fixes

* Fixed typing issue as `rxjs` should be a peer dependency in order to avoid version mismatch. ([5a4099f](https://github.com/wishtack/wishtack-steroids/commit/5a4099f))


### Features

* Added `Scavenger.collect()` pipe factory. ([26649f0](https://github.com/wishtack/wishtack-steroids/commit/26649f0))
* Added `Scavenger.collectByKey()`. ([e08d5fb](https://github.com/wishtack/wishtack-steroids/commit/e08d5fb))
* Scavenger should unsubscribe from all subscriptions when component's ngOnDestroy method is called. ([9cc1dca](https://github.com/wishtack/wishtack-steroids/commit/9cc1dca))
