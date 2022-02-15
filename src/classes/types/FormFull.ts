import { CurrentValuesType } from "../fieldController/types/HandleFieldsList";
import { FFOnChangeType, FFOnSubmitType } from "./FormFullHandler";

export type FormFullProps = {
  onSubmit: FFOnSubmitType;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: FFOnChangeType;
  formRef?: Function;
  children: React.ReactNode;
  currentValues?: CurrentValuesType;
  disabled?: boolean;
};
