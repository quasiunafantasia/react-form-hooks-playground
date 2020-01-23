import { useEffect } from 'react';
import { StrategyConfig } from '../useStrategyRunner';
import { UPDATE_STRATEGY } from './strategy.type';

export const ON_CHANGE_STRATEGY = 'ON_CHANGE_STRATEGY';

export const isOnchangeStrategy = (strategy: UPDATE_STRATEGY) => strategy && strategy === ON_CHANGE_STRATEGY;


export const createUseOnChange: StrategyConfig = () => function useOnChange(callback: Function) {
    useEffect(() => {
        callback();
    });
};

