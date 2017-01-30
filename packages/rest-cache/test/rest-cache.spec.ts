/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { CacheBridge } from '../src/cache-bridge/cache-bridge';
import { CacheDefault } from '../src/cache/cache-default';
import { CacheMissError } from '../src/cache-bridge/cache-miss-error';
import { Resource } from '../src/resource/resource';
import { ResourceListContainer } from '../src/resource/resource-list-container';
import { Client } from '../src/client/client';
import { DataListContainer } from '../src/client/data-list-container';
import { ResourceDescription } from '../src/resource/resource-description';
import { RestCache } from '../src/rest-cache';

describe('RestCache', () => {

    let cacheBridge: CacheBridge;
    let client: Client;

    beforeEach(() => {

        cacheBridge = jasmine.createSpyObj('cache', [
            'get',
            'set'
        ]);

        client = jasmine.createSpyObj('client', [
            'delete',
            'get',
            'getList',
            'patch',
            'post'
        ]);

    });

    it('should proxy call to client', () => {

        let observable = Observable.from([]);
        let resourceDescription: ResourceDescription;
        let restCache = new RestCache({
            client: client
        });

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        ( <jasmine.Spy> client.delete ).and.returnValue(observable);

        expect(restCache.delete({resourceDescription: resourceDescription})).toBe(observable);

    });

    it('should get resource from client on cache miss', () => {

        let data;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        restCache = new RestCache({
            cache: new CacheDefault({
                cacheBridge: cacheBridge
            }),
            client: client
        });

        data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mocking `client.get`. */
        ( <jasmine.Spy> client.get ).and.returnValue(Observable.from([data]));

        /* Mocking `cache.get` MISS. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cacheBridge.set ).and.returnValue(Observable.from([undefined]));

        restCache.get({
            resourceDescription: resourceDescription,
            params: {
                blogId: 'BLOG_ID_1'
            }
        })
            .subscribe(
                (resource) => resultList.push(resource),
                (_error) => error = _error,
                () => isComplete = true
            );

        expect(error).toBeUndefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([
            new Resource({
                isFromCache: false,
                data: data,
            })
        ]);

        /* Check that cache has been used. */
        expect(cacheBridge.get).toHaveBeenCalledTimes(1);
        expect(cacheBridge.get).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/:blogId',
                params: {
                    blogId: 'BLOG_ID_1'
                }
            })
        });

        /* Check that data has been saved in cache. */
        expect(cacheBridge.set).toHaveBeenCalledTimes(1);
        expect(cacheBridge.set).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/:blogId',
                params: {
                    blogId: 'BLOG_ID_1'
                }
            }),
            value: JSON.stringify(data)
        });

    });

    it('should get resource list from client on cache miss', () => {

        let dataListContainer;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        restCache = new RestCache({
            cache: new CacheDefault({
                cacheBridge: cacheBridge
            }),
            client: client
        });

        dataListContainer = new DataListContainer({
            data: [
                {
                    id: 'BLOG_ID_1',
                    title: 'BLOG_TITLE_1'
                },
                {
                    id: 'BLOG_ID_2',
                    title: 'BLOG_TITLE_2'
                }
            ],
            meta: {
                offset: 0,
                limit: 10
            }
        });

        /* Mocking `client.getList`. */
        ( <jasmine.Spy> client.getList ).and.returnValue(Observable.from([dataListContainer]));

        /* Mocking `cache.get` MISS. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cacheBridge.set ).and.returnValue(Observable.from([undefined]));

        restCache.getList({
            resourceDescription: resourceDescription,
            query: {
                offset: 0,
                limit: 10
            }
        })
            .subscribe(
                (resourceListContainer) => resultList.push(resourceListContainer),
                (_error) => error = _error,
                () => isComplete = true
            );

        expect(error).toBeUndefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([
            new ResourceListContainer({
                isFromCache: false,
                data: dataListContainer.data,
                meta: dataListContainer.meta
            })
        ]);

        /* Check that cache has been used. */
        expect(cacheBridge.get).toHaveBeenCalledTimes(1);
        expect(cacheBridge.get).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs',
                query: {
                    offset: 0,
                    limit: 10
                }
            })
        });

        /* Check that data has been saved in cache. */
        expect(cacheBridge.set).toHaveBeenCalledTimes(1);
        expect(cacheBridge.set).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs',
                query: {
                    offset: 0,
                    limit: 10
                }
            }),
            value: JSON.stringify(dataListContainer)
        });

    });

    xit('should not get resource from client on cache hit if refresh is false', () => {

    });

    xit('should not get resource list from client on cache hit if refresh is false', () => {

    });

    xit('should get resource from client on cache hit if refresh is true', () => {

    });

    xit('should get resource list from client on cache hit if refresh is true', () => {

    });

    xit('should get resource from cached list', () => {

    });

    xit('should get resource from parent embedded list', () => {

    });

    xit('should forbid missing params', () => {

    });

    xit('should forbid superfluous params', () => {

    });

});
