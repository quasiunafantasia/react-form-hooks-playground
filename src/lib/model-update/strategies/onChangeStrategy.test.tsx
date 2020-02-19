import { act } from "react-dom/test-utils";
import { createUseOnChange } from "./onChangeStrategy";
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

describe("onChange strategy", () => {
  // @ts-ignore
  const TestComponent = ({ value, callback }) => {
    createUseOnChange()(callback);
    return <div />;
  };

  const value = "initial value";
  const callback = jest.fn();
  let wrapper: ReactWrapper;

  beforeEach(() => {
    callback.mockReset();

    wrapper = mount(<TestComponent value={value} callback={callback} />);
  });

  it("should run a callback when the value changes", async () => {
    const newValue = "newValue";
    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ value: newValue }, resolve);
        })
    );
    expect(callback).toHaveBeenCalled();
  });

  it("should run a new callback when it changes", async () => {
    const newCallback = jest.fn();
    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ callback: newCallback }, resolve);
        })
    );
    expect(newCallback).toHaveBeenCalled();
  });
});
