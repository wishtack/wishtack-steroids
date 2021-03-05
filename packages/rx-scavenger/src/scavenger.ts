/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import 'core-js/es/map';
import 'core-js/modules/es.array.includes';

import { OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

export type PreSubscriptionOpaqueToken = any;

export class InvalidKeyError {

    private _message: string;

    constructor(key: string) {
        this._message = `Invalid key: ${key}`;
    }

    toString() {
        return this._message;
    }

}

export interface ƟWithScavenger {
    ɵscavenger: Scavenger;
}

export class Scavenger {

    private _subscriptionMap = new Map<string, Subscription>();
    private _subscriptionList: Subscription[] = [];
    private _preSubscriptionList = [];
    private _preSubscriptionMap = new Map<string, PreSubscriptionOpaqueToken>();

    constructor(component: OnDestroy = null) {
        this._tryRegisterNgOnDestroyHook(component);
    }

    collect<T>(): MonoTypeOperatorFunction<T> {
        return this._trackSubscription({
            /* Pre-subscription is still there which means that we still didn't have a subscription
             * and the pre-subscription has not been interrupted. */
            isPreSubscriptionInProgress: ({preSubscription}) => this._preSubscriptionList.includes(preSubscription),
            onPreSubscription: ({preSubscription}) => this._preSubscriptionList.push(preSubscription),
            onSubscription: ({preSubscription, subscription}) => {

                this._subscriptionList.push(subscription);

                /* Performance: Remove `preSubscription` now that we have the subscription.
                 * This will improve `isPreSubscriptionInProgress`'s performance as it will be a smaller `Array`. */
                this._preSubscriptionList = this._preSubscriptionList
                    .filter(_preSubscription => _preSubscription !== preSubscription);

            }
        });
    }

    collectByKey<T>(key: string): MonoTypeOperatorFunction<T> {

        if (typeof key !== 'string' || key === '') {
            throw new InvalidKeyError(key);
        }

        return this._trackSubscription({
            isPreSubscriptionInProgress: ({preSubscription}) => {
                return this._preSubscriptionMap.get(key) === preSubscription;
            },
            onPreSubscription: ({preSubscription}) => this._preSubscriptionMap.set(key, preSubscription),
            onSubscription: ({preSubscription, subscription}) => {

                const previousSubscription = this._subscriptionMap.get(key);

                if (previousSubscription != null) {
                    previousSubscription.unsubscribe();
                }

                this._subscriptionMap.set(key, subscription);

                /* Performance: Remove `preSubscription` now that we have the subscription.
                 * This will improve `isPreSubscriptionInProgress`'s performance as it will be a smaller `Map`. */
                this._preSubscriptionMap.delete(key);

            }
        });

    }

    unsubscribe() {

        const subscriptionList = [
            ...this._subscriptionList,
            ...Array.from(this._subscriptionMap.values())
        ];

        subscriptionList.forEach(subscription => subscription.unsubscribe());

        this._preSubscriptionList = [];
        this._subscriptionList = [];
        this._subscriptionMap.clear();

    }

    /**
     * `ngOnDestroy()` method is mandatory because Angular's Renderer2 doesn't call `ngOnDestroy` if added
     * dynamically.
     * Cf. https://github.com/wishtack/wishtack-steroids/issues/146.
     */
    private _tryRegisterNgOnDestroyHook(component: OnDestroy) {

        const _component = component as OnDestroy & ƟWithScavenger;

        if (_component == null) {
            return;
        }

        const prototype = _component['__proto__'];

        _component.ɵscavenger = this;

        /* Mock once on the class. */
        if (prototype.ɵscavengerWasHere) {
            return;
        }

        const decorateOnDestroy = (onDestroy) => {
            return function () {

                this.ɵscavenger.unsubscribe();

                if (onDestroy) {
                    onDestroy.bind(this)();
                }

            };
        };

        const ivyComponentDef = component.constructor['ɵcmp'];

        /* Is IVy. */
        if (ivyComponentDef != null && ivyComponentDef.onDestroy) {
            ivyComponentDef.onDestroy = decorateOnDestroy(ivyComponentDef.onDestroy);
        } else if(prototype.ngOnDestroy) {
            prototype.ngOnDestroy = decorateOnDestroy(prototype.ngOnDestroy);
        }

        prototype.ɵscavengerWasHere = true;

    }

    /**
     * `onPreSubscription` is needed in order to avoid synchronous fire hose observables which wouldn't be able
     * to unsubscribe themselves.
     * This is one way of having an opaque token that lets us know which subscription we are talking about.
     * Fire hose observables drain themselves before returning the closed subscription.
     *
     * @param onPreSubscription: called when the pipe is applied.
     * @param onSubscription: called when the subscription succeeds.
     * @private
     */
    private _trackSubscription<T>({isPreSubscriptionInProgress, onPreSubscription, onSubscription}: {
        isPreSubscriptionInProgress: (args: { preSubscription: PreSubscriptionOpaqueToken }) => boolean,
        onPreSubscription: (args: { preSubscription: PreSubscriptionOpaqueToken }) => void,
        onSubscription: (args: { preSubscription: PreSubscriptionOpaqueToken, subscription: Subscription }) => void
    }): MonoTypeOperatorFunction<T> {

        return source$ => new Observable(subscriber => {

            const preSubscription = subscriber;

            onPreSubscription({preSubscription});

            /* Let everything go through... */
            const subscription = source$
                .pipe(
                    takeWhile(() => {

                        /* We have a subscription now so we don't care about pre-subscriptions any more. */
                        if (subscription != null) {
                            return true;
                        }

                        return isPreSubscriptionInProgress({preSubscription});

                    })
                )
                .subscribe(subscriber);

            /* ...but grab subscription. */
            onSubscription({preSubscription, subscription});

            return subscription;

        });

    }

}
