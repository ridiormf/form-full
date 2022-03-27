import React from "react";
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

export type ErrorHandlerType = React.Dispatch<
  React.SetStateAction<ErrorMessageType>
>;
export type ValidHandlerType = React.Dispatch<React.SetStateAction<boolean>>;
export type HandleValueType = React.Dispatch<React.SetStateAction<any>>;
export type SetLoadingType = React.Dispatch<React.SetStateAction<boolean>>;
export type DisableHandlerType = React.Dispatch<React.SetStateAction<boolean>>;

export interface FieldHandlerParams {
  value?: any;
  defaultValue?: any;

  label?: string;
  required?: ErrorMessageType;

  mask?: MaskType;
  maskToSubmit?: MaskToSubmitType;
  validation?: ValidationType;
  asyncValidation?: AsyncValidationType;

  errorHandler: ErrorHandlerType;
  validHandler: ValidHandlerType;
  handleValue: HandleValueType;
  setLoading: SetLoadingType;
  disableHandler: DisableHandlerType;

  ref: FieldRef;
}
