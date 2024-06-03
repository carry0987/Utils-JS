import { shallowMerge, shallowClone } from '../src/component/common';

test('shallowMerge retains instanceof', () => {
    class CustomClass {
        constructor(public value: number) {}
    }

    const target = { a: new CustomClass(1) };
    const source = { a: new CustomClass(2) };
    const result = shallowMerge(target, source);

    expect(result.a).toBeInstanceOf(CustomClass);
    expect(result.a.value).toBe(2);
});

test('shallowMerge merges properties', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = shallowMerge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
});

test('shallowClone clones objects correctly', () => {
    class CustomClass {
        constructor(public value: number) {}
    }

    const obj = { a: new CustomClass(1), b: [1, 2, 3] };
    const clone = shallowClone(obj);

    // Checking overall structure and instance
    expect(clone).toEqual(obj);
    expect(clone.a).toBeInstanceOf(CustomClass);

    // Checking reference difference
    expect(clone.b).not.toBe(obj.b); // Check it's a different reference
});

test('shallowClone clones arrays correctly', () => {
    const arr = [1, 2, 3];
    const clone = shallowClone(arr);

    // Checking overall structure and reference difference
    expect(clone).toEqual(arr);
    expect(clone).not.toBe(arr); // Check it's a different reference
});
