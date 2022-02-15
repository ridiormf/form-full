import {
  ErrorMessageType,
  FieldRef,
  FieldValueType,
  OnFieldChange,
} from "../fieldController/types/FieldHandler";
import FormFullHandler from "../FormFullHandler";

export interface FieldConnectorReturnType {
  value: FieldValueType;
  error: ErrorMessageType;
  valid: boolean;
  formLoading: boolean;
  formDisabled: boolean;
  onSubmit: (event: any) => void;
  onBlur: (event: any) => void;
  onChange: OnFieldChange;
  testFieldError: () => void;
  ref: FieldRef;
  ffHandler: FormFullHandler | undefined;
}

export interface ButtonConnectorReturnType {
  onClick: (event: any) => void;
  ffHandler: FormFullHandler | undefined;
  formDisabled: boolean;
  formLoading: boolean;
}
