import FormFullHandler from "../FormFullHandler";

export type FormFullProps<T> = {
  onSubmit: (data: T | { [key in string]: any }) => void;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: () => void;
  formRef?: (ref: FormFullHandler<T>) => void;
  children: React.ReactNode;
  currentValues?: Partial<T>;
  disabled?: boolean;
};
