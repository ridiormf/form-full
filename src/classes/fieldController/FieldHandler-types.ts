import FormFullHandler from "../FormFullHandler";

export type ErrorMessageType = string | null | undefined;
export type MaskType = (value: any) => any;
export type MaskToSubmitType = <T>(
  value: any,
  ffHandler?: FormFullHandler<T>,
) => any;
export type ValidationType = <T>(
  value: any,
  ffHandler?: FormFullHandler<T>,
) => ErrorMessageType;
export type AsyncValidationType = <T>(
  value: any,
  ffHandler?: FormFullHandler<T>,
) => Promise<ErrorMessageType>;
export type FieldRef = any;

export interface FieldHandlerParams {
  value?: any;
  defaultValue?: any;

  label?: string;
  required?: ErrorMessageType;

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
}

export type FieldProps<T> = {
  name: string;
  maxLength?: number;
  onChange?: (
    value: unknown,
    ffHandler: FormFullHandler<T>,
    event?: any,
  ) => void;
  onBlur?: (value: unknown, ffHandler: FormFullHandler<T>, event?: any) => void;
  placeholder?: string;
  submitOnBlur?: boolean;

  defaultValue?: any;

  label?: string;
  required?: ErrorMessageType;

  mask?: MaskType;
  maskToSubmit?: MaskToSubmitType;
  validation?: ValidationType;
  asyncValidation?: AsyncValidationType;
};

export interface FieldConnector<FormType> {
  value: any;
  error: ErrorMessageType;
  valid: boolean;
  formLoading: boolean;
  formDisabled: boolean;
  onSubmit: (event: any) => void;
  onBlur: (event: any) => void;
  onChange: (event: any, value: any) => void;
  testFieldError: () => void;
  ref: FieldRef;
  ffHandler?: FormFullHandler<FormType>;
}
