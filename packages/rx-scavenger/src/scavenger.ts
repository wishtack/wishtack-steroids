/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { OnDestroy } from '@angular/core';
import { OperatorFunction } from 'rxjs';

/**
 * `OnDestroy` method is optional.
 */
export type ComponentWithOptionalOnDestroy = any | OnDestroy;

export class Scavenger {

    unsubscribe() {
        throw new Error('Not implemented!');
    }

    scavenge<T>(): OperatorFunction<T, T> {
        throw new Error('Not implemented!');
    }


}
