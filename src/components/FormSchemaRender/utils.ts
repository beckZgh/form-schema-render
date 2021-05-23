export function warn(message: string) {
    console.warn(`[FormSchemaRender warn]:${message}`);
}

export function is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
    return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isUndefined<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isObject(val: any): val is Record<any, any> {
    return val !== null && is(val, 'Object');
}

export function isDate(val: unknown): val is Date {
    return is(val, 'Date');
}

export function isNull(val: unknown): val is null {
    return val === null;
}

export function isNumber(val: unknown): val is number {
    return is(val, 'Number');
}

export function isString(val: unknown): val is string {
    return is(val, 'String');
}

export function isFunction(val: unknown): val is Function {
    return typeof val === 'function';
}

export function isBoolean(val: unknown): val is boolean {
    return is(val, 'Boolean');
}

export function isArray(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

