/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Scavenger } from '../src/scavenger';

describe('Scavenger', () => {

    let subject$: BehaviorSubject<string>;

    beforeEach(() => {
        subject$ = new BehaviorSubject('Hello');
    });

    it('should collect subscription using pipe and unsubscribe', () => {

        const scavenger = new Scavenger();
        let value: string;

        const subscription = subject$
            .pipe(
                scavenger.collect()
            )
            .subscribe(_value => value = _value);

        expect(value).toBe('Hello');

        expect(subscription.closed).toBe(false);

        scavenger.unsubscribe();

        expect(subscription.closed).toBe(true);

        subject$.next('Bye');

        expect(value).toBe('Hello');

    });

    xit('should replace subscription if collected by key', () => {

        const scavenger = new Scavenger();

        const foo: {
            lastValue?: string,
            value$?: Observable<string>,
            subscription?: Subscription
        } = {};
        const john: typeof foo = {};

        /* Creating two observables. */
        foo.value$ = subject$.pipe(map(_value => `${_value} Foo`));
        john.value$ = subject$.pipe(map(_value => `${_value} John`));

        /* Subscribing to the foo's observable... */
        foo.subscription = foo.value$
            .pipe(
                /* ... but we collect the subscription by key this time. */
                scavenger.collectByKey('greetings')
            )
            .subscribe(value => foo.lastValue = value);

        expect(foo.lastValue).toBe('Hello Foo');
        expect(foo.subscription.closed).toBe(false);

        /* Subscribing to the john's observable... */
        john.subscription = john.value$
            .pipe(
                /* ... but we collect the subscription with the same key. */
                scavenger.collectByKey('greetings')
            )
            .subscribe(value => john.lastValue = value);

        /* New subscription should replace the previous one. */
        expect(foo.lastValue).toBe('Hello Foo');
        expect(foo.subscription.closed).toBe(true);

        expect(john.lastValue).toBe('Hello John');
        expect(john.subscription.closed).toBe(false);

        subject$.next('Bye');

        expect(foo.lastValue).toBe('Hello Foo');
        expect(foo.subscription.closed).toBe(true);

        expect(john.lastValue).toBe('Bye John');
        expect(john.subscription.closed).toBe(false);

        scavenger.unsubscribe();

        subject$.next('Are you there?');

        expect(foo.lastValue).toBe('Hello Foo');
        expect(foo.subscription.closed).toBe(true);

        expect(john.lastValue).toBe('Bye John');
        expect(john.subscription.closed).toBe(true);


    });

    xit('should create ngOnDestroy and unsubscribe', () => {

    });

    xit('should wrap ngOnDestroy and unsubscribe', () => {

    });

});
