import { formUtils } from '@/index';
import { describe, test, expect } from 'vitest';

describe('formUtils', () => {
    test('appendFormData appends simple key-value pairs', () => {
        const data = {
            key1: 'value1',
            key2: 'value2'
        };
        const formData = formUtils.appendFormData({ data });

        expect(formData.get('key1')).toBe('value1');
        expect(formData.get('key2')).toBe('value2');
    });

    test('appendFormData appends nested objects', () => {
        const data = {
            key1: {
                subKey1: 'subValue1',
                subKey2: 'subValue2'
            },
            key2: 'value2'
        };
        const formData = formUtils.appendFormData({ data });

        expect(formData.get('key1[subKey1]')).toBe('subValue1');
        expect(formData.get('key1[subKey2]')).toBe('subValue2');
        expect(formData.get('key2')).toBe('value2');
    });

    test('appendFormData appends Blobs correctly', () => {
        const blob = new Blob(['test'], { type: 'text/plain' });
        const data = { file: blob };
        const formData = formUtils.appendFormData({ data });

        const appendedBlob = formData.get('file') as Blob;
        expect(appendedBlob).not.toBeNull();
        expect(appendedBlob.size).toBe(blob.size);
        expect(appendedBlob.type).toBe(blob.type);
    });

    test('appendFormData appends Files correctly', () => {
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        const data = { file: file };
        const formData = formUtils.appendFormData({ data });

        const appendedFile = formData.get('file') as File;
        expect(appendedFile).not.toBeNull();
        expect(appendedFile.size).toBe(file.size);
        expect(appendedFile.type).toBe(file.type);
        expect(appendedFile.name).toBe(file.name);
    });

    test('appendFormData correctly handles non-object and non-null values', () => {
        let formData = formUtils.appendFormData({ data: { value: 'Hello World' }, parentKey: 'key' });
        expect(formData.get('key[value]')).toBe('Hello World');

        formData = formUtils.appendFormData({ data: { value: 123 }, parentKey: 'key' });
        expect(formData.get('key[value]')).toBe('123');
    });

    test('encodeFormData encodes objects to FormData correctly', () => {
        const data = {
            key1: 'value1',
            key2: {
                subKey1: 'subValue1',
                subKey2: 'subValue2'
            }
        };
        const formData = formUtils.encodeFormData(data);

        expect(formData.get('key1')).toBe('value1');
        expect(formData.get('key2[subKey1]')).toBe('subValue1');
        expect(formData.get('key2[subKey2]')).toBe('subValue2');
    });

    test('encodeFormData returns FormData as is if presented as input', () => {
        const data = new FormData();
        data.append('key', 'value');
        const formData = formUtils.encodeFormData(data);

        expect(formData).toBe(data);
    });
});

test('decodeFormData decodes FormData to an object correctly', () => {
    const formData = new FormData();
    formData.append('key1', 'value1');
    formData.append('key2', 'value2');
    formData.append('key1', 'value3'); // Add another value to an existing key

    const result = formUtils.decodeFormData(formData);

    expect(result.key1).toEqual(['value1', 'value3']); // Ensure handling multiple values
    expect(result.key2).toBe('value2');
});

test('formDataToURLParams converts FormData to URLParams correctly', () => {
    const formData = new FormData();
    formData.append('key1', 'value1');
    formData.append('key2', 'value2');

    const urlParams = formUtils.formDataToURLParams(formData);

    expect(urlParams.key1).toBe('value1');
    expect(urlParams.key2).toBe('value2');
});

test('convertBodyToURLParams converts FormData, BodyInit and objects to URLParams correctly', () => {
    // Test for FormData
    const formData = new FormData();
    formData.append('formKey', 'formValue');
    let urlParams = formUtils.bodyToURLParams(formData);
    expect(urlParams.formKey).toBe('formValue');

    // Test for generic Object
    const dataObject = {
        objKey1: 'objValue1',
        objKey2: 123, // testing number conversion
        objKey3: false // testing boolean conversion
    };
    urlParams = formUtils.bodyToURLParams(dataObject);
    expect(urlParams.objKey1).toBe('objValue1');
    expect(urlParams.objKey2).toBe(123);
    expect(urlParams.objKey3).toBe(false);

    // Test for complex object serialization
    const complexObject = { objKey1: { nestedKey: 'nestedValue' } };
    urlParams = formUtils.bodyToURLParams(complexObject);
    expect(urlParams.objKey1).toBe(JSON.stringify(complexObject.objKey1));
});
