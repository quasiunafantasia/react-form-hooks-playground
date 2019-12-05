import { testHook } from '../tests/mount-hook';
import { act } from 'react-dom/test-utils';
import { useValidationRunner } from './useValidationRunner';

describe('useValidator', () => {
    const value = 'some value';
    let validator: jest.Mock;
    let sut: ReturnType<typeof useValidationRunner>;

    beforeEach(() => {
        validator = jest.fn();

        testHook(() => {
            sut = useValidationRunner(value, validator);
        });
    });

    it('should validate when run', () => {
        const error = 'some error';
        validator.mockReturnValue(error);

        act(() => sut.validate());

        expect(validator).toHaveBeenCalledWith(value);
        expect(sut.error).toEqual(error);
    });
});

