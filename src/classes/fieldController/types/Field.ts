import FormFullHandler from "../../FormFullHandler";
import {
  AsyncValidationType,
  ErrorMessageType,
  MaskToSubmitType,
  MaskType,
  ValidationType,
} from "./FieldHandler";

export type FieldProps<T> = {
  name: string;
  maxLength?: number;
  onChange?: (
    value: unknown,
    ffHandler: FormFullHandler<T>,
    event?: any,
  ) => void;
  onBlur?: (value: unknown, ffHandler: FormFullHandler<T>, event?: any) => void;
  placeholder?: string;
  submitOnBlur?: boolean;

  defaultValue?: any;

  label?: string;
  required?: ErrorMessageType;

  mask?: MaskType;
  maskToSubmit?: MaskToSubmitType;
  validation?: ValidationType;
  asyncValidation?: AsyncValidationType;
};
