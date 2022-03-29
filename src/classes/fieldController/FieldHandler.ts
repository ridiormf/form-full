import {
  AsyncValidationType,
  ErrorMessageType,
  FieldRef,
  FieldHandlerParams,
  MaskToSubmitType,
  MaskType,
  ValidationType,
} from "./types/FieldHandler";

import FormFullHandler from "../FormFullHandler";

class FieldHandler {
  value: any;
  defaultValue: any;
  valueFile?: File;

  label?: string;
  required: ErrorMessageType;

  mask?: MaskType;
  maskToSubmit?: MaskToSubmitType;
  validation?: ValidationType;
  asyncValidation?: AsyncValidationType;

  errorHandler: (error: ErrorMessageType) => void;
  validHandler: (valid: boolean) => void;
  handleValue: (value: any) => void;
  setLoading: (loading: boolean) => void;
  disableHandler: (disabled: boolean) => void;

  ref: FieldRef;

  error: boolean = false;

  constructor({
    value,
    defaultValue,
    label,
    required,
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

  setDefaultValue = (defaultValue: any): void => {
    this.defaultValue = defaultValue;
  };

  setLabel = (label: string): void => {
    this.label = label;
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

  setValue = (newValue: any): void => {
    this.value = newValue;
  };

  getRef = (): FieldRef => {
    return this.ref;
  };

  private _clearValue = (): void => {
    this.handleValue("");
  };

  private _setValueToDefault = (): void => {
    this.handleValue(this.defaultValue);
  };

  clearValue = (setDefault: boolean): void => {
    if (setDefault) {
      this._setValueToDefault();
    } else {
      this._clearValue();
    }
  };

  getFormatedValueToSubmit = <T>(ffHandler: FormFullHandler<T>): any => {
    let fixedValue = this.value;
    if (typeof this.value === "string") {
      fixedValue = this.value.trim();
    } else if (typeof this.value === "number") {
      fixedValue = Number(String(this.value).trim());
    }
    return !!this.maskToSubmit && fixedValue
      ? this.maskToSubmit(fixedValue, ffHandler)
      : fixedValue;
  };

  private _getMaskedValue(): any {
    return this.mask ? this.mask(this.value) : this.value;
  }

  private async _getErrorMessage<T>(
    value: any,
    ffHandler: FormFullHandler<T>,
  ): Promise<ErrorMessageType> {
    if (this.validation) {
      const message = this.validation(value, ffHandler);
      if (message) return message;
    }
    if (this.asyncValidation) {
      const message = await this.asyncValidation(value, ffHandler);
      if (message) return message;
    }
    return null;
  }

  validate = async <T>(
    shouldUpdateInput: boolean,
    ffHandler: FormFullHandler<T>,
  ): Promise<ErrorMessageType> => {
    const maskedValue = this._getMaskedValue();
    const hasValue = Boolean(maskedValue) || maskedValue === 0;
    if (hasValue) {
      if (this.validation || this.asyncValidation) {
        this.setLoading(true);
        const errorMessage = await this._getErrorMessage(
          maskedValue,
          ffHandler,
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
