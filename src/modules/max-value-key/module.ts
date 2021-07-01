/*
 * Gets the key of the maximum value in the object,
 * or an array of keys if an array of objects is passed.
 */
import ResponsiveValues from '../../core';
import {
    ResponsiveObject,
    ResponsiveString,
    ResponsiveUndefined
} from '../../index';

export default function() {
    function maxValueKey(object: ResponsiveObject): ResponsiveString;
    function maxValueKey(objects: ResponsiveObject[]): ResponsiveString[] | ResponsiveUndefined;
    function maxValueKey(this: ResponsiveValues, arg: ResponsiveObject | ResponsiveObject[]): ResponsiveString | ResponsiveString[] | ResponsiveUndefined {
        if (Array.isArray(arg)) {
            return this.compress(arg.map((obj) => {
                if (!obj) {
                    return null;
                } else {
                    return maxValueKey(obj);
                }
            }) as (string | null)[]);
        } else if (arg) {
            return Object.entries(arg).reduce((result, current) => {
                if (typeof current[1] === 'number' && typeof result[1] === 'number') {
                    return current[1] > result[1] ? current : result;
                } else {
                    return result;
                }
            }, ['', Number.MIN_VALUE])[0] || null;
        }
    }

    return maxValueKey;
}
