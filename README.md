# Boost your apps with Wishtack's Steroids

[![Build Status](https://travis-ci.org/wishtack/wishtack-steroids.svg?branch=master)](https://travis-ci.org/wishtack/wishtack-steroids)
[![Greenkeeper badge](https://badges.greenkeeper.io/wishtack/wishtack-steroids.svg)](https://greenkeeper.io/)

This is a monorepo containing the following packages:

#### [@wishtack/reactive-component-loader](/packages/reactive-component-loader)
- `@wishtack/reactive-component-loader` is an Angular module that allows:
    - **declarative** dynamic **component insertion**,
    - **component lazy loading** and not only with the router *(even with AOT enabled)*,
    - **passing @Inputs and @Outputs** easily to the dynamically inserted component (using [ng-dynamic-component](https://github.com/gund/ng-dynamic-component)).

#### [@wishtack/rx-scavenger](/packages/rx-scavenger)
- `@wishtack/rx-scavenger` is an **[RxJS](https://github.com/Reactive-Extensions/RxJS) `Subscription` Garbage Collector**.

#### [@wishtack/change-detector](/packages/change-detector)
- Angular's `OnPush` and `ChangeDetector` implementation for Angular 1.x. 

#### [@wishtack/rest-cache](/packages/rest-cache)
- [Work in Progress] Framework agnostic, reactive and fully customizable library to handle restful APIs caching.

