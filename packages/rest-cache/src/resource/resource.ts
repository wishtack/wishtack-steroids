/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Data } from '../client/data';

export class Resource {

    data: Data;
    isFromCache: boolean;

    constructor(args: Resource) {
        this.data = args.data;
        this.isFromCache = args.isFromCache;
    }

}
