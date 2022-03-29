import FormFullHandler from "../FormFullHandler";

export type ButtonActionType = "submit" | "clear" | "clearDefault";
export type SetDisabledType = (disabled: boolean) => void;

export type ButtonHandlerParams = {
  action?: ButtonActionType;
  setDisabled: (disabled: boolean) => void;
  setLoading: (loading: boolean) => void;
};

export interface ButtonProps {
  feedback?: boolean;
  action?: ButtonActionType;
  onClick?: (event: any) => void;
}

export interface ButtonConnector<FormType> {
  onClick: (event: any) => void;
  ffHandler: FormFullHandler<FormType> | undefined;
  formDisabled: boolean;
  formLoading: boolean;
}
