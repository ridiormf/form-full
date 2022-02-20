import React from "react";

export type ButtonActionType = "submit" | "clear" | "clearDefault";
export type SetLoadingType = React.Dispatch<React.SetStateAction<boolean>>;
export type SetDisabledType = React.Dispatch<React.SetStateAction<boolean>>;

export type ButtonHandlerParams = {
  actionType?: ButtonActionType;
  setLoading: SetLoadingType;
  setDisabled: SetDisabledType;
};
