import { MutableRefObject, useCallback, useState } from 'react';
import { createUseDebounceOnChangeStrategy, isDebounceStrategy } from './model-update/strategies/debounceOnChangeStrategy';
import { createUseOnBlur, isOnBlurStrategy } from './model-update/strategies/onBlurStrategy';
import { createUseOnChange, isOnchangeStrategy, ON_CHANGE_STRATEGY } from './model-update/strategies/onChangeStrategy';
import { UPDATE_STRATEGY } from './model-update/strategies/strategy.type';
import { AsyncValidator, usePreValidator, Validator } from './model-update/usePreValidator';
import { useStrategyRunner } from './model-update/useStrategyRunner';
import { StateSetter } from './types';


export type FormControlConfig<T, Errors, AsyncErrors> = {
    defaultValue?: T;
    updateOn?: UPDATE_STRATEGY;
    validator?: Validator<T, Errors>;
    asyncValidator?: AsyncValidator<T, AsyncErrors>;
    ref?: MutableRefObject<HTMLElement>;
    debounce?: number;
};

// export interface FormControlApi<T = any, Errors = string> {
//     value: Maybe<T>;
//     innerValue: Maybe<T>;
//     setValue: StateSetter<T>;
//     error: Maybe<Errors>;
//     focus: () => void;
//     blur: () => void;
// }

export function useFormControl<T = any, Errors = string, AsyncErrors = string>(config: FormControlConfig<T, Errors, AsyncErrors> = {}) {
    const defaultValue = config.defaultValue;
    const updateOn: UPDATE_STRATEGY = config.updateOn || ON_CHANGE_STRATEGY;
    const [isBlurred, setBlurred] = useState(true);
    const [innerValue, setInnerValue] = useState(defaultValue);

    const debounceStrategyRunner = createUseDebounceOnChangeStrategy(config.debounce);
    const onBlurStrategyRunner = createUseOnBlur(isBlurred);
    const onChangeStrategyRunner = createUseOnChange();
    const { error, value, setValue, status } = usePreValidator(config.validator, config.asyncValidator);

    const cb = useCallback(() => {
        //todo fix type
        setValue(innerValue as any);
    }, [setValue, innerValue]);

    // todo behavior for initial value?
    // if (defaultValue) {
    //     setValue(defaultValue);
    // }

    useStrategyRunner([
        {
            runner: debounceStrategyRunner,
            predicate: isDebounceStrategy
        },
        {
            runner: onBlurStrategyRunner,
            predicate: isOnBlurStrategy
        },
        {
            runner: onChangeStrategyRunner,
            predicate: isOnchangeStrategy
        }
    ], updateOn, cb);


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
        focus,
        status
    };
}
