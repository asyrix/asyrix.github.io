import { isDefined, isNull, compare } from './helpers';

export type ResponsiveUndefined = undefined;
export type ResponsiveNull = null;
export type ResponsiveEmpty = ResponsiveNull | ResponsiveUndefined;
export type ResponsiveNumber = number | ResponsiveEmpty;
export type ResponsiveString = string | ResponsiveEmpty;
export type ResponsiveObject = { [key: string]: unknown } | ResponsiveEmpty;
export type ResponsiveBoolean = boolean | ResponsiveEmpty;
export type ResponsiveValue = ResponsiveNumber | ResponsiveString | ResponsiveBoolean | ResponsiveObject;

/*
 * Gets an array of responsive values and replaces
 * null / undefined values with the nearest neighbour.
 */
export function fillGaps<T extends ResponsiveNumber[]>(responsive: T): T
export function fillGaps<T extends ResponsiveString[]>(responsive: T): T
export function fillGaps<T extends ResponsiveObject[]>(responsive: T): T
export function fillGaps<T extends ResponsiveBoolean[]>(responsive: T): T
export function fillGaps<T extends ResponsiveValue[]>(responsive: T): T
export function fillGaps(responsive: ResponsiveNumber[] | ResponsiveValue[]): ResponsiveNumber[] | ResponsiveValue[] {
    return responsive.map((value, idx) => {
        // Get the nearest neighbour if the value is null or undefined.
        if (!isDefined(value) || isNull(value)) {
            // Get the nearest right neighbour.
            const nextValue = responsive.slice(idx + 1).find((value) => isDefined(value) && !isNull(value));

            if (isDefined(nextValue)) {
                return nextValue;
            } else {
                // If right neighbour is not defined get the nearest left neighbour.
                const prevValue = responsive.slice(0, idx).reverse().find((value) => isDefined(value) && !isNull(value));

                if (isDefined(prevValue)) {
                    return prevValue;
                }
            }
        }

        return value;
    });
}

/*
 * Replaces duplicated values with nulls
 * and removes unnecessary nulls.
 */
export function compress<T extends ResponsiveValue[]>(responsive: T): T {
    return responsive
        // Removes unnecessary nulls from the end of the array
        .filter((value: ResponsiveValue, idx) => {
            return !(isNull(value) && responsive.slice(idx).every((value: ResponsiveValue) => isNull(value)));
        })
        // Replaces duplicated values with nulls
        .reduce((result: T, currValue, idx, arr) => {
            const prevValue = arr[idx - 1];
            const restFromCurrentIndex = [...new Set(arr.slice(idx))];

            if ((restFromCurrentIndex.length !== 1 || !compare(prevValue, currValue)) && !restFromCurrentIndex.every(val => isNull(val))) {
                if (isDefined(prevValue) && compare(prevValue, currValue)) {
                    result.push(null);
                } else {
                    result.push(currValue);
                }
            }

            return result;
        }, new Array() as T);
}

/*
 * Takes unlimited number of arrays and returns
 * an array of these arrays with unified length.
 * Missing places are filled by null.
 */
export function unifyArraysLength<T extends Array<ResponsiveValue[]>>(arraysToUnify: T): T {
    const maxLength: number = [...arraysToUnify].sort((a,b) => b.length - a.length)[0].length;
    const unifiedArrays = new Array() as T;

    arraysToUnify.forEach((array: ResponsiveValue[]) => {
        const clonedArray: ResponsiveValue[] = [...array];

        if (clonedArray.length < maxLength) {
            clonedArray.push(...new Array(maxLength - clonedArray.length));
        }

        unifiedArrays.push(clonedArray);
    });

    return unifiedArrays;
}

/*
 * Adds two single responsive values if they are numbers,
 * or adds arrays of responsive values depending on the
 * passed arguments.
 */
export function sum<T extends ResponsiveNumber[]>(values: T[]): T
export function sum<T extends ResponsiveNumber>(values: T[]): T
export function sum<T extends (ResponsiveNumber)[] | ResponsiveNumber>(values: Array<ResponsiveNumber[] | ResponsiveNumber>): ResponsiveNumber[] | ResponsiveNumber {
    if (!values.find(val => Array.isArray(val))) {
        const filled = fillGaps(values as ResponsiveNumber[]);

        return filled.reduce((prevValue: ResponsiveNumber, currValue: ResponsiveNumber) => {
            return (prevValue  || 0) + (currValue || 0);
        });
    } else {
        const unified = unifyArraysLength(values as Array<ResponsiveValue[]>) as Array<ResponsiveNumber[]>;
        const filled = unified.map(arr => fillGaps(arr));

        return filled.reduce((result: ResponsiveNumber[], currValue: ResponsiveNumber[]) => {
            return currValue.map((value: ResponsiveNumber, idx: number) => {
                return (value || 0) + (result[idx] || 0);
            });
        });
    }
}

/*
 * Gets the key of the maximum value in the object,
 * or an array of keys if an array of objects is passed.
 */
export function maxValueKey(arg: ResponsiveObject): string | null | void
export function maxValueKey(arg: ResponsiveObject[]): (string | null)[] | void
export function maxValueKey(arg: ResponsiveObject | ResponsiveObject[]): string | null | (string | null)[] | void {
    if (Array.isArray(arg)) {
        return arg.map((obj) => {
            if (!obj) {
                return null;
            } else {
                return maxValueKey(obj);
            }
        }) as (string | null)[];
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

/*
 * Gets the container width, or an array of breakpoints
 * with container widths
 */
export function getContainerWidth(containerMargin: ResponsiveNumber | ResponsiveNull, isSnappedToEdge: ResponsiveBoolean): ResponsiveString
export function getContainerWidth(containerMargin: ResponsiveNumber, isSnappedToEdge: (ResponsiveBoolean | ResponsiveNull)[]): (ResponsiveString | ResponsiveNull)[]
export function getContainerWidth(containerMargin: (ResponsiveNumber | ResponsiveNull)[], isSnappedToEdge: ResponsiveBoolean): (ResponsiveString | ResponsiveNull)[]
export function getContainerWidth(containerMargin: (ResponsiveNumber | ResponsiveNull)[], isSnappedToEdge: (ResponsiveBoolean | ResponsiveNull)[]): (ResponsiveString | ResponsiveNull)[]
export function getContainerWidth(containerMargin: ResponsiveNumber | ResponsiveNull | (ResponsiveNumber | ResponsiveNull)[], isSnappedToEdge: ResponsiveBoolean | (ResponsiveBoolean | ResponsiveNull)[]): ResponsiveString | (ResponsiveString | ResponsiveNull)[] | ResponsiveUndefined {
    // containerMargin is array, isSnappedToEdge is value
    if (Array.isArray(containerMargin) && !Array.isArray(isSnappedToEdge)) {
        const isSnappedToEdgeNormalized: (ResponsiveBoolean | ResponsiveNull)[] = Array(containerMargin.length).fill(isSnappedToEdge);
        const unified = unifyArraysLength([fillGaps(containerMargin), fillGaps(isSnappedToEdgeNormalized)]);

        return unified[0].map((margin, idx) => {
            if (isSnappedToEdgeNormalized[idx]) return '100%';

            return `calc(100% - ${(typeof margin === 'number' ? margin : 0) / 2}px)`
        });
    // containerMargin is value, isSnappedToEdge is array
    } else if (!Array.isArray(containerMargin) && Array.isArray(isSnappedToEdge)) {
        const containerMarginNormalized = Array(isSnappedToEdge.length).fill(containerMargin);
        const unified = unifyArraysLength([fillGaps(containerMarginNormalized), fillGaps(isSnappedToEdge)]);

        return unified[0].map((margin, idx) => {
            if (isSnappedToEdge[idx]) return '100%';

            return `calc(100% - ${(typeof margin === 'number' ? margin : 0) / 2}px)`
        });
    // containerMargin is array, isSnappedToEdge is array
    } else if (Array.isArray(containerMargin) && Array.isArray(isSnappedToEdge)) {
        const unified = unifyArraysLength([containerMargin, isSnappedToEdge]);
        const filled = unified.map(arr => fillGaps(arr));

        return filled[0].map((margin, idx) => {
            if (isSnappedToEdge[idx]) return '100%';

            return `calc(100% - ${(typeof margin === 'number' ? margin : 0) / 2}px)`
        });
    // containerMargin is value, isSnappedToEdge is value
    } else {
        if (isSnappedToEdge) {
            return '100%';
        }

        return `calc(100% - ${(typeof containerMargin === 'number' ? containerMargin : 0) / 2}px)`;
    }
}
