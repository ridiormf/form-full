import React from "react";
import { useConstructor } from "../hooks/useConstructor";
import { ActualValues } from "../types/HandleFormFields";
import FormHandler from "../FormHandler";

export const FormContext = React.createContext<FormHandler | undefined>(
  undefined
);

type Props = {
  onSubmit: Function;
  clearOnSubmit?: boolean;
  submitOnClear?: boolean;
  onChange?: Function;
  formRef?: Function;
  children: React.ReactNode;
  actualValues?: ActualValues;
  disabled?: boolean;
};

function FormHolder(props: Props): JSX.Element {
  const formHandler = React.useRef<FormHandler>();
  useConstructor(() => {
    formHandler.current = new FormHandler({
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

export default FormHolder;
