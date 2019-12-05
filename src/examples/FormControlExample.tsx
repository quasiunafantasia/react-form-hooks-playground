import React, { ChangeEvent, useState } from 'react';
import { useFormControl, UpdateOn } from '../lib/useFormControl';

export const FormControlExample = () => {
    const validator = (value: any) => value && value.length > 5 ? 'Too long' : undefined;
    const [updateStrategy, setUpdateStrategy] = useState<UpdateOn>('change');
    const {
        value,
        innerValue,
        setValue,
        error,
        blur
    } = useFormControl({
        defaultValue: '',
        validator,
        updateOn: updateStrategy
    });

    const onUpdateStrategySelect = (e: ChangeEvent<HTMLInputElement>) => {
      setUpdateStrategy(e.target.value as UpdateOn);
    };

    return <div>
        <div className="radio">
            <label>
                <input type="radio" value="change" checked={updateStrategy === 'change'}
                       onChange={onUpdateStrategySelect}/>
                On change
            </label>
        </div>
        <div className="radio">
            <label>
                <input type="radio" value="blur" checked={updateStrategy === 'blur'}
                       onChange={onUpdateStrategySelect}/>
                On blur
            </label>
        </div>

        {/* TODO use hook to pass props */}
        <input type="text"
               value={innerValue}
               onChange={e => setValue(e.target.value)}
               onBlur={blur}
        />

        <div>Error: {error}</div>
        <div>Value: {value}</div>
    </div>
};
