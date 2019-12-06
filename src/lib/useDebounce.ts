import { useCallback, useEffect, useRef } from 'react';
import { Maybe } from './types';

type callback = (...args: any[]) => any;
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export function useDebounce<T extends callback>(callback: T, delay: number) {
    const timerRef = useRef<{
        timeout?: NodeJS.Timeout,
        pendingArgs?: ArgumentTypes<T> | null
    }>({});

    const setTimer = useCallback(() => {
        // @ts-ignore readonly field in typings
        timerRef.current.timeout = setTimeout(() => {
            // console.log(timerRef.current.pendingArgs)
            //todo set up optional chaning
            if (timerRef && timerRef.current && timerRef.current.pendingArgs) {
                callback(...timerRef.current.pendingArgs);
                // @ts-ignore
                timerRef.current = {...timerRef.current, pendingArgs: null };
                setTimer();
            } else {
                // @ts-ignore readonly field in typings
                timerRef.current = {...timerRef.current, timeout: null};
            }
        }, delay);
    }, [callback, delay]);

    const debouncedCallback = useCallback((...args: ArgumentTypes<T>): Maybe<ReturnType<T>> => {
        // console.log(timerRef.current.timeout);

        if (timerRef && timerRef.current && timerRef.current.timeout) {
            // @ts-ignore
            timerRef.current = {...timerRef.current, pendingArgs: args };
            return
        }

        setTimer();
        return callback(...args);
    }, [setTimer, callback]);

    useEffect(() => {
        return () => {
            if (timerRef.current && timerRef.current.timeout) {
                clearTimeout(timerRef.current.timeout);
            }
        };
    }, []);

    return {
        callback: debouncedCallback
    }
}
