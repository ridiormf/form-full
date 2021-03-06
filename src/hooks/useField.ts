/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { FormContext } from "../components/FormFull";
import {
  FieldConnector,
  FieldProps,
} from "../classes/fieldController/FieldHandler-types";
import {
  ErrorMessageType,
  FieldRef,
} from "../classes/fieldController/FieldHandler-types";
import FormFullHandler from "../classes/FormFullHandler";

export default function useField<FormType>(
  props: FieldProps<FormType>,
): FieldConnector<FormType> {
  const getInitialStringValue = React.useCallback((): any => {
    const { defaultValue = "", mask } = props;
    const value = defaultValue;
    const finalValue = mask ? mask(value, ffHandler) : value;
    return finalValue;
  }, [props]);

  const initialValue = getInitialStringValue();

  const [value, setStateValue] = React.useState(initialValue);
  const [formLoading, setFormLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorMessageType>("");
  const [valid, setValid] = React.useState(false);
  const ref = React.useRef<FieldRef>();
  const ffHandler = React.useContext<FormFullHandler<FormType>>(FormContext);
  const [formDisabled, setFormDisabled] = React.useState<boolean>(
    !!ffHandler?.getDisabledForm(),
  );

  const setValueWithoutOnChangeString = React.useCallback(
    (value = "") => {
      const { maxLength, mask, name } = props;
      let maxLengthValue = value;
      if (maxLength && (value !== null || value !== undefined)) {
        maxLengthValue = String(value).substring(0, maxLength);
      }
      const resultedValue = mask
        ? mask(maxLengthValue, ffHandler)
        : maxLengthValue;
      ffHandler?.setFormValue(name, resultedValue);
      setStateValue(resultedValue);
      setValid(false);
    },
    [ffHandler, props],
  );

  function onBlur(event: any): void {
    setTimeout(() => {
      if (props.submitOnBlur) {
        ffHandler?.submit();
      } else {
        ffHandler?.testFieldError(props.name);
      }
      if (props.onBlur) {
        props.onBlur(value, ffHandler, event);
      }
    }, 10);
  }

  function testFieldError(): void {
    setTimeout(() => {
      ffHandler?.testFieldError(props.name);
    }, 10);
  }

  const onChange = React.useCallback(
    (event: any | undefined | null, value: any) => {
      setValueWithoutOnChangeString(value);

      if (props.onChange) {
        props.onChange(value, ffHandler, event);
      }
    },
    [ffHandler, props, setValueWithoutOnChangeString],
  );

  const mount = React.useCallback(() => {
    ffHandler?.setNewField(props.name, {
      ref: ref.current,
      errorHandler: (error: ErrorMessageType) => setError(error),
      validHandler: (valid: boolean) => setValid(valid),
      handleValue: (value) => onChange(null, value),
      setLoading: (loading: boolean) => setFormLoading(loading),
      disableHandler: (disabled: boolean) => setFormDisabled(disabled),
      value,
      defaultValue: props.defaultValue,
      mask: props.mask,
      maskToSubmit: props.maskToSubmit,
      validation: props.validation,
      required: props.required,
      ffHandler,
    });
    return () => {
      ffHandler?.removeField(props.name);
    };
  }, [
    ffHandler,
    props,
    setError,
    setValid,
    setFormLoading,
    setFormDisabled,
    ref,
    value,
    onChange,
  ]);

  React.useEffect(mount, []);

  React.useEffect(() => {
    ffHandler?.setFieldRequired(props.name, props.required);
  }, [props, ffHandler]);

  function onSubmit(event: any): void {
    if (!event?.shiftKey && event?.charCode === 13) {
      ffHandler?.submit();
    }
  }

  return {
    value,
    error,
    valid,
    formLoading,
    formDisabled,
    onSubmit,
    onBlur,
    onChange,
    testFieldError,
    ref,
    ffHandler,
  };
}
