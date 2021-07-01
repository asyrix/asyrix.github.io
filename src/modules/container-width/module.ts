/*
 * Gets the container width, or an array of breakpoints
 * with container widths
 */
import ResponsiveValues from '../../core';
import {
    ResponsiveNumber,
    ResponsiveString,
    ResponsiveBoolean,
    ResponsiveNull,
    ResponsiveUndefined
} from '../../index';

export type ContainerMarginCombined = ResponsiveNumber | ResponsiveNull | (ResponsiveNumber | ResponsiveNull)[];
export type IsSnappedToEdgeCombined = ResponsiveBoolean | (ResponsiveBoolean | ResponsiveNull)[];
export type GetContainerWidthCombined = ResponsiveString | (ResponsiveString | ResponsiveNull)[] | ResponsiveUndefined;

export default function() {
    function getContainerWidth(containerMargin: ResponsiveNumber | ResponsiveNull, isSnappedToEdge: ResponsiveBoolean): ResponsiveString;
    function getContainerWidth(containerMargin: ResponsiveNumber, isSnappedToEdge: (ResponsiveBoolean | ResponsiveNull)[]): (ResponsiveString | ResponsiveNull)[];
    function getContainerWidth(containerMargin: (ResponsiveNumber | ResponsiveNull)[], isSnappedToEdge: ResponsiveBoolean): (ResponsiveString | ResponsiveNull)[];
    function getContainerWidth(containerMargin: (ResponsiveNumber | ResponsiveNull)[], isSnappedToEdge: (ResponsiveBoolean | ResponsiveNull)[]): (ResponsiveString | ResponsiveNull)[];
    function getContainerWidth(this: ResponsiveValues, containerMargin: ContainerMarginCombined, isSnappedToEdge: IsSnappedToEdgeCombined): GetContainerWidthCombined {
        // containerMargin is array, isSnappedToEdge is value
        if (Array.isArray(containerMargin) && !Array.isArray(isSnappedToEdge)) {
            const isSnappedToEdgeNormalized: (ResponsiveBoolean | ResponsiveNull)[] = Array(containerMargin.length).fill(isSnappedToEdge);
            const unified = this.unifyArraysLength([containerMargin, isSnappedToEdgeNormalized]);
            const filled = unified.map(arr => this.fillGaps(arr));

            return this.compress(filled[0].map((margin, idx) => {
                if (isSnappedToEdgeNormalized[idx]) {
                    return '100%';
                }

                return `calc(100% - ${(typeof margin === 'number' ? margin : 0) / 2}px)`;
            }));
        // containerMargin is value, isSnappedToEdge is array
        } else if (!Array.isArray(containerMargin) && Array.isArray(isSnappedToEdge)) {
            const containerMarginNormalized = Array(isSnappedToEdge.length).fill(containerMargin);
            const unified = this.unifyArraysLength([containerMarginNormalized, isSnappedToEdge]);
            const filled = unified.map(arr => this.fillGaps(arr));

            return this.compress(filled[0].map((margin, idx) => {
                if (isSnappedToEdge[idx]) {
                    return '100%';
                }

                return `calc(100% - ${(typeof margin === 'number' ? margin : 0) / 2}px)`;
            }));
        // containerMargin is array, isSnappedToEdge is array
        } else if (Array.isArray(containerMargin) && Array.isArray(isSnappedToEdge)) {
            const unified = this.unifyArraysLength([containerMargin, isSnappedToEdge]);
            const filled = unified.map(arr => this.fillGaps(arr));

            return this.compress(filled[0].map((margin, idx) => {
                if (isSnappedToEdge[idx]) {
                    return '100%';
                }

                return `calc(100% - ${(typeof margin === 'number' ? margin : 0) / 2}px)`;
            }));
        // containerMargin is value, isSnappedToEdge is value
        } else {
            if (isSnappedToEdge) {
                return '100%';
            }

            return `calc(100% - ${(typeof containerMargin === 'number' ? containerMargin : 0) / 2}px)`;
        }
    }

    return getContainerWidth;
}
