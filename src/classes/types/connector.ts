import {
  ErrorMessageType,
  FieldRef,
  FieldValueType,
} from "../fieldController/types/FieldHandler";
import FormFullHandler from "../FormFullHandler";

export type FieldConnectorReturnType = {
  value: FieldValueType;
  error: ErrorMessageType;
  valid: boolean;
  formLoading: boolean;
  formDisabled: boolean;
  onSubmit: (event: any) => void;
  onBlur: (event: any) => void;
  onChange: (event: any | undefined | null, value: FieldValueType) => void;
  testFieldError: () => void;
  ref: FieldRef;
  ffHandler: FormFullHandler | undefined;
};

export type ButtonConnectorReturnType = {
  onClick: (event: any) => void;
  ffHandler: FormFullHandler | undefined;
  formDisabled: boolean;
  formLoading: boolean;
};
