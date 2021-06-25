import React from 'react';
import {
    ResponsiveValue,
    fillGaps,
    compress,
    unifyArraysLength,
    sum,
    maxValueKey,
    getContainerWidth
} from '../utils/responsive-values';

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
                        unifyArraysLength(
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
                    { JSON.stringify(fillGaps(this.state.examples.arr2 as ResponsiveValue[])) }
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
                    { JSON.stringify(sum(...[
                        this.state.examples.arr1 as ResponsiveValue[],
                        this.state.examples.arr3 as ResponsiveValue[]
                    ].map(arr => fillGaps(arr)))) }
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
                    { JSON.stringify(sum(this.state.examples.val1 as ResponsiveValue, this.state.examples.val2 as ResponsiveValue)) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Compress an array of responsive values</h3>
                <h5>Input:</h5>
                <div className="responsive-values__code">
                    { JSON.stringify(this.state.examples.arr2) }
                </div>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(compress(this.state.examples.arr2 as ResponsiveValue[])) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Get the maximum value key in the object</h3>
                <h5>Input:</h5>
                <div className="responsive-values__code">
                    { JSON.stringify(this.state.examples.val3) }
                </div>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(maxValueKey(this.state.examples.val3 as ResponsiveValue[])) }
                </div>
                <div className="responsive-values__sep" />
                <h3>Get an array of keys of maximum values in objects</h3>
                <h5>Input:</h5>
                <div className="responsive-values__code">
                    { JSON.stringify(this.state.examples.arr5) }
                </div>
                <h5>Output:</h5>
                <div className="responsive-values__code responsive-values__code--result">
                    { JSON.stringify(maxValueKey(this.state.examples.arr5 as ResponsiveValue[])) }
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
                        JSON.stringify(getContainerWidth(
                            ...unifyArraysLength(
                                this.state.examples.arr1 as ResponsiveValue[],
                                this.state.examples.arr6 as ResponsiveValue[]
                            ).map((arr) => {
                                return fillGaps(arr as ResponsiveValue[]) as (number | null)[]
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
                        JSON.stringify(getContainerWidth(fillGaps(this.state.examples.arr1 as ResponsiveValue[]) as (number | null)[], false))
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
                        JSON.stringify(getContainerWidth(10, fillGaps(this.state.examples.arr6 as ResponsiveValue[]) as (boolean | null)[]))
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
                        JSON.stringify(getContainerWidth(10, false))
                    }
                </div>
            </div>
        );
    }
}
