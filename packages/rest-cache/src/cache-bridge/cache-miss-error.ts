/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { BaseError } from '../errors/base-error';

export class CacheMissError extends BaseError {

    constructor(message: string = 'Cache miss error.') {
        super(message);
    }

}
