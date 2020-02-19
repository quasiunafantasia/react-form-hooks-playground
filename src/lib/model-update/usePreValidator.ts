import { useRef, useState } from "react";
import { Maybe } from "../types";

export type Validator<T, Errors> = (value: Maybe<T>) => Maybe<Errors>;
export type AsyncValidator<T, Errors> = (
  value: Maybe<T>
) => Promise<Maybe<Errors>>;

export enum VALIDITY_STATUSES {
  "PENDING",
  "VALID",
  "INVALID"
}

export const noopValidator = () => null;
export const noopAsyncValidator = () => Promise.resolve(null);

//todo consider config object to set only async validator easier
export function usePreValidator<T, Errors, AsyncErrors>(
  validator: Validator<T, Errors> = noopValidator,
  asyncValidator: AsyncValidator<T, AsyncErrors> = noopAsyncValidator
) {
  const previousValue = useRef<Maybe<T>>(null);
  const [error, setError] = useState();
  const [value, setValue] = useState<Maybe<T>>();
  const [status, setStatus] = useState(VALIDITY_STATUSES.PENDING);

  const invalidate = (errors: Errors | AsyncErrors) => {
    setValue(null);
    setStatus(VALIDITY_STATUSES.INVALID);
    setError(errors);
  };

  const trySetValue = (value: T) => {
    if (previousValue.current === value) {
      return;
    }

    previousValue.current = value;

    setStatus(VALIDITY_STATUSES.PENDING);

    const newErrors = validator(value);
    //todo add a flag to run/avoid running async validators on synchronous error
    if (newErrors) {
      invalidate(newErrors);
      return;
    }

    setStatus(VALIDITY_STATUSES.PENDING);

    asyncValidator(value).then(asyncErrors => {
      if (asyncErrors) {
        invalidate(asyncErrors);
        return;
      }

      setStatus(VALIDITY_STATUSES.VALID);
      setValue(value);
      setError(null);
    });
  };

  return {
    error,
    value,
    status,
    setValue: trySetValue
  };
}
