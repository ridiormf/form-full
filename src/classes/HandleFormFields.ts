import FormHandler from "../FormHandler";
import {
  ErrorMessageType,
  FieldRef,
  FieldValueType,
  FormFieldHandlerContructor,
  MaskToSubmitType,
  MaskType,
  ValidationType,
} from "../types/FormFieldHandler";
import { DataReturnType } from "../types/FormHandler";
import { ActualValues, FormFields } from "../types/HandleFormFields";
import { FormFieldHandler } from "./FormFieldHandler";

class HandleFormFields {
  formFields: FormFields = {};
  fieldNames: Array<string> = [];
  actualValues: ActualValues = {};

  static invalidNameError(name: string): void {
    throw new Error(
      `O campo do formConfig espera receber a propriedade "name" como string, mas recebeu um "${typeof name}".`
    );
  }

  static fieldAlreadyExist(name: string): void {
    throw new Error(`O campo "${name}" já foi criado.`);
  }

  static cantDeleteField(name: string): void {
    throw new Error(`O campo "${name}" não existe e não pôde ser deletado.`);
  }

  static cantGetField(name: string): void {
    throw new Error(
      `O campo "${name}" não existe e não pôde ser utilizado/modificado.`
    );
  }

  static treatUpdateField = (
    name: string,
    formFields: FormFields,
    callback: () => any
  ) => {
    if (typeof name !== "string") {
      HandleFormFields.invalidNameError(name);
    } else if (formFields[name]) {
      return callback();
    } else {
      HandleFormFields.cantGetField(name);
    }
  };

  setNewField = (
    name: string,
    fieldParams: FormFieldHandlerContructor
  ): void => {
    if (typeof name !== "string") {
      HandleFormFields.invalidNameError(name);
    } else if (!this.formFields[name]) {
      this.fieldNames.push(name);
      this.formFields[name] = new FormFieldHandler(fieldParams);

      if (this.actualValues[name]) {
        this.setValue(name, this.actualValues[name]);
      }
    } else {
      HandleFormFields.fieldAlreadyExist(name);
    }
  };

  removeField = (name: string): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      delete this.formFields[name];
      const nameIndex = this.fieldNames.indexOf(name);
      this.fieldNames.splice(nameIndex, 1);
    });
  };

  setActualValues = (actualValues: ActualValues): void => {
    if (actualValues) {
      this.fieldNames.forEach((name) => {
        if (actualValues[name] !== this.actualValues[name]) {
          this.setValue(name, actualValues[name] ?? "");
        }
      });
      this.actualValues = actualValues;
    } else {
      this.actualValues = {};
    }
  };

  setAllDisabled = (disabled: boolean): void => {
    this.fieldNames.forEach((name) => {
      this.formFields[name].disableHandler(!!disabled);
    });
  };

  setFieldRequired = (name: string, required: ErrorMessageType): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setRequired(required);
    });
  };

  setFieldDefaultValue = (name: string, defaultValue: FieldValueType): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setDefaultValue(defaultValue);
    });
  };
  setFieldLabel = (name: string, label: string): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setLabel(label);
    });
  };
  setFieldType = (name: string, type: any): void => {
    // TODO input type enum
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setType(type);
    });
  };
  setFieldIsFileValue = (name: string, isFileValue: boolean): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setIsFileValue(isFileValue);
    });
  };

  setFieldMask = (name: string, mask: MaskType): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMask(mask);
    });
  };
  setFieldMaskToSubmit = (
    name: string,
    maskToSubmit: MaskToSubmitType
  ): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setMaskToSubmit(maskToSubmit);
    });
  };
  setFieldValidation = (name: string, validation: ValidationType): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValidation(validation);
    });
  };
  getFieldRef = (name: string): FieldRef => {
    return HandleFormFields.treatUpdateField(name, this.formFields, () => {
      return this.formFields[name].getRef();
    });
  };

  setValue = (name: string, value: FieldValueType): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].handleValue(value);
    });
  };

  setFormValue = (name: string, value: FieldValueType): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValue(value);
    });
  };

  _getValueToSubmit = (name: string, formHandler: FormHandler): any => {
    const value = this.getValue(name, false, formHandler);
    if (Boolean(value) || value === 0) {
      return this.formFields[name].getFormatedValueToSubmit(formHandler);
    }
  };

  _clearValue = (name: string, setDefault: boolean): void => {
    if (setDefault) {
      this.setValueToDefault(name);
    } else {
      this.clearValue(name);
    }
  };

  clearValue = (name: string): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].clearValue();
    });
  };

  setValueToDefault = (name: string): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].setValueToDefault();
    });
  };

  clearAllValues = (setDefault: boolean): void => {
    this.fieldNames.forEach((name) => {
      this._clearValue(name, setDefault);
    });
  };

  clearSpecificValues = (names: Array<string>, setDefault: boolean): void => {
    names.forEach((name) => {
      this._clearValue(name, setDefault);
    });
  };

  _getValue = (name: string): any => {
    const {
      type,
      isFileValue,
      value: _value,
      valueFile: _valueFile,
    } = this.formFields[name];
    const valueFile = _valueFile;
    const value = _value;

    return type === "file" && isFileValue ? valueFile : value;
  };

  _getFinalValue = (name: string, formHandler: FormHandler): any => {
    const {
      type,
      isFileValue,
      maskToSubmit,
      value: _value,
      valueFile: _valueFile,
    } = this.formFields[name];
    const valueFile = _valueFile;
    const value = _value;

    const selectedValue = type === "file" && isFileValue ? valueFile : value;
    const withMask = selectedValue && maskToSubmit;
    return withMask && maskToSubmit
      ? maskToSubmit(selectedValue, formHandler)
      : selectedValue;
  };

  getValue = (
    name: string,
    withMaskToSubmit: boolean,
    formHandler: FormHandler
  ): any => {
    if (this.formFields[name]) {
      return withMaskToSubmit
        ? this._getFinalValue(name, formHandler)
        : this._getValue(name);
    }
  };

  getActualValue = (name: string): FieldValueType => {
    return this.actualValues[name];
  };

  getValues = (formHandler: FormHandler): DataReturnType => {
    const data: DataReturnType = {};
    this.fieldNames.forEach((name) => {
      data[name] = this._getValueToSubmit(name, formHandler);
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
    formHandler: FormHandler
  ): DataReturnType => {
    const data: DataReturnType = {};
    this.fieldNames.forEach((name) => {
      const input = this.formFields[name];
      if (!input.error) {
        data[name] = saveToSubmit
          ? this._getValueToSubmit(name, formHandler)
          : input.value;
      }
    });
    return data;
  };

  _testErrorAndReturnData = async (
    name: string,
    formHandler: FormHandler,
    concatErrorMessages: (
      label: string | undefined,
      errorMessage: ErrorMessageType
    ) => void,
    errorCallback: () => void
  ): Promise<DataReturnType> => {
    const errorMessage = await this.testFieldError(name, true, formHandler);
    if (errorMessage) {
      concatErrorMessages(this.formFields[name].label, errorMessage);
      errorCallback();
    }
    return this._getValueToSubmit(name, formHandler);
  };

  testFieldError = async (
    name: string,
    shouldUpdateInput: boolean,
    formHandler: FormHandler
  ): Promise<ErrorMessageType> => {
    return await HandleFormFields.treatUpdateField(
      name,
      this.formFields,
      () => {
        return this.formFields[name].validate(shouldUpdateInput, formHandler);
      }
    );
  };

  testErrorsAndReturnData = async (
    formHandler: FormHandler,
    concatErrorMessages: (
      label: string | undefined,
      errorMessage: ErrorMessageType
    ) => void
  ): Promise<{ hasError: boolean; data: DataReturnType }> => {
    let hasError = false;
    const data: DataReturnType = {};

    await Promise.all(
      this.fieldNames.map(async (name) => {
        data[name] = await this._testErrorAndReturnData(
          name,
          formHandler,
          concatErrorMessages,
          () => {
            if (!hasError) {
              this.setFieldFocus(name);
              hasError = true;
            }
          }
        );

        return null;
      })
    );
    return { hasError, data };
  };

  setCustomError = (name: string, message: ErrorMessageType): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].errorHandler(message);
    });
  };

  setCustomValid = (name: string, valid: boolean): void => {
    HandleFormFields.treatUpdateField(name, this.formFields, () => {
      this.formFields[name].validHandler(valid);
    });
  };
}

export { HandleFormFields };
