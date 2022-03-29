import { HandleButtonsList } from "./buttonController/HandleButtonsList";
import { HandleFieldsList } from "./fieldController/HandleFieldsList";
import { ButtonHandlerParams } from "./buttonController/ButtonHandler-types";
import {
  AsyncValidationType,
  ErrorMessageType,
  FieldRef,
  FieldHandlerParams,
  MaskToSubmitType,
  MaskType,
  ValidationType,
} from "./fieldController/FieldHandler-types";
import { FormFullData, FormFullHandlerParams } from "./FormFullHandler-types";

export default class FormFullHandler<T> {
  onSubmit: (data: FormFullData<T>) => void;
  onChange?: () => void;
  clearOnSubmit: boolean;
  submitOnClear: boolean;
  disabled: boolean;

  formButtonsHandler: HandleButtonsList;
  formFieldsHandler: HandleFieldsList<T>;

  constructor({
    onSubmit,
    clearOnSubmit,
    submitOnClear,
    onChange,
    disabled,
  }: FormFullHandlerParams) {
    this.onSubmit = onSubmit;
    this.onChange = onChange;
    this.clearOnSubmit = clearOnSubmit ?? false;
    this.submitOnClear = submitOnClear ?? false;
    this.disabled = disabled ?? false;

    this.formButtonsHandler = new HandleButtonsList();
    this.formFieldsHandler = new HandleFieldsList();
  }

  static handleError = {
    fieldNotFound: (name: string): void => {
      if (!name) console.error(`A field was not informed, received: ${name}`);
      else console.error(`The field "${name}" does not exist.`);
    },
  };

  setNewField = (name: string, fieldParams: FieldHandlerParams): void => {
    this.formFieldsHandler.setNewField(name, fieldParams);
  };

  removeField = (name: string): void => {
    this.formFieldsHandler.removeField(name);
  };

  setNewButton = (name: string, buttonParams: ButtonHandlerParams) => {
    this.formButtonsHandler.setNewButton(name, buttonParams);
  };
  removeButton = (name: string): void => {
    this.formButtonsHandler.removeButton(name);
  };

  setCurrentValues = (currentValues: FormFullData<T>): void => {
    this.formFieldsHandler.setCurrentValues(currentValues);
  };

  getDisabledForm = (): boolean => {
    return this.disabled;
  };

  setFormDisabled = (disabled: boolean): void => {
    this.disabled = disabled;
    this.formFieldsHandler.setAllDisabled(disabled);
    this.formButtonsHandler.setButtonsDisabled(disabled);
  };

  setFieldRequired = (name: string, required: ErrorMessageType): void => {
    this.formFieldsHandler.setFieldRequired(name, required);
  };
  setFieldDefaultValue = (name: string, defaultValue: any): void => {
    this.formFieldsHandler.setFieldDefaultValue(name, defaultValue);
  };
  setFieldLabel = (name: string, label: string): void => {
    this.formFieldsHandler.setFieldLabel(name, label);
  };
  setFieldMask = (name: string, mask: MaskType): void => {
    this.formFieldsHandler.setFieldMask(name, mask);
  };
  setFieldMaskToSubmit = (
    name: string,
    maskToSubmit: MaskToSubmitType,
  ): void => {
    this.formFieldsHandler.setFieldMaskToSubmit(name, maskToSubmit);
  };
  setFieldValidation = (name: string, validation: ValidationType): void => {
    this.formFieldsHandler.setFieldValidation(name, validation);
  };

  setFieldAsyncValidation = (
    name: string,
    asyncValidation: AsyncValidationType,
  ): void => {
    this.formFieldsHandler.setFieldAsyncValidation(name, asyncValidation);
  };

  getFieldRef = (name: string): FieldRef => {
    return this.formFieldsHandler.getFieldRef(name);
  };

  setValue = (name: string, value: any): void => {
    this.formFieldsHandler.setValue(name, value);
  };

  setFormValue = (name: string, value: any): void => {
    this.formFieldsHandler.setFormValue(name, value);
    if (this.onChange) {
      this.onChange();
    }
  };

  clearValue = (name: string, setDefault: boolean = true): void => {
    this.formFieldsHandler.clearValue(name, setDefault);
  };

  getValue = (name: string, withMaskToSubmit: boolean): any => {
    return this.formFieldsHandler.getValue(name, withMaskToSubmit, this);
  };

  getActualValue = (name: string): any => {
    return this.formFieldsHandler.getActualValue(name);
  };

  getValues = (): FormFullData<T> => {
    return this.formFieldsHandler.getValues(this);
  };

  setFieldFocus = (name: string): void => {
    this.formFieldsHandler.setFieldFocus(name);
  };

  getValidValues = (valuesWithMaskToSubmit: boolean): FormFullData<T> => {
    return this.formFieldsHandler.getValidValues(valuesWithMaskToSubmit, this);
  };

  testErrorsAndReturnData = async (): Promise<{
    hasError: boolean;
    data: FormFullData<T>;
  }> => {
    return this.formFieldsHandler.testErrorsAndReturnData(this);
  };

  testFieldError = async (
    name: string,
    shouldUpdateInput: boolean = true,
  ): Promise<ErrorMessageType> => {
    return await this.formFieldsHandler.testFieldError(
      name,
      shouldUpdateInput,
      this,
    );
  };

  clearFields = (setDefault: boolean = true) => {
    this.formFieldsHandler.clearFields(setDefault);
    if (this.submitOnClear) {
      this.submit();
    }
  };

  clearSpecificFields = (names: Array<string>, setDefault: boolean = true) => {
    this.formFieldsHandler.clearSpecificFields(names, setDefault);
  };

  submit = async (): Promise<void> => {
    if (this.onSubmit) {
      this.formButtonsHandler.setButtonsStatus(true);
      const { hasError, data } = await this.testErrorsAndReturnData();
      this.formButtonsHandler.setButtonsStatus(false);
      if (!hasError) {
        this.onSubmit(data);
        if (this.clearOnSubmit) {
          this.formFieldsHandler.clearFields(true);
        }
      }
    }
  };
}
