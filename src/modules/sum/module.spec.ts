import { expect } from 'chai';
import rv from '../../index';

describe('Should test the methods of the Sum module', () => {
    it('Should sum single responsive values', () => {
        const summed = rv([5, 8]).sum(100);

        expect(summed).to.be.equal(13);
    });

    it('Should fill the gaps, sum the arrays of responsive values and compress', () => {
        const summed = rv([
            [10, null, 30, 20],
            [6, null, 44, 8, 5, 99]
        ]).sum();

        expect(summed).to.have.all.members([16, 74, null, 28, 25, 119]);
    });
});
