import { useEffect, useState } from 'react';
import { Maybe, StateSetter } from './types';
import { useValidationRunner, Validator } from './useValidationRunner';

export type FormControlConfig<T, Errors> = Partial<{
    defaultValue: T;
    updateOn: UpdateOn;
    validator: Validator<T, Errors>;
}>

export interface FormControlApi<T = any, Errors = string> {
    value: Maybe<T>;
    setValue: StateSetter<T>;
    error: Maybe<Errors>
}

// type UpdateOnBlur = 'blur';
type UpdateOnChange = 'change';

// todo add debounce

// type UpdateOn = UpdateOnBlur | UpdateOnChange;

type UpdateOn = UpdateOnChange;

export function useFormControl<T = any, Errors = string>(config: FormControlConfig<T, Errors> = {}) {
    const noopValidator = () => undefined;

    const defaultValue = config.defaultValue;
    const validator = config.validator || noopValidator;

    const [value, setValue] = useState(defaultValue);
    const {error, validate} = useValidationRunner(value, validator);

    useEffect(() => {
        validate();
    }, [value, validate]);

    return {
        value,
        setValue,
        error
    };
}
