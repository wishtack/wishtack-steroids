/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

export class BaseError {

    constructor(public message: string) {}

    get name() {
        return this.constructor.name;
    }

    toString() {
        return `${this.name}: ${this.message}`;
    }

}
