import { expect } from 'chai';
import rv from '../../index';

describe('Should test the methods of the MaxValueKey module', () => {
    it('Should get the maximum value key in the object', () => {
        const key = rv({ bob: 200, john: -400, alice: 600 }).maxValueKey();

        expect(key).to.be.equal('alice');
    });

    it('Should get undefined because the maximum value in the object does not exist', () => {
        const key = rv({ a: null, d: undefined }).maxValueKey();

        expect(key).to.be.equal(null);
    });

    it('Should get an array of keys of maximum values in objects and compress', () => {
        const keys = rv([{ a: 1, b: 2}, { d: 5, z: null }, { d: 8, z: 3 }, null, { a: 1, c: 3, d: 8}]).maxValueKey();

        expect(keys).to.have.all.members(['b', 'd', null, null, 'd']);
    });
});
