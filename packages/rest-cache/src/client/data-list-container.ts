/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

export class Meta {
    [key: string]: string;
}

export class DataListContainer {

    data: any[];
    meta?: Meta;

    constructor({data, meta}: DataListContainer) {
        this.data = data;
        this.meta = meta;
    }

}
