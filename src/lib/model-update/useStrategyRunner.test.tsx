import { mount, ReactWrapper } from "enzyme";
import { default as React, useEffect } from "react";
import { act } from "react-dom/test-utils";
import { useStrategyRunner } from "./useStrategyRunner";

describe("UseUpdateStrategyRunner", () => {
  const callback = jest.fn();
  let wrapper: ReactWrapper;

  const firstStrategy = {
    strategy: (firstValue: any) => (callback: any) => {
      useEffect(() => {
        callback();
      }, [firstValue]);
    },
    predicate: (strategy: any) => strategy === 0
  };

  const secondStrategy = {
    strategy: (secondValue: any) => (callback: any) => {
      useEffect(() => {
        callback();
      }, [secondValue]);
    },
    predicate: (strategy: any) => strategy === 1
  };

  // @ts-ignore
  const TestComponent = ({
    firstValue,
    secondValue,
    callback,
    usedStrategy
  }) => {
    const firstStrategyRunner = firstStrategy.strategy(firstValue);
    const secondStrategyRunner = secondStrategy.strategy(secondValue);
    useStrategyRunner(
      [
        {
          runner: firstStrategyRunner,
          predicate: x => x === 0
        },
        {
          runner: secondStrategyRunner,
          predicate: x => x === 1
        }
      ],
      usedStrategy,
      callback
    );

    return <div />;
  };

  beforeEach(() => {
    callback.mockReset();
  });

  beforeEach(() => {
    callback.mockReset();

    wrapper = mount(
      <TestComponent
        firstValue={0}
        callback={callback}
        secondValue={0}
        usedStrategy={0}
      />
    );
  });

  it("should keep applying selected strategy", async () => {
    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ firstValue: 10 }, resolve);
        })
    );

    expect(callback).toHaveBeenCalled();
  });

  it("should NOT apply different strategy", async () => {
    callback.mockReset();

    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ secondValue: 10 }, resolve);
        })
    );

    expect(callback).not.toHaveBeenCalled();
  });

  it("should apply different strategy when strategy is switched", async () => {
    callback.mockReset();

    await act(
      () =>
        new Promise<any>(resolve => {
          wrapper.setProps({ secondValue: 10, usedStrategy: 1 }, resolve);
        })
    );

    expect(callback).toHaveBeenCalled();
  });
});
