/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { FormContext } from "./components/FormFull";
import { ButtonProps } from "./classes/buttonController/types/Button";
import { ButtonConnectorReturnType } from "./classes/types/connector";

export default function useButton(
  props: ButtonProps
): ButtonConnectorReturnType {
  const [formDisabled, setDisabled] = React.useState(false);
  const [formLoading, setLoading] = React.useState(false);

  const ffHandler = React.useContext(FormContext);

  React.useEffect(() => {
    ffHandler?.setNewButton(props.name, {
      setDisabled: setDisabled,
      setLoading: setLoading,
      actionType: props.actionType,
    });
    return (): void => {
      ffHandler?.removeButton(props.name);
    };
  }, []);

  const onClick = React.useCallback(
    (event): void => {
      if (props.actionType === "submit") {
        ffHandler?.submit();
      } else if (props.actionType === "clear") {
        ffHandler?.clearAllValues(false);
      } else if (props.actionType === "clearDefault") {
        ffHandler?.clearAllValues(true);
      }
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [props, ffHandler]
  );

  return { onClick, ffHandler, formDisabled, formLoading };
}
