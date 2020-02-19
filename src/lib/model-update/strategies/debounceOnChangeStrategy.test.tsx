import { mount, ReactWrapper } from "enzyme";
import { useCallback } from "react";
import * as React from "react";
import { act } from "react-dom/test-utils";
import { createUseDebounceOnChangeStrategy } from "./debounceOnChangeStrategy";

jest.useFakeTimers();

describe("debounceOnChangeStrategy", () => {
  const value = "initial value";
  const callback = jest.fn();
  const delay = 500;
  const TestComponent = ({ value, callback }: any) => {
    const _callback = useCallback(() => callback(), [value]);
    createUseDebounceOnChangeStrategy(delay)(_callback);
    return <div />;
  };

  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(<TestComponent value={value} callback={callback} />);
    callback.mockReset();
  });

  it("should run a callback instantly when there is no pending change", async () => {
    jest.advanceTimersByTime(delay + 100);
    const newValue = "new value";
    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ value: newValue }, resolve);
        })
    );

    expect(callback).toHaveBeenCalled();
  });

  it("should NOT run a callback for the second time within delay", async () => {
    const newValue = "new value";
    const evenNewerValue = "brand new value v2.0";
    callback.mockReset();

    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ value: newValue }, resolve);
        })
    );

    jest.advanceTimersByTime(delay / 2);

    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ value: evenNewerValue }, resolve);
        })
    );

    expect(callback).not.toHaveBeenCalled();
  });

  it("should run callback with latest params a after delay", async () => {
    const newValue = "new value";
    const evenNewerValue = "brand new value v2.0";
    callback.mockReset();

    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ value: newValue }, resolve);
        })
    );

    jest.advanceTimersByTime(delay / 2);

    expect(callback).not.toHaveBeenCalled();

    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ value: evenNewerValue }, resolve);
        })
    );

    jest.advanceTimersByTime(delay);

    expect(callback).toHaveBeenCalled();
  });

  it("should clear the timeout on unmount", async () => {
    const newValue = "new value";

    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ value: newValue }, resolve);
        })
    );

    callback.mockReset();

    wrapper.unmount();
    jest.advanceTimersByTime(delay);

    expect(callback).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
