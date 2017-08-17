/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { ResourceDescription } from '../resource/resource-description';
import { Data } from '../client/data';
import { DataListContainer } from '../client/data-list-container';
import { Params } from '../client/params';
import { Query } from '../client/query';

export interface CacheSerializer {

    getResourceKey(args: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): string;

    getResourceListKey(args: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): string;

    serializeData(args: {
        resourceDescription: ResourceDescription,
        data: Data,
        params?: Params,
        query?: Query
    }): string;

    serializeDataList(args: {
        resourceDescription: ResourceDescription,
        dataListContainer: DataListContainer,
        params?: Params,
        query?: Query
    }): string;

    deserializeData(args: { value: string }): Data;

    deserializeDataList(args: { value: string }): DataListContainer;

}
