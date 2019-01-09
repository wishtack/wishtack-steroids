/**
 * A typed functional alternative to Optional Chaining Operator (a.k.a. Safe Navigation Operator).
 * Cf. https://github.com/Microsoft/TypeScript/issues/16
 * Cf. https://github.com/tc39/proposal-optional-chaining
 */
export function get<
    T,
    A extends keyof T
    >(
        data: T,
        ...properties: [A]): T[A];
export function get<
    T,
    A extends keyof T,
    B extends keyof T[A]
    >(
    data: T,
    ...properties: [A, B]): T[A][B];
export function get<
    T,
    A extends keyof T,
    B extends keyof T[A],
    C extends keyof T[A][B]
    >(
    data: T,
    ...properties: [A, B, C]): T[A][B][C];
export function get<
    T,
    A extends keyof T,
    B extends keyof T[A],
    C extends keyof T[A][B],
    D extends keyof T[A][B][C]
    >(
    data: T,
    ...properties: [A, B, C, D]): T[A][B][C][D];
export function get<
    T,
    A extends keyof T,
    B extends keyof T[A],
    C extends keyof T[A][B],
    D extends keyof T[A][B][C],
    E extends keyof T[A][B][C][D]
    >(
        data: T,
        ...properties: [A, B?, C?, D?, E?]): T[A][B][C][D][E] {

    return properties.reduce<any>((result, property) => {
        return result != null ? result[property] : undefined;
    }, data);

}
