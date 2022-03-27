import React from "react";
import { useConstructor } from "../hooks/useConstructor";
import FormFullHandler from "../classes/FormFullHandler";
import { FormFullProps } from "../classes/types/FormFull";

export const FormContext = React.createContext<FormFullHandler<unknown>>(
  {} as FormFullHandler<unknown>,
);

function FormFull<T>(props: FormFullProps<T>): JSX.Element {
  const ffHandler = React.useRef<FormFullHandler<T>>();
  useConstructor(() => {
    ffHandler.current = new FormFullHandler<T>({
      onSubmit: props.onSubmit,
      clearOnSubmit: props.clearOnSubmit,
      submitOnClear: props.submitOnClear,
      onChange: props.onChange,
      disabled: props.disabled,
    });

    if (props.currentValues) {
      ffHandler.current.setCurrentValues(props.currentValues);
    }
    if (props.disabled) {
      ffHandler.current.setDisabled(props.disabled);
    }

    if (props.formRef) {
      props.formRef(ffHandler.current);
    }
  });

  React.useEffect(() => {
    ffHandler.current?.setCurrentValues(props.currentValues ?? {});
  }, [props.currentValues]);

  React.useEffect(() => {
    ffHandler.current?.setAllDisabled(props.disabled ?? false);
  }, [props.disabled]);

  return (
    <FormContext.Provider value={ffHandler.current as FormFullHandler<T>}>
      {props.children}
    </FormContext.Provider>
  );
}

export default FormFull;
