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

        /* Mocking `cacheBridge.get` MISS. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `client.get`. */
        ( <jasmine.Spy> client.get ).and.returnValue(Observable.from([data]));

        /* Mocking `cacheBridge.set`. */
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

        /* Mocking `cacheBridge.get` MISS. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `client.getList`. */
        ( <jasmine.Spy> client.getList ).and.returnValue(Observable.from([dataListContainer]));

        /* Mocking `cacheBridge.set`. */
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
        throw new Error('Not implemented error!');
    });

    xit('should not get resource list from client on cache hit if refresh is false', () => {
        throw new Error('Not implemented error!');
    });

    it('should get resource from client on cache hit if refresh is true', () => {

        let data;
        let dataUpdated;
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

        dataUpdated = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1_UPDATE'
        };

        /* Mocking `cacheBridge.get` HIT. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.from([JSON.stringify(data)]));

        /* Mocking `client.get`. */
        ( <jasmine.Spy> client.get ).and.returnValue(Observable.from([dataUpdated]));

        /* Mocking `cacheBridge.set`. */
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
                isFromCache: true,
                data: data,
            }),
            new Resource({
                isFromCache: false,
                data: dataUpdated,
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

        /* Check that client has been called. */
        expect(client.get).toHaveBeenCalledTimes(1);
        expect(client.get).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs/:blogId',
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that data has been saved in cache. */
        expect(cacheBridge.get).toHaveBeenCalledTimes(1);
        expect(cacheBridge.get).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/:blogId',
                params: {
                    blogId: 'BLOG_ID_1'
                }
            })
        });

    });

    it('should get resource list from client on cache hit if refresh is true', () => {

        let dataListContainer;
        let dataListContainerUpdated;
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

        dataListContainerUpdated = new DataListContainer({
            data: [
                {
                    id: 'BLOG_ID_1',
                    title: 'BLOG_TITLE_1_UPDATE'
                },
                {
                    id: 'BLOG_ID_2',
                    title: 'BLOG_TITLE_2_UPDATE'
                }
            ],
            meta: {
                offset: 0,
                limit: 10
            }
        });

        /* Mocking `cacheBridge.get` HIT. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.from([JSON.stringify(dataListContainer)]));

        /* Mocking `client.getList`. */
        ( <jasmine.Spy> client.getList ).and.returnValue(Observable.from([dataListContainerUpdated]));

        /* Mocking `cacheBridge.set`. */
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
                isFromCache: true,
                data: dataListContainer.data,
                meta: dataListContainer.meta
            }),
            new ResourceListContainer({
                isFromCache: false,
                data: dataListContainerUpdated.data,
                meta: dataListContainerUpdated.meta
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

        /* Check that client has been called. */
        expect(client.getList).toHaveBeenCalledTimes(1);
        expect(client.getList).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs'
        }));

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
            value: JSON.stringify(dataListContainerUpdated)
        });

    });

    xit('should get resource from cached list', () => {
        throw new Error('Not implemented error!');
    });

    xit('should get resource from parent embedded list', () => {
        throw new Error('Not implemented error!');
    });

    xit('should forbid missing params', () => {
        throw new Error('Not implemented error!');
    });

    xit('should forbid superfluous params', () => {
        throw new Error('Not implemented error!');
    });

});
