import { HandleButtonsList } from "./buttonController/HandleButtonsList";
import { HandleFieldsList } from "./fieldController/HandleFieldsList";
import { ButtonHandlerParams } from "./buttonController/types/ButtonHandler";
import {
  AsyncValidationType,
  ErrorMessageType,
  FieldActionType,
  FieldRef,
  FieldValueType,
  FieldHandlerParams,
  MaskToSubmitType,
  MaskType,
  ValidationType,
} from "./fieldController/types/FieldHandler";
import {
  FFDataReturnType,
  FormFullHandlerParams,
} from "./types/FormFullHandler";
import { ActualValuesType } from "./fieldController/types/HandleFieldsList";

export default class FormFullHandler {
  onSubmit;
  clearOnSubmit = false;
  submitOnClear = false;
  onChange;
  disabled = false;

  errorsMessages: Array<string> = [];

  formButtonsHandler: HandleButtonsList;
  formFieldsHandler: HandleFieldsList;

  constructor({
    onSubmit,
    clearOnSubmit,
    submitOnClear,
    onChange,
    disabled,
  }: FormFullHandlerParams) {
    this.onSubmit = onSubmit;
    this.clearOnSubmit = clearOnSubmit ?? false;
    this.submitOnClear = submitOnClear ?? false;
    this.onChange = onChange ?? undefined;
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

  setActualValues = (actualValues: ActualValuesType): void => {
    this.formFieldsHandler.setActualValues(actualValues);
  };

  setDisabled = (disabled: boolean): void => {
    this.disabled = disabled;
  };

  getDisabledForm = (): boolean => {
    return this.disabled;
  };

  setAllDisabled = (disabled: boolean): void => {
    this.disabled = disabled;
    this.formFieldsHandler.setAllDisabled(disabled);
  };

  setFieldRequired = (name: string, required: ErrorMessageType): void => {
    this.formFieldsHandler.setFieldRequired(name, required);
  };
  setFieldDefaultValue = (name: string, defaultValue: FieldValueType): void => {
    this.formFieldsHandler.setFieldDefaultValue(name, defaultValue);
  };
  setFieldLabel = (name: string, label: string): void => {
    this.formFieldsHandler.setFieldLabel(name, label);
  };
  setFieldActionType = (name: string, actionType: FieldActionType) => {
    this.formFieldsHandler.setFieldActionType(name, actionType);
  };
  setFieldIsFileValue = (name: string, isFileValue: boolean): void => {
    this.formFieldsHandler.setFieldIsFileValue(name, isFileValue);
  };
  setFieldMask = (name: string, mask: MaskType): void => {
    this.formFieldsHandler.setFieldMask(name, mask);
  };
  setFieldMaskToSubmit = (
    name: string,
    maskToSubmit: MaskToSubmitType
  ): void => {
    this.formFieldsHandler.setFieldMaskToSubmit(name, maskToSubmit);
  };
  setFieldValidation = (name: string, validation: ValidationType): void => {
    this.formFieldsHandler.setFieldValidation(name, validation);
  };

  setFieldAsyncValidation = (
    name: string,
    asyncValidation: AsyncValidationType
  ): void => {
    this.formFieldsHandler.setFieldAsyncValidation(name, asyncValidation);
  };

  getFieldRef = (name: string): FieldRef => {
    return this.formFieldsHandler.getFieldRef(name);
  };

  setValue = (name: string, value: FieldValueType): void => {
    this.formFieldsHandler.setValue(name, value);
  };

  setFormValue = (name: string, value: FieldValueType): void => {
    this.formFieldsHandler.setFormValue(name, value);
    if (this.onChange) {
      this.onChange();
    }
  };

  clearValue = (name: string): void => {
    this.formFieldsHandler.clearValue(name);
  };

  setValueToDefault = (name: string): void => {
    this.formFieldsHandler.setValueToDefault(name);
  };

  getValue = (name: string, withMaskToSubmit: boolean): void => {
    return this.formFieldsHandler.getValue(name, withMaskToSubmit, this);
  };

  getActualValue = (name: string): FieldValueType => {
    return this.formFieldsHandler.getActualValue(name);
  };

  getValues = (): FFDataReturnType => {
    return this.formFieldsHandler.getValues(this);
  };

  setFieldFocus = (name: string): void => {
    this.formFieldsHandler.setFieldFocus(name);
  };

  getValidValues = (valuesWithMaskToSubmit: boolean): void => {
    this.formFieldsHandler.getValidValues(valuesWithMaskToSubmit, this);
  };

  testErrorsAndReturnData = async (): Promise<{
    hasError: boolean;
    data: FFDataReturnType;
  }> => {
    return this.formFieldsHandler.testErrorsAndReturnData(
      this,
      this.concatErrorMessages
    );
  };

  concatErrorMessages = (
    label: string | undefined,
    errorMessage: ErrorMessageType
  ) => {
    if (label) {
      this.errorsMessages.push(`${label}{*}${errorMessage}`);
    }
  };

  testFieldError = async (name: string, shouldUpdateInput: boolean = true) => {
    return await this.formFieldsHandler.testFieldError(
      name,
      shouldUpdateInput,
      this
    );
  };

  clearAllValues = (setDefault: boolean) => {
    this.formFieldsHandler.clearAllValues(setDefault);
    if (this.submitOnClear) {
      this.submit();
    }
  };

  clearSpecificValues = (names: Array<string>, setDefault: boolean) => {
    this.formFieldsHandler.clearSpecificValues(names, setDefault);
  };

  setCustomError = (name: string, message: ErrorMessageType) => {
    this.formFieldsHandler.setCustomError(name, message);
  };

  setCustomValid = (name: string, valid: boolean) => {
    this.formFieldsHandler.setCustomValid(name, valid);
  };

  submit = async (): Promise<void> => {
    if (this.onSubmit) {
      this.formButtonsHandler.setButtonsStatus(true);
      const { hasError, data } = await this.testErrorsAndReturnData();
      this.formButtonsHandler.setButtonsStatus(false);
      if (!hasError) {
        this.onSubmit(data);
        if (this.clearOnSubmit) {
          this.formFieldsHandler.clearAllValues(true);
        }
      }
    }
  };
}
