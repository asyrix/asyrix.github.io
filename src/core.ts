import { compare, isDefined, isNull } from './helpers';
import {
    ResponsiveNumber,
    ResponsiveString,
    ResponsiveBoolean,
    ResponsiveObject,
    ResponsiveValue,
    ResponsiveValueModule,
    ResponsiveValueModuleFun,
    ResponsiveValueModuleContainer
} from './index';

export default class ResponsiveValues {
    registerModule(modules: { [key: string]: ResponsiveValueModuleContainer }) {
        Object.entries(modules).forEach(([name, module]) => {
            this.modules[name] = module.bind(this);
        });
    }

    /*
     * Modules container.
     */
    modules: { [key: string ]: ResponsiveValueModuleContainer } = {};

    /*
     * Gets an array of responsive values and replaces
     * null / undefined values with the nearest neighbour.
     */
    fillGaps<T extends ResponsiveNumber[]>(responsive: T): T;
    fillGaps<T extends ResponsiveString[]>(responsive: T): T;
    fillGaps<T extends ResponsiveObject[]>(responsive: T): T;
    fillGaps<T extends ResponsiveBoolean[]>(responsive: T): T;
    fillGaps<T extends ResponsiveValue[]>(responsive: T): T;
    fillGaps(responsive: ResponsiveValue[]): ResponsiveValue[] {
        return responsive.map((value, idx) => {
            // Get the nearest neighbour if the value is null or undefined.
            if (!isDefined(value) || isNull(value)) {
                // Get the nearest right neighbour.
                const nextValue = responsive.slice(idx + 1).find((val) => isDefined(val) && !isNull(val));

                if (isDefined(nextValue)) {
                    return nextValue;
                } else {
                    // If right neighbour is not defined get the nearest left neighbour.
                    const prevValue = responsive.slice(0, idx).reverse().find((val) => isDefined(val) && !isNull(val));

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
    compress<T extends ResponsiveValue[]>(responsive: T): T {
        return responsive
            // Removes unnecessary nulls from the end of the array
            .filter((value: ResponsiveValue, idx) => {
                return !(isNull(value) && responsive.slice(idx).every((val: ResponsiveValue) => isNull(val)));
            })
            // Replaces duplicated values with nulls
            .reduce((result: T, currValue, idx, arr): T => {
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
    unifyArraysLength<T extends ResponsiveValue[][]>(arraysToUnify: T): T {
        const maxLength: number = [...arraysToUnify].sort((a, b) => b.length - a.length)[0].length;
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
}
