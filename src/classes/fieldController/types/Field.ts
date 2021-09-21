import FormFullHandler from "../../FormFullHandler";
import {
  AsyncValidationType,
  ErrorMessageType,
  FieldValueType,
  MaskToSubmitType,
  MaskType,
  ValidationType,
} from "./FieldHandler";

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

  defaultValue?: FieldValueType;

  label?: string;
  required?: ErrorMessageType;

  mask?: MaskType;
  maskToSubmit?: MaskToSubmitType;
  validation?: ValidationType;
  asyncValidation?: AsyncValidationType;
};
