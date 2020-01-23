import { useCallback, useEffect, useRef } from 'react';
import { Maybe } from '../../types';
import { StrategyConfig } from '../useStrategyRunner';
import { UPDATE_STRATEGY } from './strategy.type';

type Timeout = NodeJS.Timeout;

export const DEBOUNCE_STRATEGY = 'DEBOUNCE_STRATEGY';

export const isDebounceStrategy = (strategy: UPDATE_STRATEGY) => strategy && strategy === DEBOUNCE_STRATEGY;

export const createUseDebounceOnChangeStrategy: StrategyConfig =
    (debounce: number) => function useDebounce(callback: Function) {
        const timerRef = useRef<Maybe<Timeout>>();

        const debouncedCallback = useCallback(() => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    callback();
                    timerRef.current = null;
                }, debounce);
            } else {
                callback();
                timerRef.current = setTimeout(() => {
                    timerRef.current = null;
                }, debounce);
            }
        }, [callback]);

        useEffect(() => {
            debouncedCallback();
        }, [debouncedCallback]);

        useEffect(() => {
            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        }, []);
    };
