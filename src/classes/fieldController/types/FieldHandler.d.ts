import React from "react";
import FormFullHandler from "../../FormFullHandler";

export type FieldActionType = "file" | undefined;

export type FieldValueType = any;
export type ErrorMessageType = string | null | undefined;
export type MaskType = ((value: FieldValueType) => any) | undefined;
export type MaskToSubmitType =
  | ((value: FieldValueType, ffHandler?: FormFullHandler) => any)
  | undefined;
export type ValidationType =
  | ((value: FieldValueType, ffHandler?: FormFullHandler) => ErrorMessageType)
  | undefined;
export type AsyncValidationType =
  | ((
      value: FieldValueType,
      ffHandler?: FormFullHandler
    ) => Promise<ErrorMessageType>)
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

export type FieldHandlerParams = {
  value?: FieldValueType;
  defaultValue?: FieldValueType;
  valueFile?: File;

  label?: string;
  required?: ErrorMessageType;

  actionType?: FieldActionType;
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
};
