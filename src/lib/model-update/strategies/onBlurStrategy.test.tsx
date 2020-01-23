import { useCallback } from 'react';
import { act } from 'react-dom/test-utils';
import { createUseOnBlur } from './onBlurStrategy';
import { createUseOnChange } from './onChangeStrategy';
import * as React  from 'react';
import { mount, ReactWrapper } from 'enzyme';

describe('onBlur strategy', () => {
    // @ts-ignore
    const TestComponent = ({value, callback, isBlurred}) => {
        const _callback = useCallback(() => callback(), [value]);
        createUseOnBlur(isBlurred)(_callback);

        return <div/>
    };

    const value = 'initial value';
    const callback = jest.fn();
    const isBlurred = false;
    let wrapper: ReactWrapper;

    beforeEach(() => {
        wrapper = mount(<TestComponent value={value} callback={callback} isBlurred={isBlurred}/>);

        callback.mockReset();
    });

    it('should NOT run a callback when the value changes but before blur', async () => {
        callback.mockReset();

        await act(() => new Promise<any>((resolve) => {
            wrapper.setProps({value: 'new value'}, resolve);
        }));
        expect(callback).not.toHaveBeenCalled();
    });

    it('should run a callback with a new value changes on blur', async () => {
        const newValue = 'new value';
        await act(() => new Promise<any>((resolve) => {
            wrapper.setProps({value: newValue}, resolve);
        }));

        await act(() => new Promise<any>((resolve) => {
            wrapper.setProps({isBlurred: true}, resolve);
        }));

        expect(callback).toHaveBeenCalled();
    });
});
