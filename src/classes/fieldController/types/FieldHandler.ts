import FormFullHandler from "../../FormFullHandler";

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
