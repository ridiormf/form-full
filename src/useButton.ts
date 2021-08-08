/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { FormContext } from "./components/FormFull";
import FormFullHandler from "./classes/FormFullHandler";
import { ButtonProps } from "./classes/buttonController/types/Button";

export default function useButton(props: ButtonProps): {
  onClick: (event: any) => void;
  formHandler: FormFullHandler | undefined;
  formDisabled: boolean;
  formLoading: boolean;
} {
  const [formDisabled, setDisabled] = React.useState(false);
  const [formLoading, setLoading] = React.useState(false);

  const formHandler = React.useContext(FormContext);

  React.useEffect(() => {
    formHandler?.setNewButton(props.name, {
      setDisabled: setDisabled,
      setLoading: setLoading,
      actionType: props.actionType,
    });
    return (): void => {
      formHandler?.removeButton(props.name);
    };
  }, []);

  const onClick = React.useCallback(
    (event): void => {
      if (props.actionType === "submit") {
        formHandler?.submit();
      } else if (props.actionType === "clear") {
        formHandler?.clearAllValues(false);
      } else if (props.actionType === "clearDefault") {
        formHandler?.clearAllValues(true);
      }
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [props, formHandler]
  );

  return { onClick, formHandler, formDisabled, formLoading };
}
