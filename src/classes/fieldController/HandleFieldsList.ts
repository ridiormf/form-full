import FormFullHandler from "../FormFullHandler";
import {
  ErrorMessageType,
  FieldRef,
  FieldHandlerParams,
  MaskType,
  ValidationType,
} from "./FieldHandler-types";
import { Fields } from "./HandleFieldsList-types";
import FieldHandler from "./FieldHandler";
import { Name } from "../FormFullHandler-types";
import { throwError } from "../../utils/errors";

class HandleFieldsList<FormData extends any> {
  private formFields: Fields<unknown, FormData> = {};
  private fieldNames: Name<FormData>[] = [];
  private currentValues = {} as Partial<FormData>;
  private ffHandler: FormFullHandler<FormData>;

  constructor(ffHandler: FormFullHandler<FormData>) {
    this.ffHandler = ffHandler;
  }

  private static invalidNameError(name: string): void {
    throwError(
      `Field expects to receive the "name" property as a string, but it received a "${typeof name}".`,
    );
  }

  private static fieldAlreadyExist(name: string): void {
    throwError(`The field "${name}" has already been created.`);
  }

  private static cantGetField(name: string): void {
    throwError(
      `The field "${name}" doesn't exist and cannot be used/modified.`,
    );
  }

  private treatUpdateField = (
    name: Name<FormData>,
    formFields: Fields<unknown, FormData>,
    callback: () => any,
  ) => {
    if (typeof name !== "string") {
      HandleFieldsList.invalidNameError(name);
    } else if (formFields[name]) {
      return callback();
    } else {
      HandleFieldsList.cantGetField(name);
    }
  };

  setNewField = (
    name: Name<FormData>,
    fieldParams: FieldHandlerParams<unknown, FormData>,
  ): void => {
    if (typeof name !== "string") {
      HandleFieldsList.invalidNameError(name);
    } else if (!this.formFields[name]) {
      this.fieldNames.push(name);
      this.formFields[name] = new FieldHandler(fieldParams);

      if (this.currentValues[name]) {
        this.setValue(name, this.currentValues[name]);
      }
    } else {
      HandleFieldsList.fieldAlreadyExist(name);
    }
  };

  removeField = (name: Name<FormData>): void => {
    this.treatUpdateField(name, this.formFields, () => {
      delete this.formFields[name];
      const nameIndex = this.fieldNames.indexOf(name);
      this.fieldNames.splice(nameIndex, 1);
    });
  };

  setCurrentValues = (currentValues: Partial<FormData>): void => {
    if (currentValues) {
      this.fieldNames.forEach((name) => {
        if (currentValues[name] !== this.currentValues[name]) {
          this.setValue(name, currentValues[name]);
        }
      });
      this.currentValues = currentValues;
    } else {
      this.currentValues = {} as Partial<FormData>;
    }
  };

  setAllDisabled = (disabled: boolean): void => {
    this.fieldNames.forEach((name) => {
      this.formFields[name].disableHandler(!!disabled);
    });
  };

  setFieldRequired = (
    name: Name<FormData>,
    required: ErrorMessageType,
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setRequired(required);
    });
  };

  setFieldDefaultValue = (name: Name<FormData>, defaultValue: any): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setDefaultValue(defaultValue);
    });
  };

  setFieldMask = (
    name: Name<FormData>,
    mask?: MaskType<unknown, FormData>,
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMask(mask);
    });
  };
  setFieldMaskToSubmit = (
    name: Name<FormData>,
    maskToSubmit?: MaskType<unknown, FormData>,
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMaskToSubmit(maskToSubmit);
    });
  };
  setFieldValidations = (
    name: Name<FormData>,
    validations?: ValidationType<unknown, FormData>[],
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValidations(validations);
    });
  };

  getFieldRef = (name: Name<FormData>): FieldRef => {
    return this.treatUpdateField(name, this.formFields, () => {
      return this.formFields[name].getRef();
    });
  };

  setValue = (name: Name<FormData>, value?: any): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].handleValue(value);
    });
  };

  setFormValue = (name: Name<FormData>, value: any): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValue(value);
    });
  };

  private _getValueToSubmit = (name: Name<FormData>): any => {
    const value = this.getValue(name, false);
    if (Boolean(value) || value === 0) {
      return this.formFields[name].getFormattedValueToSubmit();
    }
  };

  clearValue = (name: Name<FormData>, setDefault: boolean): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].clearValue(setDefault);
    });
  };

  clearFields = (setDefault: boolean): void => {
    this.fieldNames.forEach((name) => {
      this.clearValue(name, setDefault);
    });
  };

  clearSpecificFields = (
    names: Name<FormData>[],
    setDefault: boolean,
  ): void => {
    names.forEach((name) => {
      this.clearValue(name, setDefault);
    });
  };

  private _getValue = (name: Name<FormData>): any => {
    return this.formFields[name].value;
  };

  private _getFinalValue = (name: Name<FormData>): any => {
    const { maskToSubmit, value } = this.formFields[name];
    const selectedValue = value;
    const withMask = selectedValue && maskToSubmit;
    return withMask && maskToSubmit
      ? maskToSubmit(selectedValue, this.ffHandler)
      : selectedValue;
  };

  getValue = (name: Name<FormData>, withMaskToSubmit: boolean): any => {
    if (this.formFields[name]) {
      return withMaskToSubmit
        ? this._getFinalValue(name)
        : this._getValue(name);
    }
  };

  getActualValue = (name: Name<FormData>): any => {
    return this.currentValues[name];
  };

  getValues = (): FormData => {
    const data = {} as FormData;
    this.fieldNames.forEach((name) => {
      data[name] = this._getValueToSubmit(name);
      return null;
    });
    return data;
  };

  setFieldFocus = (name: Name<FormData>): void => {
    const ref = this.getFieldRef(name);
    if (ref) {
      ref.focus();
    }
  };

  getValidValues = (saveToSubmit: boolean): FormData => {
    const data = {} as FormData;
    this.fieldNames.forEach((name) => {
      const input = this.formFields[name];
      if (!input.error) {
        data[name] = saveToSubmit ? this._getValueToSubmit(name) : input.value;
      }
    });
    return data;
  };

  private _testErrorAndReturnData = async (
    name: Name<FormData>,
    errorCallback: () => void,
  ): Promise<FormData[typeof name]> => {
    const errorMessage = await this.testFieldError(name, true);
    if (errorMessage) {
      errorCallback();
    }
    return this._getValueToSubmit(name);
  };

  testFieldError = async (
    name: Name<FormData>,
    shouldUpdateInput: boolean,
  ): Promise<ErrorMessageType> => {
    return await this.treatUpdateField(name, this.formFields, () => {
      return this.formFields[name].validate(shouldUpdateInput);
    });
  };

  testErrorsAndReturnData = async (): Promise<{
    hasError: boolean;
    data: FormData;
  }> => {
    let hasError = false;
    const data = {} as FormData;

    await Promise.all(
      this.fieldNames.map(async (name) => {
        const value = await this._testErrorAndReturnData(name, () => {
          if (!hasError) {
            this.setFieldFocus(name);
            hasError = true;
          }
        });
        if (value !== undefined) {
          data[name] = value;
        }

        return null;
      }),
    );
    return { hasError, data };
  };
}

export { HandleFieldsList };
