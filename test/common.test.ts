import { commonUtils } from '../src/index';

test('shallowMerge retains instanceof', () => {
    class CustomClass {
        constructor(public value: number) {}
    }

    const target = { a: new CustomClass(1) };
    const source = { a: new CustomClass(2) };
    const result = commonUtils.shallowMerge(target, source);

    expect(result.a).toBeInstanceOf(CustomClass);
    expect(result.a.value).toBe(2);
});

test('shallowMerge merges properties', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = commonUtils.shallowMerge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
});

test('shallowClone clones objects correctly', () => {
    class CustomClass {
        constructor(public value: number) {}
    }

    const obj = { a: new CustomClass(1), b: [1, 2, 3] };
    const clone = commonUtils.shallowClone(obj);

    // Checking overall structure and instance
    expect(clone).toEqual(obj);
    expect(clone.a).toBeInstanceOf(CustomClass);

    // Checking reference difference
    expect(clone.b).not.toBe(obj.b); // Check it's a different reference
});

test('shallowClone clones arrays correctly', () => {
    const arr = [1, 2, 3];
    const clone = commonUtils.shallowClone(arr);

    // Checking overall structure and reference difference
    expect(clone).toEqual(arr);
    expect(clone).not.toBe(arr); // Check it's a different reference
});

test('deepMerge merges deeply nested properties', () => {
    const target = { a: { b: 1 } };
    const source = { a: { b: 1, c: 2 } };
    const result = commonUtils.deepMerge(target, source);

    expect(result).toEqual({ a: { b: 1, c: 2 } });
});

test('deepClone clones deeply nested objects correctly', () => {
    const obj = { a: { b: 1, c: [2, 3] } };
    const clone = commonUtils.deepClone(obj);

    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj); // Check it's a different reference
    expect(clone.a).not.toBe(obj.a); // Check nested object reference
    expect(clone.a.c).not.toBe(obj.a.c); // Check nested array reference
});

test('isObject identifies objects correctly', () => {
    expect(commonUtils.isObject({})).toBe(true);
    expect(commonUtils.isObject([])).toBe(false);
    expect(commonUtils.isObject(null)).toBe(false);
    expect(commonUtils.isObject('string')).toBe(false);
});

test('isFunction identifies functions correctly', () => {
    expect(commonUtils.isFunction(() => {})).toBe(true);
    expect(commonUtils.isFunction({})).toBe(false);
});

test('isString identifies strings correctly', () => {
    expect(commonUtils.isString('test')).toBe(true);
    expect(commonUtils.isString(123)).toBe(false);
});

test('isNumber identifies numbers correctly', () => {
    expect(commonUtils.isNumber(123)).toBe(true);
    expect(commonUtils.isNumber('123')).toBe(false);
});

test('isBoolean identifies booleans correctly', () => {
    expect(commonUtils.isBoolean(true)).toBe(true);
    expect(commonUtils.isBoolean('true')).toBe(false);
});

test('isArray identifies arrays correctly', () => {
    expect(commonUtils.isArray([1, 2, 3])).toBe(true);
    expect(commonUtils.isArray('123')).toBe(false);
});

test('isEmpty checks emptiness correctly', () => {
    expect(commonUtils.isEmpty('')).toBe(true);
    expect(commonUtils.isEmpty('test')).toBe(false);
    expect(commonUtils.isEmpty(0)).toBe(false);
    expect(commonUtils.isEmpty(null)).toBe(true);
});

test('generateRandom generates strings of correct length', () => {
    expect(commonUtils.generateRandom(8)).toHaveLength(8);
});

test('getUrlParam gets URL parameter correctly', () => {
    const url = 'http://example.com?page=1&size=20';
    expect(commonUtils.getUrlParam('page', url)).toBe('1');
    expect(commonUtils.getUrlParam('size', url)).toBe('20');
});

test('setUrlParam sets URL parameter correctly', () => {
    const url = 'http://example.com?page=1&size=20';
    const params = { page: '2', sort: 'asc' };
    const result = commonUtils.setUrlParam(url, params);

    expect(result).toBe('http://example.com/?page=2&size=20&sort=asc');
});

test('setStylesheetId sets stylesheet ID correctly', () => {
    commonUtils.setStylesheetId('new-id');
    expect(commonUtils.stylesheetId).toBe('new-id');
});

test('setReplaceRule sets replace rule correctly', () => {
    commonUtils.setReplaceRule('.old', '.new');
    expect(commonUtils.replaceRule).toEqual({ from: '.old', to: '.new' });
});
