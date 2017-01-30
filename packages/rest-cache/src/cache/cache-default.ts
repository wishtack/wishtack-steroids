/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';
import { CacheBridge } from '../cache-bridge/cache-bridge';
import { CacheSerializer } from '../cache-serializer/cache-serializer';
import { Data } from '../client/data';
import { DataListContainer } from '../client/data-list-container';
import { Params } from '../client/params';
import { Query } from '../client/query';
import { ResourceDescription } from '../resource/resource-description';
import { Cache } from './cache';
import { CacheSerializerDefault } from '../cache-serializer/cache-serializer-default';

export class CacheDefault implements Cache {

    private _cacheBridge: CacheBridge;
    private _cacheSerializer: CacheSerializer;

    constructor({cacheBridge, cacheSerializer = new CacheSerializerDefault()}: {
        cacheBridge: CacheBridge,
        cacheSerializer?: CacheSerializer
    }) {
        this._cacheBridge = cacheBridge;
        this._cacheSerializer = cacheSerializer;
    }

    get(args: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<Data> {

        return this._cacheBridge
            .get({
                key: this._cacheSerializer.getResourceKey(args)
            })
            .map((value) => this._cacheSerializer.deserializeData({value: value}));

    }

    getList(args: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<DataListContainer> {

        return this._cacheBridge
            .get({
                key: this._cacheSerializer.getResourceListKey(args)
            })
            .map((value) => this._cacheSerializer.deserializeDataList({value: value}));

    }

    set(args: {
        resourceDescription: ResourceDescription,
        data: Data,
        params?: Params,
        query?: Query
    }): Observable<void> {

        return this._cacheBridge
            .set({
                key: this._cacheSerializer.getResourceKey(args),
                value: this._cacheSerializer.serializeData(args)
            });

    }

    setList(args: {
        resourceDescription: ResourceDescription,
        dataListContainer: DataListContainer,
        params?: Params,
        query?: Query
    }): Observable<void> {

        return this._cacheBridge
            .set({
                key: this._cacheSerializer.getResourceListKey(args),
                value: this._cacheSerializer.serializeDataList(args)
            });

    }

}
