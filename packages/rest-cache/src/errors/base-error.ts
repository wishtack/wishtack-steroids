/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */


const FixErrorPrototype = () => {

    return (klass) => {

        /* Override constructor. */
        const newKlass: any = function (...argList) { /* tslint:disable-line */

            /* Call original constructor. */
            klass.apply(this, argList);

        };

        /* https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md
         * #extending-built-ins-like-error-array-and-map-may-no-longer-work.
         * @hack: This hack prevents TypeScript from applying `Error` prototype to our class. */
        newKlass.prototype = klass.prototype;

        return newKlass;

    };

};

@FixErrorPrototype()
export class BaseError extends Error {

    private _nativeError: Error;

    constructor(message: string) {
        /* Cf. https://github.com/angular/angular => angular/modules/@angular/facade/src/errors.ts
         * Errors don't use current this, instead they create a new instance.
         * We have to do forward all of our api to the nativeInstance. */
        const nativeError = super(message) as any as Error;
        this._nativeError = nativeError;
    }

    get message() { return this._nativeError.message; }
    set message(message) { this._nativeError.message = message; }
    get name() { return this._nativeError.name; }
    get stack() { return (this._nativeError as any).stack; }
    set stack(value) { (this._nativeError as any).stack = value; }

}
