import React, { ChangeEvent, useState } from "react";
import { DEBOUNCE_STRATEGY } from "../lib/model-update/strategies/debounceOnChangeStrategy";
import { ON_BLUR_STRATEGY } from "../lib/model-update/strategies/onBlurStrategy";
import { ON_CHANGE_STRATEGY } from "../lib/model-update/strategies/onChangeStrategy";
import { UPDATE_STRATEGY } from "../lib/model-update/strategies/strategy.type";
import { VALIDITY_STATUSES } from "../lib/model-update/usePreValidator";
import { useFormControl } from "../lib/useFormControl";

export const FormControlExample = () => {
  const validator = (value: any) =>
    value && value.length > 7 ? "Too long" : undefined;
  const asyncValidator = (value: any) =>
    new Promise(resolve =>
      setTimeout(() => {
        if (!value) {
          resolve();
          return;
        }
        if (value && value[0] !== value[0].toUpperCase()) {
          resolve("Should start with capital (async)");
        }
        resolve();
      }, 1000)
    );

  const [updateStrategy, setUpdateStrategy] = useState<UPDATE_STRATEGY>(
    ON_CHANGE_STRATEGY
  );
  const { value, setValue, status, error, blur } = useFormControl({
    defaultValue: "hello",
    validator,
    asyncValidator,
    updateOn: updateStrategy,
    debounce: 1000
  });

  const onUpdateStrategySelect = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateStrategy(e.target.value as UPDATE_STRATEGY);
  };

  return (
    <div>
      <h2>This is a simple demo for useFormControl react hook</h2>
      <h3>It applies a synchronous validator of maxlength {"<"} 6</h3>
      <h3>
        and an async validator with delay, that checks if value starts with
        capital letter
      </h3>
      <br />
      <h2>Select form control update strategy</h2>
      <div className="radio">
        <label>
          <input
            type="radio"
            value={ON_CHANGE_STRATEGY}
            checked={updateStrategy === ON_CHANGE_STRATEGY}
            onChange={onUpdateStrategySelect}
          />
          On change
        </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value={ON_BLUR_STRATEGY}
            checked={updateStrategy === ON_BLUR_STRATEGY}
            onChange={onUpdateStrategySelect}
          />
          On blur
        </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value={DEBOUNCE_STRATEGY}
            checked={updateStrategy === DEBOUNCE_STRATEGY}
            onChange={onUpdateStrategySelect}
          />
          Debounce 500
        </label>
      </div>

      {/* TODO use hook to pass props */}
      <input
        type="text"
        // value={innerValue}
        onChange={e => setValue(e.target.value)}
        onBlur={blur}
      />

      <div>Error: {error}</div>
      <div>Value: {value}</div>
      <div>Status: {VALIDITY_STATUSES[status]}</div>
    </div>
  );
};

// FormControlExample.whyDidYouRender = {
//     logOnDifferentValues: true,
//     trackHooks: true
// };
