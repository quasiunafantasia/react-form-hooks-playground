export type StrategyRunner = (callback: Function) => void;

// todo fix type - args are lost
export type StrategyConfig = (...args: any[]) => StrategyRunner;

export type Predicate = (x: any) => boolean;

export interface StrategyRunnerConfig {
    runner: StrategyRunner;
    predicate: Predicate;
}

export function useStrategyRunner(strategies: StrategyRunnerConfig[], usedStrategy: any, callback: Function) {
    const callbacks = strategies.map(({predicate}) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return () => {
            if (predicate(usedStrategy)) {
                callback();
            }
        };
    });

    strategies.forEach(({runner}, index) => runner(callbacks[index]));
}
