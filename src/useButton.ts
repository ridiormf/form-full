/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { FormContext } from "./components/FormFull";
import { ButtonProps } from "./classes/buttonController/types/Button";
import { ButtonConnector } from "./classes/types/connector";

export default function useButton<T>(props: ButtonProps): ButtonConnector<T> {
  const ffHandler = React.useContext(FormContext);
  const [formDisabled, setDisabled] = React.useState(
    !!props.feedback && !!ffHandler?.getDisabledForm(),
  );

  const [formLoading, setLoading] = React.useState(false);

  const buttonName = React.useRef(
    props.feedback ? `${Math.random()}-${new Date().getTime()}` : undefined,
  );

  const mount = React.useCallback(() => {
    if (props.feedback && buttonName.current) {
      ffHandler?.setNewButton(buttonName.current, {
        setDisabled: (disabled: boolean) => setDisabled(disabled),
        setLoading: (loading: boolean) => setLoading(loading),
        action: props.action,
      });
    }
    return (): void => {
      if (props.feedback && buttonName.current) {
        ffHandler?.removeButton(buttonName.current);
      }
    };
  }, [ffHandler, props, setDisabled, setLoading, buttonName]);

  React.useEffect(mount, []);

  const onClick = React.useCallback(
    (event): void => {
      if (props.action === "submit") {
        ffHandler?.submit();
      } else if (props.action === "clear") {
        ffHandler?.clearFields(false);
      } else if (props.action === "clearDefault") {
        ffHandler?.clearFields(true);
      }
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [props, ffHandler],
  );

  return { onClick, ffHandler, formDisabled, formLoading };
}
