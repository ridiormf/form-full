import FormFullHandler from "../FormFullHandler";
import { Name } from "../FormFullHandler-types";

export type ErrorMessageType = string | null | undefined;
export type MaskType<ValueType extends any, FormData extends any> = (
  value: ValueType | undefined,
  ffHandler: FormFullHandler<FormData>,
) => any;

export type ValidationType<ValueType extends any, FormData extends any> = (
  value: ValueType | undefined,
  ffHandler: FormFullHandler<FormData>,
) => ErrorMessageType | Promise<ErrorMessageType>;

export type FieldRef = any;

export interface FieldHandlerParams<
  ValueType extends any,
  FormData extends any,
> {
  value?: ValueType;
  defaultValue?: ValueType;

  required?: ErrorMessageType;

  mask?: MaskType<ValueType, FormData>;
  maskToSubmit?: MaskType<ValueType, FormData>;
  validations?: ValidationType<ValueType, FormData>[];

  errorHandler: (error: ErrorMessageType) => void;
  validHandler: (valid: boolean) => void;
  handleValue: (value: ValueType) => void;
  setLoading: (loading: boolean) => void;
  disableHandler: (disabled: boolean) => void;

  ref: FieldRef;

  ffHandler: FormFullHandler<FormData>;
}

export interface FieldProps<
  ValueType extends any,
  FormData extends any,
  FieldName extends Name<FormData> = Name<FormData>,
> extends Pick<
    FieldHandlerParams<ValueType, FormData>,
    "mask" | "maskToSubmit" | "validations" | "required" | "defaultValue"
  > {
  name: FieldName;
  maxLength?: number;
  onChange?: <EventType extends any>(context: {
    value: ValueType;
    form: FormFullHandler<FormData>;
    isValid: boolean;
    event?: EventType;
  }) => void;
  onBlur?: <EventType extends any>(context: {
    value: ValueType;
    form: FormFullHandler<FormData>;
    isValid: boolean;
    event?: EventType;
  }) => void;
  submitOnBlur?: boolean;
}

export interface FieldConnector<ValueType extends any, FormData extends any> {
  value: ValueType;
  error: ErrorMessageType;
  valid: boolean;
  formLoading: boolean;
  formDisabled: boolean;
  onSubmit: <EventType>(event: EventType) => void;
  onBlur: <EventType>(event: EventType) => void;
  onChange: <EventType>(event: EventType, value: ValueType) => void;
  testFieldError: () => void;
  ref: FieldRef;
  ffHandler?: FormFullHandler<FormData>;
}
