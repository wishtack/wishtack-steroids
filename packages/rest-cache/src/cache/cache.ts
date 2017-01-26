/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

export interface Cache {

    get(args: {key: string}): Promise<string>;
    set(args: {key: string, value: string}): Promise<void>;


}
