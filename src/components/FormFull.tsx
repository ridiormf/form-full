import React from "react";
import { useConstructor } from "../hooks/useConstructor";
import FormFullHandler from "../classes/FormFullHandler";
import { FormFullProps } from "../classes/types/FormFull";

export const FormContext = React.createContext<FormFullHandler | undefined>(
  undefined
);

function FormFull(props: FormFullProps): JSX.Element {
  const formHandler = React.useRef<FormFullHandler>();
  useConstructor(() => {
    formHandler.current = new FormFullHandler({
      onSubmit: props.onSubmit,
      clearOnSubmit: props.clearOnSubmit,
      submitOnClear: props.submitOnClear,
      onChange: props.onChange,
      disabled: props.disabled,
    });

    if (props.actualValues) {
      formHandler.current.setActualValues(props.actualValues);
    }
    if (props.disabled) {
      formHandler.current.setDisabled(props.disabled);
    }

    if (props.formRef) {
      props.formRef(formHandler.current);
    }
  });

  React.useEffect(() => {
    formHandler.current?.setActualValues(props.actualValues ?? {});
  }, [props.actualValues]);

  React.useEffect(() => {
    formHandler.current?.setAllDisabled(props.disabled ?? false);
  }, [props.disabled]);

  return (
    <FormContext.Provider value={formHandler.current}>
      {props.children}
    </FormContext.Provider>
  );
}

export default FormFull;
