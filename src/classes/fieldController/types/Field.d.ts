import FormFullHandler from "../../FormFullHandler";
import { FieldValueType } from "./FieldHandler";

export type FieldFormListener = (
  event: any,
  value?: FieldValueType,
  ffHandler?: FormFullHandler
) => void;

export type FieldProps = {
  name: string;
  maxLength?: number;
  onChange?: FieldFormListener;
  onBlur?: FieldFormListener;
  placeholder?: string;
  submitOnBlur?: boolean;
};
