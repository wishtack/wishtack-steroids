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
import { CacheMissError } from '../cache-bridge/cache-miss-error';

export class CacheDefault implements Cache {

    private static _IS_PARTIAL_KEY = '__restCacheIsPartial__';
    private _cacheBridge: CacheBridge;
    private _cacheSerializer: CacheSerializer;

    constructor({cacheBridge, cacheSerializer = new CacheSerializerDefault()}: {
        cacheBridge: CacheBridge,
        cacheSerializer?: CacheSerializer
    }) {
        this._cacheBridge = cacheBridge;
        this._cacheSerializer = cacheSerializer;
    }

    get({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<Data> {

        return this._cacheBridge
            .get({
                key: this._cacheSerializer.getResourceKey({resourceDescription, params, query})
            })
            .catch((error) => {

                if (!(error instanceof CacheMissError)) {
                    throw error;
                }

                /* If resource is not found, try to find the partial one. */
                /* Partial resources are created when caching resource lists. */
                return this._cacheBridge.get({
                    key: this._cacheSerializer.getResourceKey({
                        resourceDescription,
                        params,
                        query: Object.assign({}, query, {[CacheDefault._IS_PARTIAL_KEY]: true})
                    })
                });

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

        let {resourceDescription, dataListContainer, params} = args;

        /* Set all the resources "simultaneously" in the cache... */
        return Observable
            .merge(...dataListContainer.data.map((data) => this.set({
                resourceDescription,
                data: data,
                params: {
                    ...params,
                    [resourceDescription.getParamKey()]: data.id
                },
                query: {
                    [CacheDefault._IS_PARTIAL_KEY]: true
                }
            })))
            /* ...and wait for last observable to be complete... */
            .last()
            /* ...before setting the data id list in the cache... */
            .flatMap(() => this._cacheBridge
                .set({
                    key: this._cacheSerializer.getResourceListKey(args),
                    value: this._cacheSerializer.serializeDataList({
                        resourceDescription: resourceDescription,
                        dataListContainer: new DataListContainer({
                            data: dataListContainer.data.map((data) => data.id),
                            meta: dataListContainer.meta
                        }),
                        params: args.params,
                        query: args.query
                    })
                })
            );

    }

}
