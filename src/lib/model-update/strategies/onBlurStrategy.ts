import { useEffect } from "react";
import { StrategyConfig } from "../useStrategyRunner";
import { UPDATE_STRATEGY } from "./strategy.type";

export const ON_BLUR_STRATEGY = "ON_BLUR_STRATEGY";

export const isOnBlurStrategy = (strategy: UPDATE_STRATEGY) =>
  strategy && strategy === ON_BLUR_STRATEGY;

export const createUseOnBlur: StrategyConfig = (isBlurred: boolean) =>
  function useOnBlur(callback: Function) {
    useEffect(() => {
      if (isBlurred) {
        callback();
      }
    });
  };
