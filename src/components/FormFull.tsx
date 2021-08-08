import React from "react";
import { useConstructor } from "../hooks/useConstructor";
import FormFullHandler from "../classes/FormFullHandler";
import { FormFullProps } from "../classes/types/FormFull";

export const FormContext = React.createContext<FormFullHandler | undefined>(
  undefined
);

function FormFull(props: FormFullProps): JSX.Element {
  const ffHandler = React.useRef<FormFullHandler>();
  useConstructor(() => {
    ffHandler.current = new FormFullHandler({
      onSubmit: props.onSubmit,
      clearOnSubmit: props.clearOnSubmit,
      submitOnClear: props.submitOnClear,
      onChange: props.onChange,
      disabled: props.disabled,
    });

    if (props.actualValues) {
      ffHandler.current.setActualValues(props.actualValues);
    }
    if (props.disabled) {
      ffHandler.current.setDisabled(props.disabled);
    }

    if (props.formRef) {
      props.formRef(ffHandler.current);
    }
  });

  React.useEffect(() => {
    ffHandler.current?.setActualValues(props.actualValues ?? {});
  }, [props.actualValues]);

  React.useEffect(() => {
    ffHandler.current?.setAllDisabled(props.disabled ?? false);
  }, [props.disabled]);

  return (
    <FormContext.Provider value={ffHandler.current}>
      {props.children}
    </FormContext.Provider>
  );
}

export default FormFull;
