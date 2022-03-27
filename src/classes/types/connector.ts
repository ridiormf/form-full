import {
  ErrorMessageType,
  FieldRef,
} from "../fieldController/types/FieldHandler";
import FormFullHandler from "../FormFullHandler";

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

export interface ButtonConnector<FormType> {
  onClick: (event: any) => void;
  ffHandler: FormFullHandler<FormType> | undefined;
  formDisabled: boolean;
  formLoading: boolean;
}
