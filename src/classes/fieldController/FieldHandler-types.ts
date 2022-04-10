import FormFullHandler from "../FormFullHandler";

export type ErrorMessageType = string | null | undefined;
export type MaskType = <FormType>(
  value: any,
  ffHandler?: FormFullHandler<FormType>,
) => any;

export type ValidationType = <FormType>(
  value: any,
  ffHandler?: FormFullHandler<FormType>,
) => ErrorMessageType | Promise<ErrorMessageType>;

export type FieldRef = any;

export interface FieldHandlerParams {
  value?: any;
  defaultValue?: any;

  required?: ErrorMessageType;

  mask?: MaskType;
  maskToSubmit?: MaskType;
  validation?: ValidationType | ValidationType[];

  errorHandler: (error: ErrorMessageType) => void;
  validHandler: (valid: boolean) => void;
  handleValue: (value: any) => void;
  setLoading: (loading: boolean) => void;
  disableHandler: (disabled: boolean) => void;

  ref: FieldRef;
}

export interface FieldProps<FormType>
  extends Pick<
    FieldHandlerParams,
    "mask" | "maskToSubmit" | "validation" | "required" | "defaultValue"
  > {
  name: string;
  maxLength?: number;
  onChange?: <ValueType, EventType>(
    value: ValueType,
    ffHandler: FormFullHandler<FormType>,
    event?: EventType,
  ) => void;
  onBlur?: <ValueType, EventType>(
    value: ValueType,
    ffHandler: FormFullHandler<FormType>,
    event?: EventType,
  ) => void;
  submitOnBlur?: boolean;
}

export interface FieldConnector<FormType> {
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
  ffHandler?: FormFullHandler<FormType>;
}
