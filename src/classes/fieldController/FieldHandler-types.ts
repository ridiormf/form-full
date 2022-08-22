import FormFullHandler from "../FormFullHandler";
import { Name } from "../FormFullHandler-types";

export type ErrorMessageType = string | null | undefined;
export type MaskType<FormData> = (
  value: any,
  ffHandler: FormFullHandler<FormData>,
) => any;

export type ValidationType<FormData> = (
  value: any,
  ffHandler: FormFullHandler<FormData>,
) => ErrorMessageType | Promise<ErrorMessageType>;

export type FieldRef = any;

export interface FieldHandlerParams<FormData> {
  value?: any;
  defaultValue?: any;

  required?: ErrorMessageType;

  mask?: MaskType<FormData>;
  maskToSubmit?: MaskType<FormData>;
  validations?: ValidationType<FormData>[];

  errorHandler: (error: ErrorMessageType) => void;
  validHandler: (valid: boolean) => void;
  handleValue: (value: any) => void;
  setLoading: (loading: boolean) => void;
  disableHandler: (disabled: boolean) => void;

  ref: FieldRef;

  ffHandler: FormFullHandler<FormData>;
}

export interface FieldProps<FormData>
  extends Pick<
    FieldHandlerParams<FormData>,
    "mask" | "maskToSubmit" | "validations" | "required" | "defaultValue"
  > {
  name: Name<FormData>;
  maxLength?: number;
  onChange?: <ValueType, EventType>(
    value: ValueType,
    ffHandler: FormFullHandler<FormData>,
    event?: EventType,
  ) => void;
  onBlur?: <ValueType, EventType>(
    value: ValueType,
    ffHandler: FormFullHandler<FormData>,
    event?: EventType,
  ) => void;
  submitOnBlur?: boolean;
}

export interface FieldConnector<FormData> {
  value: any;
  error: ErrorMessageType;
  valid: boolean;
  formLoading: boolean;
  formDisabled: boolean;
  onSubmit: <EventType>(event: EventType) => void;
  onBlur: <EventType>(event: EventType) => void;
  onChange: <EventType, ValueType>(event: EventType, value: ValueType) => void;
  testFieldError: () => void;
  ref: FieldRef;
  ffHandler?: FormFullHandler<FormData>;
}
