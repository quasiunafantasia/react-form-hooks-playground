import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// not able to make the return type of generic function generic :(
type StateSetter<S> = Dispatch<SetStateAction<S | undefined>>;

type Maybe<T> = T | undefined;

type Validator<T, Errors> = (value: T) => Maybe<Errors>;

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



export function useFormControl<T = any, Errors = string>(
    {
        updateOn,
        defaultValue,
        validator
    }: FormControlConfig<T, Errors> = {
        validator: () => undefined,
        updateOn: 'change'
    }): FormControlApi<T, Errors> {

    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<Maybe<Errors>>();

    useEffect(() => {
        if (validator) {
            if (value !== undefined) {
                const validationResult = validator(value);
                setError(validationResult);
            }
        }
    }, [value, updateOn, validator]);

    return {
        value,
        setValue,
        error
    };
}
