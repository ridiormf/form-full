export type ButtonActionType = "submit" | "clear" | "clearDefault";
export type SetDisabledType = (disabled: boolean) => void;

export type ButtonHandlerParams = {
  action?: ButtonActionType;
  setDisabled: (disabled: boolean) => void;
  setLoading: (loading: boolean) => void;
};
