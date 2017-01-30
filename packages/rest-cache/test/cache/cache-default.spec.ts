/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { Cache } from '../../src/cache/cache';
import { CacheDefault } from '../../src/cache/cache-default';
import { CacheBridge } from '../../src/cache-bridge/cache-bridge';
import { DataListContainer } from '../../src/client/data-list-container';
import { ResourceDescription } from '../../src/resource/resource-description';

describe('CacheDefault', () => {

    let blogDescription: ResourceDescription;
    let postDescription: ResourceDescription;
    let cache: Cache;
    let cacheBridge: CacheBridge;

    beforeEach(() => {

        blogDescription = new ResourceDescription({
            path: '/blogs/:blogId'
        });

        postDescription = new ResourceDescription({
            path: '/posts/:postId',
            parent: blogDescription
        });

        cacheBridge = jasmine.createSpyObj('cacheBridge', ['get', 'set']);

        cache = new CacheDefault({
            cacheBridge: cacheBridge
        });

    });

    it('should set resource in cache using interpolated path as key', () => {

        let isComplete;
        let error;
        let resultList = [];

        let data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mock `cacheBridge.set`. */
        ( <jasmine.Spy> cacheBridge.set ).and.returnValue(Observable.from([undefined]));

        /* Set data in cache. */
        cache
            .set({
                resourceDescription: blogDescription,
                data: data,
                params: {
                    blogId: 'BLOG_ID_1'
                }
            })
            .subscribe(
                (result) => resultList.push(result),
                (_error) => error = _error,
                () => isComplete = true
            );

        /* No data expected and observable should emit only one value. */
        expect(error).not.toBeDefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([undefined]);

        expect(cacheBridge.set).toHaveBeenCalledTimes(1);
        expect(cacheBridge.set).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1'
            }),
            value: JSON.stringify(data)
        });

    });

    it('should get resource from cache using interpolated path as key', () => {

        let isComplete;
        let error;
        let resultList = [];

        let data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mock `cacheBridge.get`. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.from([JSON.stringify(data)]));

        /* Get data from cache. */
        cache
            .get({
                resourceDescription: blogDescription,
                params: {
                    blogId: 'BLOG_ID_1'
                }
            })
            .subscribe(
                (result) => resultList.push(result),
                (_error) => error = _error,
                () => isComplete = true
            );

        /* No data expected and observable should emit only one value. */
        expect(error).not.toBeDefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([data]);

        expect(cacheBridge.get).toHaveBeenCalledTimes(1);
        expect(cacheBridge.get).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1'
            })
        });

    });

    it('should split resource list in cache', () => {

        let isComplete;
        let error;
        let resultList = [];

        let dataListContainer = new DataListContainer({
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

        /* Mock `cacheBridge.set`. */
        ( <jasmine.Spy> cacheBridge.set ).and.returnValue(Observable.from([undefined]));

        /* Store a data list in cache. */
        cache
            .setList({
                resourceDescription: blogDescription,
                dataListContainer: dataListContainer
            })
            .subscribe(
                (result) => resultList.push(result),
                (_error) => error = _error,
                () => isComplete = true
            );

        /* No data expected and observable should emit only one value. */
        expect(error).not.toBeDefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([undefined]);

        expect(cacheBridge.set).toHaveBeenCalledTimes(3);

        expect(( <jasmine.Spy> cacheBridge.set ).calls.argsFor(0)[0]).toEqual({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1'
            }),
            value: JSON.stringify(dataListContainer.data[0])
        });

        expect(( <jasmine.Spy> cacheBridge.set ).calls.argsFor(1)[0]).toEqual({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_2'
            }),
            value: JSON.stringify(dataListContainer.data[1])
        });

        expect(( <jasmine.Spy> cacheBridge.set ).calls.argsFor(2)[0]).toEqual({
            key: JSON.stringify({
                path: '/blogs',
            }),
            value: JSON.stringify({
                data: dataListContainer.data.map((data) => data.id),
                meta: dataListContainer.meta
            })
        });

    });

    it('should set child resource in cache using interpolated path as key', () => {

        let isComplete;
        let error;
        let resultList = [];

        let data = {
            id: 'POST_ID_1',
            title: 'POST_TITLE_1'
        };

        /* Mock `cacheBridge.set`. */
        ( <jasmine.Spy> cacheBridge.set ).and.returnValue(Observable.from([undefined]));

        /* Set data in cache. */
        cache
            .set({
                resourceDescription: postDescription,
                data: data,
                params: {
                    blogId: 'BLOG_ID_1',
                    postId: 'POST_ID_1'
                }
            })
            .subscribe(
                (result) => resultList.push(result),
                (_error) => error = _error,
                () => isComplete = true
            );

        /* No data expected and observable should emit only one value. */
        expect(error).not.toBeDefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([undefined]);

        expect(cacheBridge.set).toHaveBeenCalledTimes(1);
        expect(cacheBridge.set).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1/posts/POST_ID_1'
            }),
            value: JSON.stringify(data)
        });

    });

    it('should get child resource from cache using interpolated path as key', () => {

        let isComplete;
        let error;
        let resultList = [];

        let data = {
            id: 'POST_ID_1',
            title: 'POST_TITLE_1'
        };

        /* Mock `cacheBridge.get`. */
        ( <jasmine.Spy> cacheBridge.get ).and.returnValue(Observable.from([JSON.stringify(data)]));

        /* Get data from cache. */
        cache
            .get({
                resourceDescription: postDescription,
                params: {
                    blogId: 'BLOG_ID_1',
                    postId: 'POST_ID_1'
                }
            })
            .subscribe(
                (result) => resultList.push(result),
                (_error) => error = _error,
                () => isComplete = true
            );

        /* No data expected and observable should emit only one value. */
        expect(error).not.toBeDefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([data]);

        expect(cacheBridge.get).toHaveBeenCalledTimes(1);
        expect(cacheBridge.get).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1/posts/POST_ID_1'
            })
        });

    });

    it('should split child resource list in cache', () => {

        let isComplete;
        let error;
        let resultList = [];

        let dataListContainer = new DataListContainer({
            data: [
                {
                    id: 'POST_ID_1',
                    title: 'POST_TITLE_1'
                },
                {
                    id: 'POST_ID_2',
                    title: 'POST_TITLE_2'
                }
            ],
            meta: {
                offset: 0,
                limit: 10
            }
        });

        /* Mock `cacheBridge.set`. */
        ( <jasmine.Spy> cacheBridge.set ).and.returnValue(Observable.from([undefined]));

        /* Store a data list in cache. */
        cache
            .setList({
                resourceDescription: postDescription,
                dataListContainer: dataListContainer,
                params: {
                    blogId: 'BLOG_ID_1'
                }
            })
            .subscribe(
                (result) => resultList.push(result),
                (_error) => error = _error,
                () => isComplete = true
            );

        /* No data expected and observable should emit only one value. */
        expect(error).not.toBeDefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([undefined]);

        expect(cacheBridge.set).toHaveBeenCalledTimes(3);

        expect(( <jasmine.Spy> cacheBridge.set ).calls.argsFor(0)[0]).toEqual({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1/posts/POST_ID_1'
            }),
            value: JSON.stringify(dataListContainer.data[0])
        });

        expect(( <jasmine.Spy> cacheBridge.set ).calls.argsFor(1)[0]).toEqual({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1/posts/POST_ID_2'
            }),
            value: JSON.stringify(dataListContainer.data[1])
        });

        expect(( <jasmine.Spy> cacheBridge.set ).calls.argsFor(2)[0]).toEqual({
            key: JSON.stringify({
                path: '/blogs/BLOG_ID_1/posts',
            }),
            value: JSON.stringify({
                data: dataListContainer.data.map((data) => data.id),
                meta: dataListContainer.meta
            })
        });

    });

    xit('should get child resource from parent embedded list', () => {
        throw new Error('Not implemented error!');
    });

});
