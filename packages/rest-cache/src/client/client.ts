/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs/Observable';

import { Data } from './data';
import { DataListContainer } from './data-list-container';
import { Params } from './params';
import { Query } from './query';

export interface Client {

    delete(args: {path: string, params?: Params, query?: Query}): Observable<void>;
    get(args: {path: string, params?: Params, query?: Query}): Observable<Data>;
    getList(args: {path: string, params?: Params, query?: Query}): Observable<DataListContainer>;
    patch(args: {path: string, data: Data, params?: Params, query?: Query}): Observable<Data>;
    post(args: {path: string, data: Data, params?: Params, query?: Query}): Observable<Data>;

}
