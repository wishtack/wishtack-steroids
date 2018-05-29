# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.1.0"></a>
# 0.1.0 (2018-05-29)


### Bug Fixes

* Fixed typing issue as `rxjs` should be a peer dependency in order to avoid version mismatch. ([5a4099f](https://github.com/wishtack/wishtack-steroids/commit/5a4099f))


### Features

* Added `Scavenger.collect()` pipe factory. ([26649f0](https://github.com/wishtack/wishtack-steroids/commit/26649f0))
* Added `Scavenger.collectByKey()`. ([e08d5fb](https://github.com/wishtack/wishtack-steroids/commit/e08d5fb))
* Scavenger should unsubscribe from all subscriptions when component's ngOnDestroy method is called. ([9cc1dca](https://github.com/wishtack/wishtack-steroids/commit/9cc1dca))
