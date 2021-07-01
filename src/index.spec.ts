import { expect } from 'chai';
import rv from './';

describe('Should test the methods of the ResponsiveValues component', () => {
    it('Should register default modules', () => {
        const moduleNames = Object.keys(rv.getInstance().modules);

        expect(moduleNames).to.have.contain.members(['sum', 'getContainerWidth', 'maxValueKey']);
    });
});
