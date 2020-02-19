import { DEBOUNCE_STRATEGY } from "./debounceOnChangeStrategy";
import { ON_BLUR_STRATEGY } from "./onBlurStrategy";
import { ON_CHANGE_STRATEGY } from "./onChangeStrategy";

//todo use declaration merging instead

export type UPDATE_STRATEGY =
  | typeof DEBOUNCE_STRATEGY
  | typeof ON_BLUR_STRATEGY
  | typeof ON_CHANGE_STRATEGY;
