import { FormDataOptions } from '../interface/interfaces';

// Append form data
export function appendFormData(options: FormDataOptions, formData: FormData = new FormData()): FormData {
    const { data, parentKey = '' } = options;
    if (data !== null && typeof data === 'object') {
        // Check if it is Blob or File, if so, add directly
        if (data instanceof Blob || data instanceof File) {
            const formKey = parentKey || 'file'; // If no key is specified, the default is 'file'
            formData.append(formKey, data);
        } else {
            // Traverse object properties
            Object.keys(data).forEach(key => {
                const value = data[key];
                const formKey = parentKey ? `${parentKey}[${key}]` : key;
                if (value !== null && typeof value === 'object') {
                    // Recursively call to handle nested objects
                    appendFormData({ data: value, parentKey: formKey }, formData);
                } else if (value !== null) {
                    // Handle non-empty values, add directly
                    formData.append(formKey, String(value));
                }
            });
        }
    } else if (data !== null) {
        // Non-object and non-null values, add directly
        formData.append(parentKey, data);
    }

    // If you don't want to add null values to FormData, you can do nothing here
    // Or if you want to convert null to other forms, you can handle it here
    return formData;
}

// Encode form data before send
export function encodeFormData(data: any, parentKey: string = ''): FormData {
    if (data instanceof FormData) {
        return data;
    }
    const options: FormDataOptions = {
        data: data,
        parentKey: parentKey
    };

    return appendFormData(options);
}
