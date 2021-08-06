/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { FormContext } from "./components/FormHolder";
import {
  ErrorMessageType,
  FieldRef,
  FieldValueType,
} from "./types/FormFieldHandler";

export default function useFormField(props: any) {
  const getInitialStringValue = React.useCallback((): FieldValueType => {
    const { defaultValue = "", actualValue, mask } = props;
    const value = actualValue || actualValue === 0 ? actualValue : defaultValue;
    const finalValue = mask ? mask(value) : value;
    return finalValue;
  }, [props]);

  const initialValue = getInitialStringValue();

  const [value, setStateValue] = React.useState(initialValue);
  const [actualValue, setActualValue] = React.useState(initialValue);
  const [validationLoading, setValidationLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorMessageType>("");
  const [valid, setValid] = React.useState(false);
  const ref = React.useRef<FieldRef>();
  const formHandler = React.useContext(FormContext);
  const [formDisabled, setFormDisabled] = React.useState<boolean>(
    !!formHandler?.getDisabledForm()
  );
  const fileInputRef = React.useRef(null);

  const setValueWithoutOnChangeString = React.useCallback(
    (value = "") => {
      const { maxLength, mask, name } = props;
      let maxLengthValue = value;
      if (maxLength && (value !== null || value !== undefined)) {
        maxLengthValue = String(value).substring(0, maxLength);
      }
      const resultedValue = mask ? mask(maxLengthValue) : maxLengthValue;
      formHandler?.setFormValue(name, maxLengthValue);
      setStateValue(resultedValue);
      setValid(false);
    },
    [formHandler, props]
  );

  const setConfigs = React.useCallback(
    (event?: any, value: FieldValueType = "") => {
      setValueWithoutOnChangeString(value);

      if (props.onChange) {
        props.onChange(event, value, formHandler);
      }
      if (props.submitOnChange) {
        formHandler?.submit();
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
      type: props.type,
      isFileValue: props.isFileValue,
      label: props.label ?? props.placeholder,
      defaultValue: props.defaultValue,
      mask: props.mask,
      maskToSubmit: props.maskToSubmit,
      validation: props.validation,
      required: props.required,
      disableHandler: setFormDisabled,
    });
    return () => {
      formHandler?.removeField(props.name);
    };
  }, [formHandler, props, setError, ref, value, setConfigs]);

  React.useEffect(mount, []);

  React.useEffect(() => {
    setActualValue(getInitialStringValue());
    if (props.actualValue !== undefined && actualValue !== props.actualValue) {
      setValueWithoutOnChangeString(props.actualValue);
    }
  }, [
    props,
    actualValue,
    formHandler,
    setStateValue,
    setValid,
    setActualValue,
    getInitialStringValue,
    setValueWithoutOnChangeString,
  ]);

  React.useEffect(() => {
    formHandler?.setFieldRequired(props.name, props.required);
  }, [props, formHandler]);

  function onSubmit(event: any) {
    if (!event?.shiftKey && event?.charCode === 13) {
      formHandler?.submit();
    }
  }

  function updateInputOnBlur() {
    const { actualValue } = props;
    if (actualValue !== value) {
      setActualValue(value);
      if (props.submitOnBlur) {
        formHandler?.submit();
      }
    }
  }

  function onBlur(event: any) {
    setTimeout(() => {
      if (props.callBlurIfChange) {
        updateInputOnBlur();
      } else if (props.submitOnBlur) {
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
    fileInputRef,
  };
}
