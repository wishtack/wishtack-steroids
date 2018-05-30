/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subscriber, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

/**
 * `OnDestroy` method is optional.
 */
export type ComponentWithOptionalOnDestroy = any | OnDestroy;

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

export class Scavenger {

    private _subscriptionMap = new Map<string, Subscription>();
    private _subscriptionList: Subscription[] = [];
    private _preSubscriptionList = [];
    private _preSubscriptionMap = new Map<string, PreSubscriptionOpaqueToken>();

    constructor(component: ComponentWithOptionalOnDestroy = null) {
        this._tryRegisterNgOnDestroyHook(component);
    }

    collect<T>(): MonoTypeOperatorFunction<T> {
        return this._trackSubscription({
            isPreSubscriptionInProgress: ({preSubscription}) => {
                /* Pre-subscription is still there which means that we still didn't have a subscription
                 * and the pre-subscription has not been interrupted. */
                return this._preSubscriptionList.indexOf(preSubscription) !== -1;
            },
            onPreSubscription: ({preSubscription}) => this._preSubscriptionList.push(preSubscription),
            onSubscription: ({preSubscription, subscription}) => {

                this._subscriptionList.push(subscription);

                /* Remove `preSubscription` now that we have the subscription for performance's sake
                 * in order to avoid */
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
            isPreSubscriptionInProgress: () => true,
            onPreSubscription: ({preSubscription}) => {},
            onSubscription: ({subscription}) => {

                const previousSubscription = this._subscriptionMap.get(key);

                if (previousSubscription != null) {
                    previousSubscription.unsubscribe();
                }

                this._subscriptionMap.set(key, subscription);

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

    private _tryRegisterNgOnDestroyHook(component: ComponentWithOptionalOnDestroy) {

        let originalNgOnDestroy;

        if (component == null) {
            return;
        }

        /* Overriding ngOnDestroy to auto unsubscribe from all observables. */
        if (component.ngOnDestroy != null) {
            originalNgOnDestroy = component.ngOnDestroy.bind(component);
        }

        component.ngOnDestroy = () => {

            this.unsubscribe();

            if (originalNgOnDestroy != null) {
                originalNgOnDestroy();
            }

        };

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
        isPreSubscriptionInProgress: (args: {preSubscription: PreSubscriptionOpaqueToken}) => boolean,
        onPreSubscription: (args: {preSubscription: PreSubscriptionOpaqueToken}) => void,
        onSubscription: (args: {preSubscription: PreSubscriptionOpaqueToken, subscription: Subscription}) => void
    }): MonoTypeOperatorFunction<T> {

        return source$ => new Observable(subscriber => {

            const preSubscription = subscriber;

            onPreSubscription({preSubscription});

            /* Let everything go through... */
            const subscription = source$
                .pipe(
                    /* @TODO: rename pre-subscription has not been interrupted. */
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
