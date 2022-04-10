import {
  ErrorMessageType,
  FieldRef,
  FieldHandlerParams,
  ValidationType,
  MaskType,
} from "./FieldHandler-types";

import FormFullHandler from "../FormFullHandler";

export default class FieldHandler<FormType> {
  value: any;
  maskToSubmit?: MaskType<FormType>;
  error: boolean = false;

  private defaultValue: any;
  private required: ErrorMessageType;
  private mask?: MaskType<FormType>;
  private validation?: ValidationType<FormType> | ValidationType<FormType>[];
  private ref: FieldRef;

  handleValue: (value: any) => void;
  disableHandler: (disabled: boolean) => void;

  private errorHandler: (error: ErrorMessageType) => void;
  private validHandler: (valid: boolean) => void;
  private setLoading: (loading: boolean) => void;

  private ffHandler: FormFullHandler<FormType>;

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
    ffHandler,
  }: FieldHandlerParams<FormType>) {
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
    this.ffHandler = ffHandler;
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

  setMask = (mask: MaskType<FormType>): void => {
    this.mask = mask;
  };

  setMaskToSubmit = (maskToSubmit: MaskType<FormType>): void => {
    this.maskToSubmit = maskToSubmit;
  };

  setValidation = (
    validation: ValidationType<FormType> | ValidationType<FormType>[],
  ): void => {
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

  getFormattedValueToSubmit = (): any => {
    let fixedValue = this.value;
    if (typeof this.value === "string") {
      fixedValue = this.value.trim();
    } else if (typeof this.value === "number") {
      fixedValue = Number(String(this.value).trim());
    }
    return !!this.maskToSubmit && fixedValue
      ? this.maskToSubmit(fixedValue, this.ffHandler)
      : fixedValue;
  };

  private _getMaskedValue(): any {
    return this.mask ? this.mask(this.value, this.ffHandler) : this.value;
  }

  private async _getErrorMessage(value: any): Promise<ErrorMessageType> {
    if (this.validation) {
      if (Array.isArray(this.validation)) {
        let message = null;
        this.validation!.some((_validation) => {
          const _message = _validation(value, this.ffHandler);
          message = _message;
          if (message) return true;
          return false;
        });
        return message;
      }
    }
    return null;
  }

  validate = async (shouldUpdateInput: boolean): Promise<ErrorMessageType> => {
    const maskedValue = this._getMaskedValue();
    const hasValue = Boolean(maskedValue) || maskedValue === 0;
    if (hasValue) {
      if (this.validation) {
        this.setLoading(true);
        const errorMessage = await this._getErrorMessage(maskedValue);
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
