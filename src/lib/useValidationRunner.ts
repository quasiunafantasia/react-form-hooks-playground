import { useEffect, useState } from 'react';
import { Maybe } from './types';

export type Validator<T, Errors> = (value: T) => Maybe<Errors>;

export function useValidationRunner<T, Errors> (value: Maybe<T>, validator: Validator<T, Errors>) {
    const [error, setError] = useState<Errors>();

    const validate = () => {
        if (validator) {
            if (value !== undefined) {
                const validationResult = validator(value);
                setError(validationResult);
            }
        }
    };

    return {error, validate};
}
