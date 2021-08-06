import React from "react";
import FormHandler from "../FormHandler";

export type FieldValueType = any;
export type ErrorMessageType = string | null | void;
export type MaskType = ((value: FieldValueType) => any) | undefined;
export type MaskToSubmitType =
  | ((value: FieldValueType, formHandler?: FormHandler) => any)
  | undefined;
export type ValidationType =
  | ((value: FieldValueType, formHandler?: FormHandler) => ErrorMessageType)
  | undefined;
export type FieldRef = any;

export type ErrorHandlerType = React.Dispatch<
  React.SetStateAction<ErrorMessageType>
>;
export type ValidHandlerType = React.Dispatch<React.SetStateAction<boolean>>;
export type HandleValueType = React.Dispatch<
  React.SetStateAction<FieldValueType>
>;
export type SetLoadingType = React.Dispatch<React.SetStateAction<boolean>>;
export type DisableHandlerType = React.Dispatch<React.SetStateAction<boolean>>;

export type FormFieldHandlerContructor = {
  value?: FieldValueType;
  defaultValue?: FieldValueType;
  valueFile?: File;

  label?: string;
  required?: ErrorMessageType;

  type?: any; //TODO field type enum
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
};
