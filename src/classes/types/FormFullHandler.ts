import { ErrorMessageType } from "../fieldController/types/FieldHandler";

export interface FFDataReturnType {
  [name: string]: any;
}

export type ErrorLabelMessage = {
  message: ErrorMessageType;
  label: string;
};
export type FormFullHandlerParams = {
  onSubmit: <T>(data: T | { [key in string]: any }) => void;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};
