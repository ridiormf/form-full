import FormFullHandler from "../classes/FormFullHandler";

export type FormFullProps<FormData> = {
  onSubmit: (data: FormData) => void;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: () => void;
  formRef?: (ref: FormFullHandler<FormData>) => void;
  children: React.ReactNode;
  currentValues?: Partial<FormData>;
  disabled?: boolean;
};
