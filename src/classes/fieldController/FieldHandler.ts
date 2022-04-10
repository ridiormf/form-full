import {
  ErrorMessageType,
  FieldRef,
  FieldHandlerParams,
  ValidationType,
  MaskType,
} from "./FieldHandler-types";

import FormFullHandler from "../FormFullHandler";

export default class FieldHandler {
  value: any;
  maskToSubmit?: MaskType;
  error: boolean = false;

  private defaultValue: any;
  private required: ErrorMessageType;
  private mask?: MaskType;
  private validation?: ValidationType | ValidationType[];
  private ref: FieldRef;

  handleValue: (value: any) => void;
  disableHandler: (disabled: boolean) => void;

  private errorHandler: (error: ErrorMessageType) => void;
  private validHandler: (valid: boolean) => void;
  private setLoading: (loading: boolean) => void;

  constructor({
    value,
    defaultValue,
    required,
    mask,
    maskToSubmit,
    validation,
    errorHandler,
    validHandler,
    handleValue,
    setLoading,
    disableHandler,
    ref,
  }: FieldHandlerParams) {
    this.value = value;
    this.defaultValue = defaultValue;
    this.required = required;
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

  setDefaultValue = (defaultValue: any): void => {
    this.defaultValue = defaultValue;
  };

  setMask = (mask: MaskType): void => {
    this.mask = mask;
  };

  setMaskToSubmit = (maskToSubmit: MaskType): void => {
    this.maskToSubmit = maskToSubmit;
  };

  setValidation = (validation: ValidationType | ValidationType[]): void => {
    this.validation = validation;
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

  getFormattedValueToSubmit = <FormType>(
    ffHandler: FormFullHandler<FormType>,
  ): any => {
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

  private async _getErrorMessage<FormType>(
    value: any,
    ffHandler: FormFullHandler<FormType>,
  ): Promise<ErrorMessageType> {
    if (this.validation) {
      if (Array.isArray(this.validation)) {
        let message = null;
        this.validation!.some((_validation) => {
          const _message = _validation(value, ffHandler);
          message = _message;
          if (message) return true;
          return false;
        });
        return message;
      }
    }
    return null;
  }

  validate = async <FormType>(
    shouldUpdateInput: boolean,
    ffHandler: FormFullHandler<FormType>,
  ): Promise<ErrorMessageType> => {
    const maskedValue = this._getMaskedValue();
    const hasValue = Boolean(maskedValue) || maskedValue === 0;
    if (hasValue) {
      if (this.validation) {
        this.setLoading(true);
        const errorMessage = await this._getErrorMessage<FormType>(
          maskedValue,
          ffHandler,
        );
        this.setLoading(false);
        if (errorMessage) {
          if (shouldUpdateInput) {
            this.errorHandler(errorMessage);
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
