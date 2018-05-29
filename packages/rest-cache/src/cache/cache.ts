/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { ResourceDescription } from '../resource/resource-description';
import { DataListContainer } from '../client/data-list-container';
import { Data } from '../client/data';
import { Params } from '../client/params';
import { Query } from '../client/query';

export interface Cache {

    get(args: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<Data>;

    getList(args: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<DataListContainer>;

    set(args: {
        resourceDescription: ResourceDescription,
        data: Data,
        params?: Params,
        query?: Query
    }): Observable<void>;

    setList(args: {
        resourceDescription: ResourceDescription,
        dataListContainer: DataListContainer,
        params?: Params,
        query?: Query
    }): Observable<void>;

}
