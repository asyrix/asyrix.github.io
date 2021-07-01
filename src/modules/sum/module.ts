/*
 * Adds two single responsive values if they are numbers,
 * or adds arrays of responsive values depending on the
 * passed arguments.
 */
import ResponsiveValues from '../../core';
import { ResponsiveNumber, ResponsiveValue } from '../../index';

export type SumCombined = ResponsiveNumber[] | ResponsiveNumber;

export default function() {
    function sum<T extends ResponsiveNumber[]>(numbers: T[]): T;
    function sum<T extends ResponsiveNumber>(numbers: T[]): T;
    function sum<T extends SumCombined>(this: ResponsiveValues, numbers: SumCombined[]): SumCombined {
        if (!numbers.find(val => Array.isArray(val))) {
            const filled = this.fillGaps(numbers as ResponsiveNumber[]);

            return filled.reduce((prevValue: ResponsiveNumber, currValue: ResponsiveNumber) => {
                return (prevValue  || 0) + (currValue || 0);
            });
        } else {
            const unified = this.unifyArraysLength(numbers as ResponsiveValue[][]) as ResponsiveNumber[][];
            const filled = unified.map(arr => this.fillGaps(arr));

            return this.compress(filled.reduce((result: ResponsiveNumber[], currValue: ResponsiveNumber[]) => {
                return currValue.map((value: ResponsiveNumber, idx: number) => {
                    return (value || 0) + (result[idx] || 0);
                });
            }));
        }
    }

    return sum;
}
