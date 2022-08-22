import { HandleButtonsList } from "./buttonController/HandleButtonsList";
import { HandleFieldsList } from "./fieldController/HandleFieldsList";
import { ButtonHandlerParams } from "./buttonController/ButtonHandler-types";
import {
  ErrorMessageType,
  FieldRef,
  FieldHandlerParams,
  ValidationType,
  MaskType,
} from "./fieldController/FieldHandler-types";
import { FormFullHandlerParams, Name } from "./FormFullHandler-types";

export default class FormFullHandler<FormData> {
  onSubmit: (data: Partial<FormData>) => void;
  onChange?: () => void;
  clearOnSubmit: boolean;
  submitOnClear: boolean;
  disabled: boolean;

  formButtonsHandler: HandleButtonsList;
  formFieldsHandler: HandleFieldsList<FormData>;

  constructor({
    onSubmit,
    clearOnSubmit,
    submitOnClear,
    onChange,
    disabled,
  }: FormFullHandlerParams<FormData>) {
    this.onSubmit = onSubmit;
    this.onChange = onChange;
    this.clearOnSubmit = clearOnSubmit ?? false;
    this.submitOnClear = submitOnClear ?? false;
    this.disabled = disabled ?? false;

    this.formButtonsHandler = new HandleButtonsList();
    this.formFieldsHandler = new HandleFieldsList(this);
  }

  static handleError = {
    fieldNotFound: (name: string): void => {
      if (!name) console.error(`A field was not informed, received: ${name}`);
      else console.error(`The field "${name}" does not exist.`);
    },
  };

  setNewField = (
    name: Name<FormData>,
    fieldParams: FieldHandlerParams<FormData>,
  ): void => {
    this.formFieldsHandler.setNewField(name, fieldParams);
  };

  removeField = (name: Name<FormData>): void => {
    this.formFieldsHandler.removeField(name);
  };

  setNewButton = (name: Name<FormData>, buttonParams: ButtonHandlerParams) => {
    this.formButtonsHandler.setNewButton(name, buttonParams);
  };
  removeButton = (name: Name<FormData>): void => {
    this.formButtonsHandler.removeButton(name);
  };

  setCurrentValues = (currentValues: Partial<FormData>): void => {
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

  setFieldRequired = (
    name: Name<FormData>,
    required: ErrorMessageType,
  ): void => {
    this.formFieldsHandler.setFieldRequired(name, required);
  };
  setFieldDefaultValue = (name: Name<FormData>, defaultValue: any): void => {
    this.formFieldsHandler.setFieldDefaultValue(name, defaultValue);
  };
  setFieldMask = (name: Name<FormData>, mask?: MaskType<FormData>): void => {
    this.formFieldsHandler.setFieldMask(name, mask);
  };
  setFieldMaskToSubmit = (
    name: Name<FormData>,
    maskToSubmit?: MaskType<FormData>,
  ): void => {
    this.formFieldsHandler.setFieldMaskToSubmit(name, maskToSubmit);
  };
  setFieldValidations = (
    name: Name<FormData>,
    validations?: ValidationType<FormData>[],
  ): void => {
    this.formFieldsHandler.setFieldValidations(name, validations);
  };

  getFieldRef = (name: Name<FormData>): FieldRef => {
    return this.formFieldsHandler.getFieldRef(name);
  };

  setValue = (name: Name<FormData>, value: any): void => {
    this.formFieldsHandler.setValue(name, value);
  };

  setFormValue = (name: Name<FormData>, value: any): void => {
    this.formFieldsHandler.setFormValue(name, value);
    if (this.onChange) {
      this.onChange();
    }
  };

  clearValue = (name: Name<FormData>, setDefault: boolean = true): void => {
    this.formFieldsHandler.clearValue(name, setDefault);
  };

  getValue = (name: Name<FormData>, withMaskToSubmit: boolean): any => {
    return this.formFieldsHandler.getValue(name, withMaskToSubmit);
  };

  getActualValue = (name: Name<FormData>): any => {
    return this.formFieldsHandler.getActualValue(name);
  };

  getValues = (): Partial<FormData> => {
    return this.formFieldsHandler.getValues();
  };

  setFieldFocus = (name: Name<FormData>): void => {
    this.formFieldsHandler.setFieldFocus(name);
  };

  getValidValues = (valuesWithMaskToSubmit: boolean): Partial<FormData> => {
    return this.formFieldsHandler.getValidValues(valuesWithMaskToSubmit);
  };

  testErrorsAndReturnData = async (): Promise<{
    hasError: boolean;
    data: Partial<FormData>;
  }> => {
    return this.formFieldsHandler.testErrorsAndReturnData();
  };

  testFieldError = async (
    name: Name<FormData>,
    shouldUpdateInput: boolean = true,
  ): Promise<ErrorMessageType> => {
    return await this.formFieldsHandler.testFieldError(name, shouldUpdateInput);
  };

  clearFields = (setDefault: boolean = true) => {
    this.formFieldsHandler.clearFields(setDefault);
    if (this.submitOnClear) {
      this.submit();
    }
  };

  clearSpecificFields = (
    names: Name<FormData>[],
    setDefault: boolean = true,
  ) => {
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
