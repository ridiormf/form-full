export type FormFullData<FormType> =
  | Partial<FormType>
  | { [key in string]: any };

export type FormFullHandlerParams = {
  onSubmit: <FormType>(data: FormFullData<FormType>) => void;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};
