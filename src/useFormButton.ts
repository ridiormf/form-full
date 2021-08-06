/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { FormContext } from "./components/FormHolder";

export default function useFormButton(props: any) {
  const formHandler = React.useContext(FormContext);

  React.useEffect(() => {
    formHandler?.setNewButton(props.name, {
      setDisabled: props.setDisabled,
      setLoading: props.setLoading,
      type: props.type,
    });
    return (): void => {
      formHandler?.removeButton(props.name);
    };
  }, []);

  const onClick = React.useCallback((): void => {
    if (props.type === "submit") {
      formHandler?.submit();
    } else if (props.type === "clear") {
      formHandler?.clearAllValues(false);
    } else if (props.type === "clearDefault") {
      formHandler?.clearAllValues(true);
    }
    if (props.onClick) {
      props.onClick();
    }
  }, [props, formHandler]);

  return { onClick, formHandler };
}
