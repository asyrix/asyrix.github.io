import { expect } from 'chai';
import rv from './index';
import ResponsiveValues from './core';
import { ResponsiveValue } from './index';

describe('Should test the methods of the ResponsiveValues instance', () => {
    it('Should register custom module', () => {
        function dummyModule(params: { [key: string]: string | number | boolean }) {
            return function reverseAndCompress(this: ResponsiveValues, args: ResponsiveValue[]) {
                if (params.reverse) {
                    return this.compress(args.reverse());
                }

                return this.compress(args);
            }
        }

        rv.registerModule({ dummyModule });

        const arr = rv([null, 1, 2, 3]).dummyModule({ reverse: {} });

        expect(arr).to.have.all.members([3, 2, 1]);
    });

    it('Should unify length of the arrays', () => {
        const arrs = rv.getInstance().unifyArraysLength([
            [10, null, 30, 20],
            [{ x: 1 }, { y: 2 }, null, { z: 5 }, { z: 5 }, { y: 10 }, null]
        ]);

        expect(arrs[0]).to.have.lengthOf(arrs[1].length);
    });

    it('Should fill the gaps in the array with nearest neighbour', () => {
        const arr = rv.getInstance().fillGaps([{ x: 1 }, { y: 2 }, null, { z: 5 }, { z: 5 }, { y: 10 }, null]);

        expect(arr[2]).to.be.equal(arr[3]);
        expect(arr[6]).to.be.equal(arr[5]);
    });

    it('Should compress an array of responsive values', () => {
        const arr = rv.getInstance().compress([{ x: 1 }, { y: 2 }, null, { z: 5 }, { z: 5 }, { y: 10 }, null]);

        expect(arr).to.have.deep.members([{ x: 1 }, { y: 2 }, null, { z: 5 }, null, { y: 10 }]);
    });
});
