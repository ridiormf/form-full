import {
  AsyncValidationType,
  DisableHandlerType,
  ErrorHandlerType,
  ErrorMessageType,
  FieldActionType,
  FieldRef,
  FieldValueType,
  FieldHandlerParams,
  HandleValueType,
  MaskToSubmitType,
  MaskType,
  SetLoadingType,
  ValidationType,
  ValidHandlerType,
} from "./types/FieldHandler";

import FormFullHandler from "../FormFullHandler";

class FieldHandler {
  value: FieldValueType;
  defaultValue: FieldValueType;
  valueFile?: File;

  label?: string;
  required: ErrorMessageType;

  actionType: any;
  isFileValue?: boolean;

  mask: MaskType;
  maskToSubmit: MaskToSubmitType;
  validation: ValidationType;
  asyncValidation: AsyncValidationType;

  errorHandler: ErrorHandlerType;
  validHandler: ValidHandlerType;
  handleValue: HandleValueType;
  setLoading: SetLoadingType;
  disableHandler: DisableHandlerType;

  ref: FieldRef;

  error: boolean = false;

  constructor({
    value,
    defaultValue,
    label,
    required,
    actionType,
    isFileValue,
    mask,
    maskToSubmit,
    validation,
    asyncValidation,
    errorHandler,
    validHandler,
    handleValue,
    setLoading,
    disableHandler,
    ref,
  }: FieldHandlerParams) {
    this.value = value;
    this.defaultValue = defaultValue;
    this.label = label;
    this.required = required;
    this.actionType = actionType;
    this.isFileValue = isFileValue;
    this.mask = mask;
    this.maskToSubmit = maskToSubmit;
    this.validation = validation;
    this.asyncValidation = asyncValidation;
    this.errorHandler = errorHandler;
    this.validHandler = validHandler;
    this.handleValue = handleValue;
    this.setLoading = setLoading;
    this.disableHandler = disableHandler;
    this.ref = ref;
  }

  getError = (): boolean => {
    return this.error;
  };

  setRequired = (required: ErrorMessageType): void => {
    this.required = required;
  };

  setDefaultValue = (defaultValue: FieldValueType): void => {
    this.defaultValue = defaultValue;
  };

  setLabel = (label: string): void => {
    this.label = label;
  };

  setType = (actionType: FieldActionType): void => {
    this.actionType = actionType;
  };

  setIsFileValue = (isFileValue: boolean): void => {
    this.isFileValue = isFileValue;
  };

  setMask = (mask: MaskType): void => {
    this.mask = mask;
  };

  setMaskToSubmit = (maskToSubmit: MaskToSubmitType): void => {
    this.maskToSubmit = maskToSubmit;
  };

  setValidation = (validation: ValidationType): void => {
    this.validation = validation;
  };

  setAsyncValidation = (asyncValidation: AsyncValidationType): void => {
    this.asyncValidation = asyncValidation;
  };

  setValue = (newValue: FieldValueType): void => {
    if (this.actionType === "file" && newValue) {
      this.value = newValue.base64;
      delete newValue.base64;
      this.valueFile = newValue;
    } else {
      this.value = newValue;
    }
  };

  getRef = (): FieldRef => {
    return this.ref;
  };

  clearValue = (): void => {
    this.handleValue("");
  };

  setValueToDefault = (): void => {
    this.handleValue(this.defaultValue);
  };

  getFormatedValueToSubmit = (formHandler: FormFullHandler): any => {
    let fixedValue = this.value;
    if (typeof this.value === "string") {
      fixedValue = this.value.trim();
    } else if (typeof this.value === "number") {
      fixedValue = Number(String(this.value).trim());
    }
    return !!this.maskToSubmit && fixedValue
      ? this.maskToSubmit(fixedValue, formHandler)
      : fixedValue;
  };

  private _getMaskedValue(): FieldValueType {
    return this.mask ? this.mask(this.value) : this.value;
  }

  private async _getErrorMessage(
    value: FieldValueType,
    formHandler: FormFullHandler
  ): Promise<ErrorMessageType> {
    if (this.validation) {
      const message = this.validation(value, formHandler);
      if (message) return message;
    }
    if (this.asyncValidation) {
      const message = await this.asyncValidation(value, formHandler);
      if (message) return message;
    }
    return null;
  }

  validate = async (
    shouldUpdateInput: boolean,
    formHandler: FormFullHandler
  ): Promise<ErrorMessageType> => {
    const maskedValue = this._getMaskedValue();
    const hasValue = Boolean(maskedValue) || maskedValue === 0;
    if (hasValue) {
      if (this.validation || this.asyncValidation) {
        this.setLoading(true);
        const errorMessage = await this._getErrorMessage(
          maskedValue,
          formHandler
        );
        this.setLoading(false);
        if (errorMessage) {
          const eMessage = !this.required
            ? "Campo não obrigatório. Remova seu valor ou corrija o seguinte erro para prosseguir: " +
              errorMessage
            : errorMessage;
          if (shouldUpdateInput) {
            this.errorHandler(eMessage);
            this.validHandler(false);
          }

          this.error = true;
          return errorMessage;
        } else {
          if (shouldUpdateInput) {
            this.errorHandler("");
            this.validHandler(true);
          }
          this.error = false;
          return null;
        }
      }
    }
    if (Boolean(this.required)) {
      if (shouldUpdateInput) {
        this.errorHandler(hasValue ? "" : this.required);
        this.validHandler(hasValue);
      }

      this.error = !hasValue;
      return hasValue ? null : this.required;
    }
    if (shouldUpdateInput) {
      this.validHandler(true);
      this.errorHandler("");
    }
    this.error = false;
    return null;
  };
}

export { FieldHandler };
