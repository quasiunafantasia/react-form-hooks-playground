import { default as React } from "react";
import { act } from "react-dom/test-utils";
import { flushPromises } from "../../tests/flushPromises";
import { testHook } from "../../tests/mount-hook";
import { supressAsyncActWarnings } from "../../tests/supressAsyncActWarning";
import {
  noopValidator,
  VALIDITY_STATUSES,
  usePreValidator
} from "./usePreValidator";

supressAsyncActWarnings();

describe("UsePreValidator", () => {
  const validator = jest.fn();
  const asyncValidator = jest.fn().mockResolvedValue(null);
  let sut: ReturnType<typeof usePreValidator>;

  beforeEach(() => {
    validator.mockReset();
    asyncValidator.mockReset();
  });

  describe("Synchronous validation", () => {
    const valueToSet = "valueToSet";

    beforeEach(() => {
      testHook(() => {
        sut = usePreValidator(validator);
      });
    });

    it("should apply validator to a given value", () => {
      act(() => {
        sut.setValue(valueToSet);
      });

      expect(validator).toHaveBeenCalledWith(valueToSet);
    });

    describe("Value is valid", () => {
      beforeEach(() => {
        validator.mockReturnValue(null);

        act(() => {
          sut.setValue(valueToSet);
        });
      });

      it("should set the new value", () => {
        expect(sut.value).toEqual(valueToSet);
      });

      it("should set error to null", () => {
        expect(sut.error).toEqual(null);
      });

      it("should set status to valid", () => {
        expect(sut.status).toEqual(VALIDITY_STATUSES.VALID);
      });
    });

    describe("Value is invalid", () => {
      const validationError = "validationError";

      beforeEach(() => {
        validator.mockReturnValue(validationError);

        act(() => {
          sut.setValue(valueToSet);
        });
      });

      it("should set value to null", () => {
        expect(sut.value).toEqual(null);
      });

      it("should set error", () => {
        expect(sut.error).toEqual(validationError);
      });

      it("should set status to invalid", () => {
        expect(sut.status).toEqual(VALIDITY_STATUSES.INVALID);
      });
    });
  });

  describe("Asynchronous validation", () => {
    const valueToSet = "valueToSet";

    beforeEach(() => {
      asyncValidator.mockResolvedValue(null);

      testHook(() => {
        sut = usePreValidator(noopValidator, asyncValidator);
      });
    });

    it("should set status to pending on value change", async () => {
      act(() => {
        sut.setValue(valueToSet);
      });

      expect(sut.status).toEqual(VALIDITY_STATUSES.PENDING);
    });

    it("should apply validator to a given value", () => {
      act(() => {
        sut.setValue(valueToSet);
      });

      expect(asyncValidator).toHaveBeenCalledWith(valueToSet);
    });

    describe("Value is valid", () => {
      beforeEach(async () => {
        asyncValidator.mockResolvedValue(null);

        await act(() => {
          sut.setValue(valueToSet);
          return flushPromises();
        });
      });

      it("should set the new value", () => {
        expect(sut.value).toEqual(valueToSet);
      });

      it("should set error to null", () => {
        expect(sut.error).toEqual(null);
      });

      it("should set status to valid", () => {
        expect(sut.status).toEqual(VALIDITY_STATUSES.VALID);
      });
    });

    describe("Value is invalid", () => {
      const validationError = "validationError";

      beforeEach(async () => {
        asyncValidator.mockResolvedValue(validationError);

        await act(() => {
          sut.setValue(valueToSet);
          return flushPromises();
        });
      });

      it("should set value to null", () => {
        expect(sut.value).toEqual(null);
      });

      it("should set error", () => {
        expect(sut.error).toEqual(validationError);
      });

      it("should set status to invalid", () => {
        expect(sut.status).toEqual(VALIDITY_STATUSES.INVALID);
      });
    });

    describe("Both validators present", () => {
      beforeEach(() => {
        testHook(() => {
          sut = usePreValidator(validator, asyncValidator);
        });

        validator.mockResolvedValue("some error");

        act(() => {
          sut.setValue("some value");
        });
      });

      it("should not run async validator if synchronous validator fails", () => {
        expect(asyncValidator).not.toHaveBeenCalled();
      });
    });
  });
});
