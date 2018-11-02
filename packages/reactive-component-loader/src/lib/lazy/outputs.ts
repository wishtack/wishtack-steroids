/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

export interface Outputs {
    [key: string]: (...args) => void;
}
