import React from 'react';
import { useFormControl } from '../lib/useFormControl';

export const FormControlExample = () => {
    const validator = (value: any) => value && value.length > 5 ? 'Too long' : undefined;

    const {
        value,
        setValue,
        error
    } = useFormControl({
        defaultValue: '',
        validator,
    });

    return <div>
        <input type="text"
    value={value}
    onChange={e => setValue(e.target.value)}
    />
    <span>{error}</span>
    </div>
};
