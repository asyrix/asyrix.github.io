import { isDefined, isNull, compare } from './helpers';

export type ResponsiveValue = number | string | { [key: string]: number | string | null } | boolean | null | undefined;

/*
 * Gets an array of responsive values and replaces
 * null / undefined values with the nearest neighbour.
 */
export function fillGaps<T extends ResponsiveValue[]>(responsive: T): T {
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
    }) as T;
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
        .reduce((result: T, currValue: ResponsiveValue, idx, arr): T => {
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
        }, [] as unknown as T);
}

/*
 * Takes unlimited number of arrays and returns
 * an array of these arrays with unified length.
 * Missing places are filled by null.
 */
export function unifyArraysLength<T extends ResponsiveValue[]>(...arraysToUnify: T[]): T[] {
    const maxLength: number = [...arraysToUnify].sort((a,b) => b.length - a.length)[0].length;
    const unifiedArrays: T[] = [];

    arraysToUnify.forEach((array) => {
        const clonedArray = [...array] as T;

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
export function sum<T extends ResponsiveValue[]>(...arrays: T[]): T
export function sum<T extends ResponsiveValue>(...values: T[]): T
export function sum<T>(...args: any[]): T {
    if (!args.find(arg => Array.isArray(arg))) {
        return args.reduce((prevValue, currValue): T => {
            if (isDefined(currValue) && currValue !== null && typeof currValue !== 'number') {
                throw new Error('One of the values is not a number.');
            }

            return ((prevValue as number || 0) + (currValue as number || 0)) as unknown as T;
        }) as T;
    } else {
        const unified = unifyArraysLength(...args);

        return unified.reduce((result, currValue): T => {
            return currValue.map((value: ResponsiveValue, idx: number) => {
                if (isDefined(value) && value !== null && typeof value !== 'number') {
                    throw new Error('One of the values is not a number.');
                }

                return (value as number || 0) + (result[idx] as number || 0);
            }) as T;
        }, {} as T);
    }
}

/*
 * Gets the key of the maximum value in the object,
 * or an array of keys if an array of objects is passed.
 */
export function maxValueKey<T extends ResponsiveValue, X extends { [key: string]: number }>(object: T): T
export function maxValueKey<T extends ResponsiveValue[], X extends { [key: string]: number } | null>(objects: T): T
export function maxValueKey<T, X>(arg: any): T  {
    if (Array.isArray(arg)) {
        return arg.map((obj: X) => {
            if (obj === null) {
                return null;
            } else {
                return Object.entries(obj).reduce((result, current) => {
                    return current[1] > result[1] ? current : result;
                }, [undefined, Number.MIN_VALUE] as unknown as [string, number])[0];
            }
        }) as unknown as T;
    } else {
        return Object.entries(arg as X).reduce((result, current) => {
            return current[1] > result[1] ? current : result;
        }, [undefined, Number.MIN_VALUE] as unknown as [string, number])[0] as unknown as T;
    }
}

/*
 * Gets the container width, or an array of breakpoints
 * with container widths
 */
export function getContainerWidth(containerMargin: number | null, isSnappedToEdge: boolean): string
export function getContainerWidth(containerMargin: number, isSnappedToEdge: (boolean | null)[]): (string | null)[]
export function getContainerWidth(containerMargin: (number | null)[], isSnappedToEdge: boolean): (string | null)[]
export function getContainerWidth(containerMargin: (number | null)[], isSnappedToEdge: (boolean | null)[]): (string | null)[]
export function getContainerWidth(containerMargin: any, isSnappedToEdge: any): any  {
    if (Array.isArray(containerMargin) || Array.isArray(isSnappedToEdge)) {
        // If one of the arguments is a single value - create
        // an array of length equal to the length of the second
        // argument and fill it with this value
        const containerMarginNormalized = Array.isArray(containerMargin) ? containerMargin : Array(isSnappedToEdge.length).fill(containerMargin);
        const isSnappedToEdgeNormalized = Array.isArray(isSnappedToEdge) ? isSnappedToEdge : Array(containerMargin.length).fill(isSnappedToEdge);
        const unified = unifyArraysLength(containerMarginNormalized, isSnappedToEdgeNormalized);

        return unified[0].map((margin: number, idx: number) => {
            if (isSnappedToEdgeNormalized[idx]) {
                return '100%';
            }

            return `calc(100% - ${margin / 2}px)`
        });
    } else {
        if (isSnappedToEdge) {
            return '100%';
        }

        return `calc(100% - ${containerMargin / 2}px)`
    }
}