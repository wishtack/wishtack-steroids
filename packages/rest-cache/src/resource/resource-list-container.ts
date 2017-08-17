/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { DataListContainer } from '../client/data-list-container';

export class ResourceListContainer extends DataListContainer {

    isFromCache: boolean;

    constructor(args: ResourceListContainer) {

        super(args);

        this.isFromCache = args.isFromCache;

    }

}
