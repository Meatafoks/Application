export function hideFields(obj: any) {
    const result = { ...obj };
    for (const field in obj) {
        const value = obj[field];
        if (typeof value === 'string') {
            const unhiddenSize = Math.floor(value.length / 2);
            if (value.length >= unhiddenSize) {
                result[field] = value.substring(0, unhiddenSize) + '***';
            }
        } else if (typeof value === 'object') {
            if (value instanceof Array) {
                result[field] = value.map(hideFields);
            } else {
                result[field] = hideFields(value);
            }
        } else {
            result[field] = value;
        }
    }
    return result;
}

export function hideFieldsAndJsonify(obj: any, pretty = false) {
    if (pretty) return JSON.stringify(hideFields(obj), null, 2);
    return JSON.stringify(hideFields(obj));
}
