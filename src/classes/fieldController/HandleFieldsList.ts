import FormFullHandler from "../FormFullHandler";
import {
  AsyncValidationType,
  ErrorMessageType,
  FieldRef,
  FieldValueType,
  FieldHandlerParams,
  MaskToSubmitType,
  MaskType,
  ValidationType,
} from "./types/FieldHandler";
import { FFDataReturnType } from "../types/FormFullHandler";
import { CurrentValuesType, Fields } from "./types/HandleFieldsList";
import { FieldHandler } from "./FieldHandler";

class HandleFieldsList {
  formFields: Fields = {};
  fieldNames: Array<string> = [];
  currentValues: CurrentValuesType = {};

  private invalidNameError(name: string): void {
    throw new Error(
      `The "form-full" field expects to receive the "name" property as a string, but it received a "${typeof name}".`
    );
  }

  private fieldAlreadyExist(name: string): void {
    throw new Error(`The field "${name}" has already been created.`);
  }

  private cantGetField(name: string): void {
    throw new Error(
      `The field "${name}" doesn't exist and cannot be used/modified.`
    );
  }

  private treatUpdateField = (
    name: string,
    formFields: Fields,
    callback: () => any
  ) => {
    if (typeof name !== "string") {
      this.invalidNameError(name);
    } else if (formFields[name]) {
      return callback();
    } else {
      this.cantGetField(name);
    }
  };

  setNewField = (name: string, fieldParams: FieldHandlerParams): void => {
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

  setCurrentValues = (currentValues: CurrentValuesType): void => {
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

  setFieldDefaultValue = (name: string, defaultValue: FieldValueType): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setDefaultValue(defaultValue);
    });
  };
  setFieldLabel = (name: string, label: string): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setLabel(label);
    });
  };

  setFieldMask = (name: string, mask: MaskType): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMask(mask);
    });
  };
  setFieldMaskToSubmit = (
    name: string,
    maskToSubmit: MaskToSubmitType
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMaskToSubmit(maskToSubmit);
    });
  };
  setFieldValidation = (name: string, validation: ValidationType): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValidation(validation);
    });
  };

  setFieldAsyncValidation = (
    name: string,
    asyncValidation: AsyncValidationType
  ): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setAsyncValidation(asyncValidation);
    });
  };

  getFieldRef = (name: string): FieldRef => {
    return this.treatUpdateField(name, this.formFields, () => {
      return this.formFields[name].getRef();
    });
  };

  setValue = (name: string, value: FieldValueType): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].handleValue(value);
    });
  };

  setFormValue = (name: string, value: FieldValueType): void => {
    this.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValue(value);
    });
  };

  private _getValueToSubmit = (
    name: string,
    ffHandler: FormFullHandler
  ): any => {
    const value = this.getValue(name, false, ffHandler);
    if (Boolean(value) || value === 0) {
      return this.formFields[name].getFormatedValueToSubmit(ffHandler);
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

  clearSpecificFields = (names: Array<string>, setDefault: boolean): void => {
    names.forEach((name) => {
      this.clearValue(name, setDefault);
    });
  };

  private _getValue = (name: string): any => {
    return this.formFields[name].value;
  };

  private _getFinalValue = (name: string, ffHandler: FormFullHandler): any => {
    const { maskToSubmit, value } = this.formFields[name];
    const selectedValue = value;
    const withMask = selectedValue && maskToSubmit;
    return withMask && maskToSubmit
      ? maskToSubmit(selectedValue, ffHandler)
      : selectedValue;
  };

  getValue = (
    name: string,
    withMaskToSubmit: boolean,
    ffHandler: FormFullHandler
  ): FieldValueType => {
    if (this.formFields[name]) {
      return withMaskToSubmit
        ? this._getFinalValue(name, ffHandler)
        : this._getValue(name);
    }
  };

  getActualValue = (name: string): FieldValueType => {
    return this.currentValues[name];
  };

  getValues = (ffHandler: FormFullHandler): FFDataReturnType => {
    const data: FFDataReturnType = {};
    this.fieldNames.forEach((name) => {
      data[name] = this._getValueToSubmit(name, ffHandler);
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

  getValidValues = (
    saveToSubmit: boolean,
    ffHandler: FormFullHandler
  ): FFDataReturnType => {
    const data: FFDataReturnType = {};
    this.fieldNames.forEach((name) => {
      const input = this.formFields[name];
      if (!input.error) {
        data[name] = saveToSubmit
          ? this._getValueToSubmit(name, ffHandler)
          : input.value;
      }
    });
    return data;
  };

  private _testErrorAndReturnData = async (
    name: string,
    ffHandler: FormFullHandler,
    concatErrorMessages: (
      label: string | undefined,
      errorMessage: ErrorMessageType
    ) => void,
    errorCallback: () => void
  ): Promise<FFDataReturnType> => {
    const errorMessage = await this.testFieldError(name, true, ffHandler);
    if (errorMessage) {
      concatErrorMessages(this.formFields[name].label, errorMessage);
      errorCallback();
    }
    return this._getValueToSubmit(name, ffHandler);
  };

  testFieldError = async (
    name: string,
    shouldUpdateInput: boolean,
    ffHandler: FormFullHandler
  ): Promise<ErrorMessageType> => {
    return await this.treatUpdateField(name, this.formFields, () => {
      return this.formFields[name].validate(shouldUpdateInput, ffHandler);
    });
  };

  testErrorsAndReturnData = async (
    ffHandler: FormFullHandler,
    concatErrorMessages: (
      label: string | undefined,
      errorMessage: ErrorMessageType
    ) => void
  ): Promise<{ hasError: boolean; data: FFDataReturnType }> => {
    let hasError = false;
    const data: FFDataReturnType = {};

    await Promise.all(
      this.fieldNames.map(async (name) => {
        const value = await this._testErrorAndReturnData(
          name,
          ffHandler,
          concatErrorMessages,
          () => {
            if (!hasError) {
              this.setFieldFocus(name);
              hasError = true;
            }
          }
        );
        if (value !== undefined) {
          data[name] = value;
        }

        return null;
      })
    );
    return { hasError, data };
  };
}

export { HandleFieldsList };
