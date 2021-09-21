import {
  ErrorMessageType,
  FieldValueType,
} from "../fieldController/types/FieldHandler";

export type FFOnSubmitType = (ffData: FFDataReturnType) => void;
export type FFOnChangeType = () => void;

export interface FFDataReturnType {
  [name: string]: FieldValueType;
}

export type ErrorLabelMessage = {
  message: ErrorMessageType;
  label: string;
};
export type FormFullHandlerParams = {
  onSubmit: FFOnSubmitType;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: FFOnChangeType;
  disabled?: boolean;
};
