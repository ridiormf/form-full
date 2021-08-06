import React from "react";

export type ButtonType = any; // TODO enum button type
export type SetLoadingType = React.Dispatch<React.SetStateAction<boolean>>;
export type SetDisabledType = React.Dispatch<React.SetStateAction<boolean>>;

export type FormButtonHandlerContructor = {
  type: ButtonType; // tipos de interações entre botão - form
  setLoading: SetLoadingType; // callback loading do botão com o form
  setDisabled: SetDisabledType; // callback disabled do botão com o form
};
