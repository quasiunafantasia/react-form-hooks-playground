import { act } from 'react-dom/test-utils';
import { testHook } from '../tests/mount-hook';
import { useDebounce } from './useDebounce';

describe('UseDebounce', () => {
    const delay = 500;
    let callback: jest.Mock;
    let sut: ReturnType<typeof useDebounce>;
    let wrapper: any;

    beforeEach(() => {
        jest.useFakeTimers();
        callback = jest.fn();
        wrapper = testHook(() => {
            sut = useDebounce(callback, delay);
        });
    });

    it('should make first call', () => {
        sut.callback();

        expect(callback).toHaveBeenCalled();
    });

    it('should NOT run a callback again in given interval', () => {
        act(() => sut.callback());
        callback.mockReset();
        jest.advanceTimersByTime(delay / 2);
        act(() => sut.callback());

        expect(callback).not.toHaveBeenCalled();
    });

    it('should run callback with latest params a after delay', () => {
        const variable = 42;
        const runCb =  value => act(() => sut.callback(value));

        runCb(1);
        callback.mockReset();

        runCb(2);
        runCb(3);
        runCb(variable);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(delay  + 1);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(variable);
    });

    it('should clear the timeout on unmount', () => {
        act(() => sut.callback());
        jest.advanceTimersByTime(delay/2);

        callback.mockReset();
        act(() => sut.callback());

        wrapper.unmount();
        jest.advanceTimersByTime(delay/2);

        expect(callback).not.toHaveBeenCalled();
    });
});
