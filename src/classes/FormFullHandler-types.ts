import { ErrorMessageType } from "..";

export type ErrorLabelMessage = {
  message: ErrorMessageType;
  label: string;
};
export type FormFullData<T> = Partial<T> | { [key in string]: any };

export type FormFullHandlerParams = {
  onSubmit: <T>(data: FormFullData<T>) => void;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};
