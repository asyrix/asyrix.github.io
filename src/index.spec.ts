import { expect } from 'chai';
import {
    fillGaps,
    compress,
    unifyArraysLength,
    sum,
    maxValueKey,
    getContainerWidth
} from './index';

const arr1 = [10, null, 30, 20];
const arr2 = [{ x: 1 }, { y: 2 }, null, { z: 5 }, { z: 5 }, { y: 10 }, null];
const arr3 = [6, null, 44, 8, 5, 99];
const arr4 = [6, null, 'x', 8, 'd', 99];
const arr5 = [{ a: 1, b: 2}, { d: 5, z: null }, null, { a: 1, c: 3, d: 8}];
const arr6 = [true, null, false, true, false];
const val1 = 5;
const val2 = 8;
const val3 = { bob: 200, john: -400, alice: 600 };

describe('Should test the methods of the ResponsiveValues component', () => {
    it('Should unify length of the arrays', () => {
        const arrs = unifyArraysLength([arr1, arr2]);

        expect(arrs[0]).to.have.lengthOf(arrs[1].length);
    });

    it('Should fill the gaps in the array with nearest neighbour', () => {
        const arr = fillGaps(arr2);

        expect(arr[2]).to.be.equal(arr[3]);
        expect(arr[6]).to.be.equal(arr[5]);
    });

    it('Should fill the gaps and sum the arrays of responsive values', () => {
        const summed = sum([arr1, arr3]);

        expect(summed).to.have.all.members([16, 74, 74, 28, 25, 119]);
    });

    it('Should sum single responsive values', () => {
        const summed = sum([val1, val2]);

        expect(summed).to.be.equal(13);
    });

    it('Should compress an array of responsive values', () => {
        const arr = compress(arr2);

        expect(arr).to.have.all.members([arr2[0], arr2[1], null, arr2[3], null, arr2[5]]);
    });

    it('Should get the maximum value key in the object', () => {
        const key = maxValueKey(val3);

        expect(key).to.be.equal('alice');
    });

    it('Should get undefined because the maximum value in the object does not exist', () => {
        const key = maxValueKey({ a: null, d: undefined });

        expect(key).to.be.equal(null);
    });

    it('Should get an array of keys of maximum values in objects', () => {
        const keys = maxValueKey(arr5);

        expect(keys).to.have.all.members(['b', 'd', null, 'd']);
    });

    describe('Should fill the gaps and get the width of the containers', () => {
        it('Two arrays', () => {
            const widths = getContainerWidth(arr1, arr6);

            expect(widths).to.have.all.members(['100%', 'calc(100% - 15px)', 'calc(100% - 15px)', '100%', 'calc(100% - 10px)']);
        });

        it('containerMargin is array, isSnappedToEdge is value', () => {
            const widths = getContainerWidth(fillGaps(arr1) as (number | null)[], false);

            expect(widths).to.have.all.members(['calc(100% - 5px)', 'calc(100% - 15px)', 'calc(100% - 15px)', 'calc(100% - 10px)']);
        });

        it('containerMargin is value, isSnappedToEdge is array', () => {
            const widths = getContainerWidth(10, fillGaps(arr6) as (boolean | null)[]);

            expect(widths).to.have.all.members(['100%', 'calc(100% - 5px)', 'calc(100% - 5px)', '100%','calc(100% - 5px)']);
        });

        it('containerMargin is value, isSnappedToEdge is value', () => {
            const widths = getContainerWidth(10, false);

            expect(widths).to.have.be.equal('calc(100% - 5px)');
        });
    });
});
