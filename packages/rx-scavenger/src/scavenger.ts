/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { OnDestroy } from '@angular/core';
import { OperatorFunction } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

/**
 * `OnDestroy` method is optional.
 */
export type ComponentWithOptionalOnDestroy = any | OnDestroy;

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

    collect<T>(): OperatorFunction<T, T> {
        return this._trackSubscription(subscription => this._subscriptionList.push(subscription));
    }

    collectByKey<T>(key: string): OperatorFunction<T, T> {

        if (typeof key !== 'string' || key === '') {
            throw new InvalidKeyError(key);
        }

        return this._trackSubscription(subscription => {

            const previousSubscription = this._subscriptionMap.get(key);

            if (previousSubscription != null) {
                previousSubscription.unsubscribe();
            }

            this._subscriptionMap.set(key, subscription);

        });

    }

    unsubscribe() {

        const subscriptionList = [
            ...this._subscriptionList,
            ...Array.from(this._subscriptionMap.values())
        ];

        subscriptionList.forEach(subscription => subscription.unsubscribe());

        this._subscriptionList = [];
        this._subscriptionMap.clear();

    }

    private _trackSubscription<T>(callback: (subscription: Subscription) => void): OperatorFunction<T, T> {

        return source$ => {

            return new Observable(observer => {

                /* Let everything go through... */
                const subscription = source$.subscribe(observer);

                /* ...but grab subscription. */
                callback(subscription);

                return subscription;

            });

        };

    }


}
