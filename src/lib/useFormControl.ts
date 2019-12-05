import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { Maybe, StateSetter } from './types';
import { useValidationRunner, Validator } from './useValidationRunner';

export type FormControlConfig<T, Errors> = Partial<{
    defaultValue: T;
    updateOn: UpdateOn;
    validator: Validator<T, Errors>;
    ref: MutableRefObject<HTMLElement>
}>

export interface FormControlApi<T = any, Errors = string> {
    value: Maybe<T>;
    innerValue: Maybe<T>;
    setValue: StateSetter<T>;
    error: Maybe<Errors>;
    focus: () => void;
    blur: () => void;
}

export type UpdateOnBlur = 'blur';
export type UpdateOnChange = 'change';

// todo add debounce

export type UpdateOn = UpdateOnBlur | UpdateOnChange;

export function useFormControl<T = any, Errors = string>(config: FormControlConfig<T, Errors> = {}) {
    const noopValidator = () => undefined;

    const defaultValue = config.defaultValue;
    const validator = config.validator || noopValidator;
    const updateOn = config.updateOn || 'change';

    const [innerValue, setInnerValue] = useState(defaultValue);
    const [value, setValue] = useState(defaultValue);
    const [isBlurred, setBlurred] = useState(true);
    const {error, validate} = useValidationRunner(innerValue, validator);

    const commitValue = useCallback(() => {
        validate();
        if (!error) {
            setValue(innerValue);
        }
    }, [innerValue, error, validate]);

    useEffect(() => {
        if (updateOn === 'blur' && isBlurred) {
            commitValue();
        }
    }, [isBlurred, updateOn, commitValue]);

    useEffect(() => {
        if (updateOn === 'change') {
            commitValue();
        }
    }, [updateOn, commitValue, innerValue]);

    const focus = () => {

    };

    const blur = () => {
        setBlurred(true);
    };

    const updateValue: StateSetter<T> = arg => {
        setInnerValue(arg);
        setBlurred(false);
    };

    return {
        value,
        setValue: updateValue,
        innerValue,
        error,
        blur,
        focus
    };
}
