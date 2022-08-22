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

export default function useField<FormData>(
  props: FieldProps<FormData>,
): FieldConnector<FormData> {
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
  const ffHandler = React.useContext<FormFullHandler<FormData>>(FormContext);
  const [formDisabled, setFormDisabled] = React.useState<boolean>(
    ffHandler.getDisabledForm(),
  );

  const setValueWithoutOnChangeString = (value = "") => {
    const { maxLength, mask, name } = props;
    let maxLengthValue = value;
    if (maxLength && (value !== null || value !== undefined)) {
      maxLengthValue = String(value).substring(0, maxLength);
    }
    const resultedValue = mask
      ? mask(maxLengthValue, ffHandler)
      : maxLengthValue;
    ffHandler.setFormValue(name, resultedValue);
    setStateValue(resultedValue);
    setValid(false);
  };

  function onBlur(event: any): void {
    setTimeout(() => {
      if (props.submitOnBlur) {
        ffHandler.submit();
      } else {
        ffHandler.testFieldError(props.name);
      }
      if (props.onBlur) {
        props.onBlur(value, ffHandler, event);
      }
    }, 10);
  }

  function testFieldError(): void {
    setTimeout(() => {
      ffHandler.testFieldError(props.name);
    }, 10);
  }

  const onChange = (event: any | undefined | null, value: any) => {
    setValueWithoutOnChangeString(value);
    if (props.onChange) {
      props.onChange(value, ffHandler, event);
    }
  };

  React.useEffect(() => {
    ffHandler.setNewField(props.name, {
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
      validations: props.validations,
      required: props.required,
      ffHandler,
    });
    return () => {
      ffHandler.removeField(props.name);
    };
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  const { required, mask, validations, defaultValue, maskToSubmit } = props;

  React.useEffect(
    () => ffHandler.setFieldRequired(props.name, required),
    [required],
  );

  React.useEffect(() => ffHandler.setFieldMask(props.name, mask), [mask]);

  React.useEffect(
    () => ffHandler.setFieldValidations(props.name, validations),
    [validations],
  );

  React.useEffect(
    () => ffHandler.setFieldDefaultValue(props.name, defaultValue),
    [validations],
  );
  React.useEffect(
    () => ffHandler.setFieldMaskToSubmit(props.name, maskToSubmit),
    [validations],
  );

  function onSubmit(event: any): void {
    if (!event?.shiftKey && event?.charCode === 13) {
      ffHandler.submit();
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
