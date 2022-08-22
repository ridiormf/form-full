import {
  ErrorMessageType,
  FieldRef,
  FieldHandlerParams,
  ValidationType,
  MaskType,
} from "./FieldHandler-types";

import FormFullHandler from "../FormFullHandler";

export default class FieldHandler<FormData> {
  value: any;
  maskToSubmit?: MaskType<FormData>;
  error: boolean = false;

  private defaultValue: any;
  private required: ErrorMessageType;
  private mask?: MaskType<FormData>;
  private validations?: ValidationType<FormData>[];
  private ref: FieldRef;

  handleValue: (value: any) => void;
  disableHandler: (disabled: boolean) => void;

  private errorHandler: (error: ErrorMessageType) => void;
  private validHandler: (valid: boolean) => void;
  private setLoading: (loading: boolean) => void;

  private ffHandler: FormFullHandler<FormData>;

  constructor({
    value,
    defaultValue,
    required,
    mask,
    maskToSubmit,
    validations,
    errorHandler,
    validHandler,
    handleValue,
    setLoading,
    disableHandler,
    ref,
    ffHandler,
  }: FieldHandlerParams<FormData>) {
    this.value = value;
    this.defaultValue = defaultValue;
    this.required = required;
    this.mask = mask;
    this.maskToSubmit = maskToSubmit;
    this.validations = validations;
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

  setMask = (mask?: MaskType<FormData>): void => {
    this.mask = mask ?? undefined;
  };

  setMaskToSubmit = (maskToSubmit?: MaskType<FormData>): void => {
    this.maskToSubmit = maskToSubmit;
  };

  setValidations = (validations?: ValidationType<FormData>[]): void => {
    this.validations = validations;
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
    if (this.validations) {
      const results = await Promise.all(
        this.validations.map((validation) => validation(value, this.ffHandler)),
      );
      const message = results.find((message) => {
        return Boolean(message);
      });
      return message ?? null;
    }
    return null;
  }

  validate = async (shouldUpdateInput: boolean): Promise<ErrorMessageType> => {
    const maskedValue = this._getMaskedValue();
    const hasValue = Boolean(maskedValue) || maskedValue === 0;
    if (hasValue) {
      if (this.validations) {
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
