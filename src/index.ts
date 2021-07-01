import ResponsiveValues from './core';
import sum from './modules/sum/module';
import getContainerWidth from './modules/container-width/module';
import maxValueKey from './modules/max-value-key/module';

export type ResponsiveUndefined = undefined;
export type ResponsiveNull = null;
export type ResponsiveEmpty = ResponsiveNull | ResponsiveUndefined;
export type ResponsiveNumber = number | ResponsiveEmpty;
export type ResponsiveString = string | ResponsiveEmpty;
export type ResponsiveObject = { [key: string]: ResponsiveValue } | ResponsiveEmpty;
export type ResponsiveBoolean = boolean | ResponsiveEmpty;
export type ResponsiveValue = ResponsiveNumber | ResponsiveString | ResponsiveBoolean | ResponsiveObject | ResponsiveEmpty;

const responsiveValues = new ResponsiveValues();

// Registers default modules.
responsiveValues.registerModule({ sum, getContainerWidth, maxValueKey });

export type ResponsiveValueCombined = ResponsiveValue | ResponsiveValue[] | ResponsiveValue[][];
export type ResponsiveValueModuleContainer = (...args: any[]) => ResponsiveValueModuleFun;
export type ResponsiveValueModuleFun = (...params: any[]) => ResponsiveValueCombined;
export type ResponsiveValueModule = { [key: string]: ResponsiveValueModuleFun };

export default function rv(arg1: ResponsiveValueCombined, arg2?: ResponsiveValueCombined): ResponsiveValueModule {
    const modules: ResponsiveValueModule = {};

    Object.entries(responsiveValues.modules).forEach(([name, module]) => {
        modules[name] = (...params) => {
            return module(...params).call(responsiveValues, arg1, arg2);
        };
    });

    return modules;
}

rv.registerModule = (modules: { [key: string]: ResponsiveValueModuleContainer }) => responsiveValues.registerModule(modules);
rv.getInstance = () => responsiveValues;
