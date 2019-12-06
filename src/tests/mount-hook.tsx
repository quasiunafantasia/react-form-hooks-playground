import React from 'react';
import { mount } from 'enzyme';

const TestHook = ({ callback }) => {
    callback();
    return null;
};

export const testHook = (callback: Function) => {
    return mount(<TestHook callback={callback} />);
};
