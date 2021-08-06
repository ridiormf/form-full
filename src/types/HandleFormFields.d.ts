import { FormFieldHandler } from "../classes/FormFieldHandler";
import { FieldValueType } from "./FormFieldHandler";

export interface ActualValues {
  [name: string]: FieldValueType;
}

export interface FormFields {
  [name: string]: FormFieldHandler;
}
