import { describe, test, expect } from 'vitest';
import { formUtils } from '../src/index';

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
        let formData = formUtils.appendFormData({ data: { value: 'Hello World'}, parentKey: 'key' });
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
