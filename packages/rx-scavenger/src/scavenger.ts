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

export class Scavenger {

    private _subscriptionList: Subscription[] = [];

    unsubscribe() {
        this._subscriptionList.forEach(subscription => subscription.unsubscribe());
        this._subscriptionList = [];
    }

    collect<T>(): OperatorFunction<T, T> {

        return source$ => {

            return new Observable(observer => {

                /* Let everything go through... */
                const subscription = source$.subscribe(observer);

                /* ...but grab subscription. */
                this._subscriptionList = [...this._subscriptionList, subscription];

                return subscription;

            });

        };

    }

    collectByKey<T>(key: string): OperatorFunction<T, T> {
        throw new Error('Not implemented yet!');
    }
}
