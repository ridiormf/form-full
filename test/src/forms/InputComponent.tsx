import React, { InputHTMLAttributes } from "react";
import { ErrorMessageType, FieldProps, useFormFull } from "form-full";

function getErrorClassname(
  base: string,
  error: ErrorMessageType,
  valid: boolean,
) {
  const className = base;
  if (error) return `${className} invalid`;
  if (valid) return `${className} valid`;
  return className;
}

function getHint(error: ErrorMessageType, valid: boolean) {
  if (error) return error;
  if (valid) return "Valid value.";
  return null;
}

export interface InputProps<FormType>
  extends FieldProps<FormType>,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "defaultValue" | "name" | "onBlur" | "onChange" | "required"
    > {
  label: string;
}

function Input<FormType>(props: InputProps<FormType>) {
  const {
    value,
    error,
    valid,
    onSubmit,
    onBlur,
    onChange,
    ref,
    formDisabled,
    formLoading,
    // ffHandler, If some extra treatment is needed
  } = useFormFull.field<FormType>(props);

  const { label, required, name } = props;

  return (
    <div
      className={getErrorClassname("form-control", error, valid)}
      style={{ opacity: formDisabled ? 0.5 : 1 }}>
      <label htmlFor={name} className='form-input-label'>
        {label} {!!required ? "*" : ""}
      </label>
      <input
        name={name}
        value={value}
        ref={ref}
        required={!!required}
        disabled={formDisabled || formLoading}
        onKeyPress={onSubmit}
        onChange={(event) => {
          onChange(event, event.target.value);
        }}
        onBlur={onBlur}
        className='form-input'
      />
      <span className='form-input-hint'>{getHint(error, valid)}</span>
    </div>
  );
}
export default React.memo(Input) as typeof Input;
