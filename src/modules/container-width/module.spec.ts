import { expect } from 'chai';
import rv from '../../index';

describe('Should test the methods of the ContainerWidth module', () => {
    describe('Should fill the gaps, get the width of the containers and compress', () => {
        it('Two arrays', () => {
            const widths = rv([10, null, 30, 20], [true, null, false, true, false]).getContainerWidth();

            expect(widths).to.have.all.members(['100%', 'calc(100% - 15px)', null, '100%', 'calc(100% - 10px)']);
        });

        it('containerMargin is array, isSnappedToEdge is value', () => {
            const widths = rv([10, null, 30, 20], false).getContainerWidth();

            expect(widths).to.have.all.members(['calc(100% - 5px)', 'calc(100% - 15px)', null, 'calc(100% - 10px)']);
        });

        it('containerMargin is value, isSnappedToEdge is array', () => {
            const widths = rv(10, [true, null, false, true, false]).getContainerWidth();

            expect(widths).to.have.all.members(['100%', 'calc(100% - 5px)', null, '100%', 'calc(100% - 5px)']);
        });

        it('containerMargin is value, isSnappedToEdge is value', () => {
            const widths = rv(10, false).getContainerWidth();

            expect(widths).to.have.be.equal('calc(100% - 5px)');
        });
    });
});
