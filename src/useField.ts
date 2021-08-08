/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { FormContext } from "./components/FormFull";
import FormFullHandler from "./classes/FormFullHandler";
import { FieldProps } from "./classes/fieldController/types/Field";
import {
  ErrorMessageType,
  FieldRef,
  FieldValueType,
  FieldHandlerParams,
} from "./classes/fieldController/types/FieldHandler";

export default function useField(props: FieldProps & FieldHandlerParams): {
  value: FieldValueType;
  error: ErrorMessageType;
  valid: boolean;
  validationLoading: boolean;
  formDisabled: boolean;
  onSubmit: (event: any) => void;
  onBlur: (event: any) => void;
  setConfigs: (event: any | undefined | null, value: FieldValueType) => void;
  ref: FieldRef;
  formHandler: FormFullHandler | undefined;
} {
  const getInitialStringValue = React.useCallback((): FieldValueType => {
    const { defaultValue = "", mask } = props;
    const value = defaultValue;
    const finalValue = mask ? mask(value) : value;
    return finalValue;
  }, [props]);

  const initialValue = getInitialStringValue();

  const [value, setStateValue] = React.useState(initialValue);
  const [validationLoading, setValidationLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorMessageType>("");
  const [valid, setValid] = React.useState(false);
  const ref = React.useRef<FieldRef>();
  const formHandler = React.useContext(FormContext);
  const [formDisabled, setFormDisabled] = React.useState<boolean>(
    !!formHandler?.getDisabledForm()
  );

  const setValueWithoutOnChangeString = React.useCallback(
    (value = "") => {
      const { maxLength, mask, name } = props;
      let maxLengthValue = value;
      if (maxLength && (value !== null || value !== undefined)) {
        maxLengthValue = String(value).substring(0, maxLength);
      }
      const resultedValue = mask ? mask(maxLengthValue) : maxLengthValue;
      formHandler?.setFormValue(name, resultedValue);
      setStateValue(resultedValue);
      setValid(false);
    },
    [formHandler, props]
  );

  const setConfigs = React.useCallback(
    (event: any | undefined | null, value: FieldValueType = "") => {
      setValueWithoutOnChangeString(value);

      if (props.onChange) {
        props.onChange(event, value, formHandler);
      }
    },
    [formHandler, props, setValueWithoutOnChangeString]
  );

  const mount = React.useCallback(() => {
    formHandler?.setNewField(props.name, {
      ref: ref.current,
      errorHandler: setError,
      validHandler: setValid,
      handleValue: (value) => setConfigs(null, value),
      setLoading: setValidationLoading,
      value,
      actionType: props.actionType,
      isFileValue: props.isFileValue,
      label: props.label ?? props.placeholder,
      defaultValue: props.defaultValue,
      mask: props.mask,
      maskToSubmit: props.maskToSubmit,
      validation: props.validation,
      asyncValidation: props.asyncValidation,
      required: props.required,
      disableHandler: setFormDisabled,
    });
    return () => {
      formHandler?.removeField(props.name);
    };
  }, [formHandler, props, setError, ref, value, setConfigs]);

  React.useEffect(mount, []);

  React.useEffect(() => {
    formHandler?.setFieldRequired(props.name, props.required);
  }, [props, formHandler]);

  function onSubmit(event: any): void {
    if (!event?.shiftKey && event?.charCode === 13) {
      formHandler?.submit();
    }
  }

  function onBlur(event: any): void {
    setTimeout(() => {
      if (props.submitOnBlur) {
        formHandler?.submit();
      }
      if (props.onBlur) {
        props.onBlur(event, value, formHandler);
      }
      formHandler?.testFieldError(props.name);
    }, 10);
  }

  return {
    value,
    error,
    valid,
    validationLoading,
    formDisabled,
    onSubmit,
    onBlur,
    setConfigs,
    ref,
    formHandler,
  };
}
