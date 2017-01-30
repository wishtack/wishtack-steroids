/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Data } from '../client/data';
import { DataListContainer } from '../client/data-list-container';
import { Params } from '../client/params';
import { Query } from '../client/query';
import { ResourceDescription } from '../resource/resource-description';
import { CacheSerializer } from './cache-serializer';

export class CacheSerializerDefault implements CacheSerializer {

    getResourceKey({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): string {
        return this._serialize({
            data: {
                path: resourceDescription.interpolateDetailPath({params: params}),
                query: query
            }
        });
    }

    getResourceListKey({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): string {

        return this._serialize({
            data: {
                path: resourceDescription.interpolateListPath({params: params}),
                query: query
            }
        });

    }

    serializeData({resourceDescription, data, params, query}: {
        resourceDescription: ResourceDescription,
        data: Data,
        params?: Params,
        query?: Query
    }): string {
        return this._serialize({data: data});
    }

    serializeDataList({resourceDescription, dataListContainer, params, query}: {
        resourceDescription: ResourceDescription,
        dataListContainer: DataListContainer,
        params?: Params,
        query?: Query
    }): string {
        return this._serialize({data: dataListContainer});
    }

    deserializeData(args: { value: string }): Data {
        return this._deserialize(args);
    }

    deserializeDataList(args: { value: string }): DataListContainer {
        return new DataListContainer(this._deserialize(args));
    }

    private _serialize({data}: { data: any }): string {
        return JSON.stringify(data);
    }

    private _deserialize({value}: { value: string }): any {
        return JSON.parse(value);
    }

}
