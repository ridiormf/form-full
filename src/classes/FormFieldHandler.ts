import {
  DisableHandlerType,
  ErrorHandlerType,
  ErrorMessageType,
  FieldRef,
  FieldValueType,
  FormFieldHandlerContructor,
  HandleValueType,
  MaskToSubmitType,
  MaskType,
  SetLoadingType,
  ValidationType,
  ValidHandlerType,
} from "../types/FormFieldHandler";

import FormHandler from "../FormHandler";

class FormFieldHandler {
  value: FieldValueType;
  defaultValue: FieldValueType;
  valueFile?: File;

  label?: string;
  required: ErrorMessageType;

  type: any;
  isFileValue?: boolean;

  mask: MaskType;
  maskToSubmit: MaskToSubmitType;
  validation: ValidationType;

  errorHandler: ErrorHandlerType;
  validHandler: ValidHandlerType;
  handleValue: HandleValueType;
  setLoading: SetLoadingType;
  disableHandler: DisableHandlerType;

  ref: FieldRef;

  error: boolean = false; // controle interno para acessar valores sem erro

  constructor({
    value,
    defaultValue,
    label,
    required,
    type,
    isFileValue,
    mask,
    maskToSubmit,
    validation,
    errorHandler,
    validHandler,
    handleValue,
    setLoading,
    disableHandler,
    ref,
  }: FormFieldHandlerContructor) {
    this.value = value;
    this.defaultValue = defaultValue;
    this.label = label;
    this.required = required;
    this.type = type;
    this.isFileValue = isFileValue;
    this.mask = mask;
    this.maskToSubmit = maskToSubmit;
    this.validation = validation;
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

  setType = (type: any): void => {
    // TODO type enum
    this.type = type;
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

  setValue = (newValue: FieldValueType): void => {
    if (this.type === "file" && newValue) {
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

  getFormatedValueToSubmit = (formHandler: FormHandler): any => {
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

  validate = async (
    shouldUpdateInput: boolean,
    formHandler: FormHandler
  ): Promise<ErrorMessageType> => {
    const maskedValue = this.mask ? this.mask(this.value) : this.value;
    const hasValue = Boolean(maskedValue) || maskedValue === 0;
    if (hasValue) {
      if (this.validation) {
        this.setLoading(true);
        const errorMessage = await this.validation(maskedValue, formHandler);
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

export { FormFieldHandler };
