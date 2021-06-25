/*
 * Checks if the argument is defined.
 */
export function isDefined(value: any) {
    return typeof value !== 'undefined';
}

/*
 * Checks if the argument is null.
 */
export function isNull(value: any) {
    return value === null;
}

/*
 * Compares two values and returns true if they are equal.
 */
export function compare(a: any, b: any) {
    try {
        // Fastest way. This can be replaced with a deep comparison if needed.
        return JSON.stringify(a) === JSON.stringify(b);
    } catch (err) {
        console.error(err);

        return false;
    }
}
