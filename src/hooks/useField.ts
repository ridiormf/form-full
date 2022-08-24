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
import { Name } from "../classes/FormFullHandler-types";

export default function useField<
  ValueType extends unknown,
  FormData extends unknown,
  FieldName extends Name<FormData> = Name<FormData>,
>(
  props: FieldProps<ValueType, FormData, FieldName>,
): FieldConnector<ValueType, FormData> {
  const ffHandler = React.useContext<FormFullHandler<FormData>>(FormContext);

  const getInitialStringValue = React.useCallback((): any => {
    const { defaultValue, mask } = props;
    const value = defaultValue;
    const finalValue = mask && value != null ? mask(value, ffHandler) : value;
    return finalValue;
  }, [props]);

  const initialValue = getInitialStringValue();

  const [value, setStateValue] = React.useState<ValueType>(initialValue);
  const [formLoading, setFormLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorMessageType>("");
  const [valid, setValid] = React.useState(false);
  const ref = React.useRef<FieldRef>();

  const [formDisabled, setFormDisabled] = React.useState<boolean>(
    ffHandler.getDisabledForm(),
  );

  const setValueWithoutOnChangeString = (value: ValueType) => {
    const { maxLength, mask, name } = props;
    let maxLengthValue: any = value;

    const itCanBeString =
      typeof value === "string" || typeof value === "number";

    if (itCanBeString && maxLength && (value !== null || value !== undefined)) {
      maxLengthValue = String(value).substring(0, maxLength);
    }
    const resultedValue =
      mask && maxLengthValue != null
        ? mask(maxLengthValue, ffHandler)
        : maxLengthValue;

    ffHandler.setFormValue(name, resultedValue);
    setStateValue(resultedValue);
    setValid(false);
  };

  function onBlur<EventType extends any>(event: EventType): void {
    setTimeout(() => {
      if (props.submitOnBlur) {
        ffHandler.submit();
      } else {
        ffHandler.testFieldError(props.name);
      }
      if (props.onBlur) {
        props.onBlur({ value, form: ffHandler, event, isValid: !!error });
      }
    }, 10);
  }

  function testFieldError(): void {
    setTimeout(() => {
      ffHandler.testFieldError(props.name);
    }, 10);
  }

  const onChange = <EventType extends any>(
    event: EventType,
    value: ValueType,
  ) => {
    setValueWithoutOnChangeString(value);
    if (props.onChange) {
      props.onChange({
        value,
        form: ffHandler,
        event,
        isValid: !!error,
      });
    }
  };

  React.useEffect(() => {
    ffHandler.setNewField(props.name, {
      ref: ref.current,
      errorHandler: (error: ErrorMessageType) => setError(error),
      validHandler: (valid: boolean) => setValid(valid),
      handleValue: (value) => onChange(null, value as ValueType),
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
