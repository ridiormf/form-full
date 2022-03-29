import { FormFullData } from "..";
import FormFullHandler from "../classes/FormFullHandler";

export type FormFullProps<T> = {
  onSubmit: (data: FormFullData<T>) => void;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: () => void;
  formRef?: (ref: FormFullHandler<T>) => void;
  children: React.ReactNode;
  currentValues?: FormFullData<T>;
  disabled?: boolean;
};
