import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

const TestHook = ({ callback }: { callback: Function }) => {
  act(() => callback());
  return null;
};

export const testHook = (callback: Function) => {
  return act(() => {
    mount(<TestHook callback={callback} />);
  });
};
