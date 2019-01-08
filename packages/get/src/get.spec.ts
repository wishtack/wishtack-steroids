
import { get } from './get';

test('get should return undefined if property not found', () => {

    const value: {
        a?: {
            b?: string
        }
    } = {};

    expect(get(value, 'a', 'b')).toEqual(undefined);

});

test('get should return the value if property is found', () => {

    const value: {
        a?: {
            b?: string
        }
    } = {
        a: {
            b: 'VALUE'
        }
    };

    expect(get(value, 'a', 'b')).toEqual('VALUE');

});
