import { testHook } from '../tests/mount-hook';
import { act } from 'react-dom/test-utils';
import { useFormControl, FormControlApi } from './useFormControl';
import { useValidationRunner } from './useValidationRunner';

jest.mock('./useValidationRunner', () => {
    const validate = jest.fn();

    return {
        useValidationRunner: jest.fn().mockImplementation(() => {
            return {
                validate
            }
        })
    };
});

describe('useFormControl', () => {
    const initialState = {a: 1, b: 2};
    let sut: FormControlApi;

    beforeEach(() => {
        testHook(() => {
            sut = useFormControl({
                defaultValue: initialState
            });
        })
    });

    it('should have initial state', () => {
        const formState = sut.value;

        expect(formState).toEqual(initialState);
    });

    describe('Update strategy', () => {
        let validator: jest.Mock<any>;
        let mockValidate: jest.Mock;

        beforeEach(() => {
            validator = jest.fn();
            mockValidate = useValidationRunner('', jest.fn()).validate as jest.Mock;
            mockValidate.mockReset();
        });

        describe('On change', () => {
            const newValue = 'new value';

            beforeEach(() => {
                testHook(() => {
                    sut = useFormControl({
                        validator,
                        updateOn: 'change'
                    })
                });

            });

            it('should apply validation on change', () => {
                act(() =>  sut.setValue(newValue));

                expect(mockValidate).toHaveBeenCalled();
            });

            it('should update value', () => {
                act(() =>  sut.setValue(newValue));

                expect(sut.value).toEqual(newValue);
            });
        });

        describe('On blur', () => {
            const newValue = 'new value';
            const defaultValue = 'initial state';

            beforeEach(() => {
                testHook(() => {
                    sut = useFormControl({
                        defaultValue,
                        validator,
                        updateOn: 'blur'
                    })
                });

                mockValidate.mockReset();
                act(() =>  sut.setValue(newValue));
            });

            it('should apply validation on blur', () => {
                expect(mockValidate).not.toHaveBeenCalled();

                act(() => {
                    sut.blur();
                });

                expect(mockValidate).toHaveBeenCalled();
            });

            it('should update value on blur', () => {
                expect(sut.value).toEqual(defaultValue);

                act(() => {
                    sut.blur();
                });

                expect(sut.value).toEqual(newValue);
            });
        });
    });
});

