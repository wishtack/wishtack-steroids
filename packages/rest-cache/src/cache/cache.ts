/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

export interface Cache {

    get(args: {key: string}): Observable<string>;
    set(args: {key: string, value: string}): Observable<void>;

}
