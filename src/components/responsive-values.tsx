import React from 'react';

export type ResponsiveValue = number | string | { [key: string]: number | string | null } | boolean | null | undefined

interface Props {}
interface State {
    examples: { [key: string]: ResponsiveValue | ResponsiveValue[] }
}

export default class ResponsiveValues extends React.Component<Props, State> {
    state: State = {
        examples: {
            arr1: [10, null, 30, 20],
            arr2: [{ x: 1 }, { y: 2 }, null, { z: 5 }, { z: 5 }, { y: 10 }, null],
            arr3: [6, null, 44, 8, 5, 99],
            arr4: [6, null, 'x', 8, 'd', 99],
            arr5: [{ a: 1, b: 2}, { d: 5, z: null }, null, { a: 1, c: 3, d: 8}],
            arr6: [true, null, false, true, false],
            val1: 5,
            val2: 8,
            val3: { bob: 200, john: -400, alice: 600 }
        }
    }

    /*
     * Checks if the argument is defined.
     */
    private static isDefined(value: ResponsiveValue) {
        return typeof value !== 'undefined';
    }

    /*
     * Checks if the argument is null.
     */
    private static isNull(value: ResponsiveValue) {
        return value === null;
    }

    /*
     * Compares two responsive values
     * and returns true if they are equal.
     */
    private static compare(a: ResponsiveValue, b: ResponsiveValue) {
        try {
            // Fastest way. This can be replaced with a deep comparison if needed.
            return JSON.stringify(a) === JSON.stringify(b);
        } catch (err) {
            console.error(err);

            return false;
        }
    }

    /*
     * Gets an array of responsive values and replaces
     * null / undefined values with the nearest neighbour.
     */
    fillGaps<T extends ResponsiveValue[]>(responsive: T): T {
        return responsive.map((value, idx) => {
            // Get the nearest neighbour if the value is null or undefined.
            if (!ResponsiveValues.isDefined(value) || ResponsiveValues.isNull(value)) {
                // Get the nearest right neighbour.
                const nextValue = responsive.slice(idx + 1).find((value) => ResponsiveValues.isDefined(value) && !ResponsiveValues.isNull(value));

                if (ResponsiveValues.isDefined(nextValue)) {
                    return nextValue;
                } else {
                    // If right neighbour is not defined get the nearest left neighbour.
                    const prevValue = responsive.slice(0, idx).reverse().find((value) => ResponsiveValues.isDefined(value) && !ResponsiveValues.isNull(value));

                    if (ResponsiveValues.isDefined(prevValue)) {
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
    compress<T extends ResponsiveValue[]>(responsive: T): T {
        return responsive
            // Removes unnecessary nulls from the end of the array
            .filter((value: ResponsiveValue, idx) => {
                return !(ResponsiveValues.isNull(value) && responsive.slice(idx).every((value: ResponsiveValue) => ResponsiveValues.isNull(value)));
            })
            // Replaces duplicated values with nulls
            .reduce((result: T, currValue: ResponsiveValue, idx, arr): T => {
                const prevValue = arr[idx - 1];
                const restFromCurrentIndex = [...new Set(arr.slice(idx))];

                if ((restFromCurrentIndex.length !== 1 || !ResponsiveValues.compare(prevValue, currValue)) && !restFromCurrentIndex.every(val => ResponsiveValues.isNull(val))) {
                    if (ResponsiveValues.isDefined(prevValue) && ResponsiveValues.compare(prevValue, currValue)) {
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
    unifyArraysLength<T extends ResponsiveValue[]>(...arraysToUnify: T[]): T[] {
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
    sum<T extends ResponsiveValue[]>(...arrays: T[]): T
    sum<T extends ResponsiveValue>(...values: T[]): T
    sum<T>(...args: any[]): T {
        if (!args.find(arg => Array.isArray(arg))) {
            return args.reduce((prevValue, currValue): T => {
                if (ResponsiveValues.isDefined(currValue) && currValue !== null && typeof currValue !== 'number') {
                    throw new Error('One of the values is not a number.');
                }

                return ((prevValue as number || 0) + (currValue as number || 0)) as unknown as T;
            }) as T;
        } else {
            const unified = this.unifyArraysLength(...args);

            return unified.reduce((result, currValue): T => {
                return currValue.map((value: ResponsiveValue, idx: number) => {
                    if (ResponsiveValues.isDefined(value) && value !== null && typeof value !== 'number') {
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
    maxValueKey<T extends ResponsiveValue, X extends { [key: string]: number }>(object: T): T
    maxValueKey<T extends ResponsiveValue[], X extends { [key: string]: number } | null>(objects: T): T
    maxValueKey<T, X>(arg: any): T  {
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
    getContainerWidth(containerMargin: number | null, isSnappedToEdge: boolean): string
    getContainerWidth(containerMargin: number, isSnappedToEdge: (boolean | null)[]): (string | null)[]
    getContainerWidth(containerMargin: (number | null)[], isSnappedToEdge: boolean): (string | null)[]
    getContainerWidth(containerMargin: (number | null)[], isSnappedToEdge: (boolean | null)[]): (string | null)[]
    getContainerWidth(containerMargin: any, isSnappedToEdge: any): any  {
        if (Array.isArray(containerMargin) || Array.isArray(isSnappedToEdge)) {
            // If one of the arguments is a single value - create
            // an array of length equal to the length of the second
            // argument and fill it with this value
            const containerMarginNormalized = Array.isArray(containerMargin) ? containerMargin : Array(isSnappedToEdge.length).fill(containerMargin);
            const isSnappedToEdgeNormalized = Array.isArray(isSnappedToEdge) ? isSnappedToEdge : Array(containerMargin.length).fill(isSnappedToEdge);
            const unified = this.unifyArraysLength(containerMarginNormalized, isSnappedToEdgeNormalized);

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

    render() {
        return (
            <div className="responsive-values">
                <h1>Use cases</h1>
                <h3>Unify length of the arrays</h3>
                <h5>Input:</h5>
                <ul className="responsive-values__code">
                    {
                        [this.state.examples.arr1, this.state.examples.arr2].map((arr, idx) =>
                            <li key={ idx }>{ JSON.stringify(arr) }</li>
                        )
                    }
                </ul>
                <h5>Output:</h5>
                <ul className="responsive-values__code responsive-values__code--result">
                    {
                        this.unifyArraysLength(
                            this.state.examples.arr1 as ResponsiveValue[],
                            this.state.examples.arr2 as ResponsiveValue[]
                        ).map((arr, idx) =>
                            <li key={ idx }>{ JSON.stringify(arr) }</li>
                        )
                    }
                </ul>
                <div className="responsive-values__sep" />
                <h3>Fill the gaps in the array with nearest neighbour</h3>
                <h5>Input:</h5>
                <div className="responsive-values__code">
                    { JSON.stringify(this.state.examples.arr2) }
                </div>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(this.fillGaps(this.state.examples.arr2 as ResponsiveValue[])) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Fill the gaps and sum the arrays of responsive values</h3>
                <h5>Input:</h5>
                <ul className="responsive-values__code">
                    {
                        [this.state.examples.arr1, this.state.examples.arr3].map((arr, idx) =>
                            <li key={ idx }>{ JSON.stringify(arr) }</li>
                        )
                    }
                </ul>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(this.sum(...[
                        this.state.examples.arr1 as ResponsiveValue[],
                        this.state.examples.arr3 as ResponsiveValue[]
                    ].map(arr => this.fillGaps(arr)))) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Sum single responsive values</h3>
                <h5>Input:</h5>
                <ul className="responsive-values__code">
                    {
                        [this.state.examples.val1, this.state.examples.val2].map((val, idx) =>
                            <li key={ idx }>{ JSON.stringify(val) }</li>
                        )
                    }
                </ul>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(this.sum(this.state.examples.val1 as ResponsiveValue, this.state.examples.val2 as ResponsiveValue)) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Compress an array of responsive values</h3>
                <h5>Input:</h5>
                <div className="responsive-values__code">
                    { JSON.stringify(this.state.examples.arr2) }
                </div>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(this.compress(this.state.examples.arr2 as ResponsiveValue[])) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Get the maximum value key in the object</h3>
                <h5>Input:</h5>
                <div className="responsive-values__code">
                    { JSON.stringify(this.state.examples.val3) }
                </div>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(this.maxValueKey(this.state.examples.val3 as ResponsiveValue[])) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Get an array of keys of maximum values in objects</h3>
                <h5>Input:</h5>
                <div className="responsive-values__code">
                    { JSON.stringify(this.state.examples.arr5) }
                </div>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(this.maxValueKey(this.state.examples.arr5 as ResponsiveValue[])) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Fill the gaps and get the width of the containers</h3>
                <h5>Input:</h5>
                <ul className="responsive-values__code">
                    {
                        [this.state.examples.arr1, this.state.examples.arr6].map((arr, idx) =>
                            <li key={ idx }>{ JSON.stringify(arr) }</li>
                        )
                    }
                </ul>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    {
                        JSON.stringify(this.getContainerWidth(
                            ...this.unifyArraysLength(
                                this.state.examples.arr1 as ResponsiveValue[],
                                this.state.examples.arr6 as ResponsiveValue[]
                            ).map((arr) => {
                                return this.fillGaps(arr as ResponsiveValue[]) as (number | null)[]
                            }) as [(number | null)[], (boolean | null)[]]
                        ))
                    }
                </div>
                <h5>Input:</h5>
                <ul className="responsive-values__code">
                    <li>{ JSON.stringify(this.state.examples.arr1) }</li>
                    <li>{ JSON.stringify(false) }</li>
                </ul>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    {
                        JSON.stringify(this.getContainerWidth(this.fillGaps(this.state.examples.arr1 as ResponsiveValue[]) as (number | null)[], false))
                    }
                </div>
                <h5>Input:</h5>
                <ul className="responsive-values__code">
                    <li>{ JSON.stringify(10) }</li>
                    <li>{ JSON.stringify(this.state.examples.arr6) }</li>
                </ul>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    {
                        JSON.stringify(this.getContainerWidth(10, this.fillGaps(this.state.examples.arr6 as ResponsiveValue[]) as (boolean | null)[]))
                    }
                </div>
                <h5>Input:</h5>
                <ul className="responsive-values__code">
                    <li>{ JSON.stringify(10) }</li>
                    <li>{ JSON.stringify(false) }</li>
                </ul>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    {
                        JSON.stringify(this.getContainerWidth(10, false))
                    }
                </div>
            </div>
        );
    }
}
