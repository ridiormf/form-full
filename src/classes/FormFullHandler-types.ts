export type Name<FormData> = Extract<keyof FormData, string>;

export type FormFullHandlerParams<FormData> = {
  onSubmit: (data: Partial<FormData>) => void;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};
