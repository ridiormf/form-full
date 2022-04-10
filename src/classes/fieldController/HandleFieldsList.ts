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
import { FormFullData } from "../FormFullHandler-types";
import { throwError } from "../../utils/errors";

class HandleFieldsList<FormType> {
  private formFields: Fields<FormType> = {};
  private fieldNames: string[] = [];
  private currentValues: FormFullData<FormType> = {};
  private ffHandler: FormFullHandler<FormType>;

  constructor(ffHandler: FormFullHandler<FormType>) {
    this.ffHandler = ffHandler;
  }

  private invalidNameError(name: string): void {
    throwError(
      `Field expects to receive the "name" property as a string, but it received a "${typeof name}".`,
    );
  }

  private fieldAlreadyExist(name: string): void {
    throwError(`The field "${name}" has already been created.`);
  }

  private cantGetField(name: string): void {
    throwError(
      `The field "${name}" doesn't exist and cannot be used/modified.`,
    );
  }

  private treatUpdateField = (
    name: string,
    formFields: Fields<FormType>,
    callback: () => any,
  ) => {
    if (typeof name !== "string") {
      this.invalidNameError(name);
    } else if (formFields[name]) {
      return callback();
    } else {
      this.cantGetField(name);
    }
  };

  setNewField = (
    name: string,
    fieldParams: FieldHandlerParams<FormType>,
  ): void => {
    if (typeof name !== "string") {
      this.invalidNameError(name);
    } else if (!this.formFields[name]) {
      this.fieldNames.push(name);
      this.formFields[name] = new FieldHandler(fieldParams);

      if (this.currentValues[name]) {
        this.setValue(name, this.currentValues[name]);
      }
    } else {
      this.fieldAlreadyExist(name);
    }
  };

  removeField = (name: string): void => {
    this.treatUpdateField(name, this.formFields, () => {
      delete this.formFields[name];
      const nameIndex = this.fieldNames.indexOf(name);
      this.fieldNames.splice(nameIndex, 1);
    });
  };

  setCurrentValues = (currentValues: FormFullData<FormType>): void => {
    if (currentValues) {
      this.fieldNames.forEach((name) => {
        if (currentValues[name] !== this.currentValues[name]) {
          this.setValue(name, currentValues[name] ?? "");
        }
      });
      this.currentValues = currentValues;
    } else {
      this.currentValues = {};
    }
  };

  setAllDisabled = (disabled: boolean): void => {
    this.fieldNames.forEach((name) => {
      this.formFields[name].disableHandler(!!disabled);
    });
  };

  setFieldRequired = (name: string, required: ErrorMessageType): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setRequired(required);
    });
  };

  setFieldDefaultValue = (name: string, defaultValue: any): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setDefaultValue(defaultValue);
    });
  };

  setFieldMask = (name: string, mask: MaskType<FormType>): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMask(mask);
    });
  };
  setFieldMaskToSubmit = (
    name: string,
    maskToSubmit: MaskType<FormType>,
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMaskToSubmit(maskToSubmit);
    });
  };
  setFieldValidation = (
    name: string,
    validation: ValidationType<FormType> | ValidationType<FormType>[],
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValidation(validation);
    });
  };

  getFieldRef = (name: string): FieldRef => {
    return this.treatUpdateField(name, this.formFields, () => {
      return this.formFields[name].getRef();
    });
  };

  setValue = (name: string, value: any): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].handleValue(value);
    });
  };

  setFormValue = (name: string, value: any): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValue(value);
    });
  };

  private _getValueToSubmit = (name: string): any => {
    const value = this.getValue(name, false);
    if (Boolean(value) || value === 0) {
      return this.formFields[name].getFormattedValueToSubmit();
    }
  };

  clearValue = (name: string, setDefault: boolean): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].clearValue(setDefault);
    });
  };

  clearFields = (setDefault: boolean): void => {
    this.fieldNames.forEach((name) => {
      this.clearValue(name, setDefault);
    });
  };

  clearSpecificFields = (names: string[], setDefault: boolean): void => {
    names.forEach((name) => {
      this.clearValue(name, setDefault);
    });
  };

  private _getValue = (name: string): any => {
    return this.formFields[name].value;
  };

  private _getFinalValue = (name: string): any => {
    const { maskToSubmit, value } = this.formFields[name];
    const selectedValue = value;
    const withMask = selectedValue && maskToSubmit;
    return withMask && maskToSubmit
      ? maskToSubmit(selectedValue, this.ffHandler)
      : selectedValue;
  };

  getValue = (name: string, withMaskToSubmit: boolean): any => {
    if (this.formFields[name]) {
      return withMaskToSubmit
        ? this._getFinalValue(name)
        : this._getValue(name);
    }
  };

  getActualValue = (name: string): any => {
    return this.currentValues[name];
  };

  getValues = (): FormFullData<FormType> => {
    const data: FormFullData<FormType> = {};
    this.fieldNames.forEach((name) => {
      data[name] = this._getValueToSubmit(name);
      return null;
    });
    return data;
  };

  setFieldFocus = (name: string): void => {
    const ref = this.getFieldRef(name);
    if (ref) {
      ref.focus();
    }
  };

  getValidValues = (saveToSubmit: boolean): FormFullData<FormType> => {
    const data: FormFullData<FormType> = {};
    this.fieldNames.forEach((name) => {
      const input = this.formFields[name];
      if (!input.error) {
        data[name] = saveToSubmit ? this._getValueToSubmit(name) : input.value;
      }
    });
    return data;
  };

  private _testErrorAndReturnData = async (
    name: string,
    errorCallback: () => void,
  ): Promise<FormFullData<FormType>> => {
    const errorMessage = await this.testFieldError(name, true);
    if (errorMessage) {
      errorCallback();
    }
    return this._getValueToSubmit(name);
  };

  testFieldError = async (
    name: string,
    shouldUpdateInput: boolean,
  ): Promise<ErrorMessageType> => {
    return await this.treatUpdateField(name, this.formFields, () => {
      return this.formFields[name].validate(shouldUpdateInput);
    });
  };

  testErrorsAndReturnData = async (): Promise<{
    hasError: boolean;
    data: FormFullData<FormType>;
  }> => {
    let hasError = false;
    const data: FormFullData<FormType> = {};

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
