<p align="center">
    <img src="https://github.com/wishtack/wishtack-steroids/raw/master/packages/rx-scavenger/logo.png" alt="Rx-Scavenger Logo">
    <h1>Rx-Scavenger : The RxJS Subscription Garbage Collector
</p>

[![Build Status](https://travis-ci.org/wishtack/wishtack-steroids.svg?branch=master)](https://travis-ci.org/wishtack/ng-steroids)
[![Greenkeeper badge](https://badges.greenkeeper.io/wishtack/wishtack-steroids.svg)](https://greenkeeper.io/)

# What is `rx-scavenger`?

`rx-scavenger` is an **[RxJS](https://github.com/Reactive-Extensions/RxJS) `Subscription` Garbage Collector**.

Its main goal is to reduce the boilerplate code when handling RxJS `Subscription`s in [Angular](https://github.com/angular/angular) components in an **easy** and **safe** way.

`rx-scavenger` also allows you to map `Subscription`s to a key and every time that you subscribe to a new `Observable` using the same key, the previous `Subscription` will automatically be unsubscribed of.

This easily avoids some race conditions and memory leaks when overwriting `Subscription`s.

# Getting Started

## Install

```shell
yarn add @wishtack/rx-scavenger
```

or `npm install --save @wishtack/rx-scavenger`

## Usage in an Angular component

```typescript
import { Scavenger } from '@wishtack/rx-scavenger';

@Component({
    ...
})
export class WeatherComponent implements OnDestroy, OnInit {
    
    private _scavenger = new Scavenger(this);
    
    constructor(private _weatherStation: WeatherStation) {
    }
    
    ngOnInit() {
        
        this._weatherStation
            .getWeather('Lyon')
            .pipe(
                this._scavenger.collect()        
            )
            .subscribe(weather => {
                ...
            });
        
    }
    
    ngOnDestroy() {
    }
    
}
```

As you can see, there's no need to call `Scavenger.unsubscribe()` in `ngOnDestroy()` method as the `Scavenger` class takes care of implementing it and collecting every `Subscription` to the `Observable` returned by `WeatherStation.getWeather()` using the `Scavenger.collect()` method.

## Using `collectByKey` to avoid overwritten `Subscription`s

```typescript
    refreshWeather(city) {
        
        this._subscription = this._weatherStation
            .getWeather(city)
            .subscribe(weather => {
                ...
            });
        
    }
```

Usually, if the `WeatherComponent.refreshWeather()` method here is called more than once, we might end up in a race condition or simply overwrite the `Subscription` in `_subscription` property.

*Race condition issues also happen when using `takeUntil(destroyed$)` pattern.*

Using the `Scavenger.collectByKey(key: string)` method, the first `Subscription` is stored in a `Map` with that key and on the second subscribe, the first `Subscription` is unsubscribed from so there's only one `Subscription` open with that key at a time.

```typescript
    refreshWeather(city) {
        
        this._weatherStation
            .getWeather(city)
            .pipe(
                this._scavenger.collectByKey('weather')        
            )
            .subscribe(weather => {
                ...
            });
        
    }
```

## Manual Unsubscribe

You can also unsubscribe from all the collected `Subscription`s using `Scavenger.unsubscribe()`.
