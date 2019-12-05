import { testHook } from '../tests/mount-hook';
import { act } from 'react-dom/test-utils';
import { useFormControl, FormControlApi } from './use-form-control';

describe('useForm', () => {
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

    describe('Updating value', () => {
        it('should patch form value', () => {
            const patchedValue = {a: 2};
            act(() => {
                sut.setValue((prev: any) => ({...prev, ...patchedValue}));
            });

            expect(sut.value).toEqual({...initialState, ...patchedValue});
        });

        it('should set form value', () => {
            const newValue = {a: 2};
            act(() => {
                sut.setValue(newValue);
            });

            expect(sut.value).toEqual(newValue);
        });
    });

    describe('Validation', () => {
        let validator: jest.Mock<any>;

        beforeEach(() => {
            validator = jest.fn();
        });

        describe('Update on change', () => {
            beforeEach(() => {
                testHook(() => {
                    sut = useFormControl({
                        validator,
                        updateOn: 'change'
                    })
                })
            });

            it('should apply validation on change', () => {
                const newValue = 'some new value';
                act(() => {
                    sut.setValue(newValue);
                });

                expect(validator).toHaveBeenCalledWith(newValue);
            });

            it('should set errors', () => {
                const newValue = 'some new value';
                const error = 'Required';

                validator.mockReturnValue(error);

                act(() => {
                    sut.setValue(newValue);
                });

                expect(sut.error).toEqual(error);
            });
        });
    });

});

