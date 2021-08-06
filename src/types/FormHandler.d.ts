import { FieldValueType } from "./FormFieldHandler";

export type FormHandlerConstructor = {
  onSubmit: Function;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: Function;
  disabled?: boolean;
};

export interface DataReturnType {
  [name: string]: FieldValueType;
}
