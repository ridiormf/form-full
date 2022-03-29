import React from "react";
import { ButtonProps, useFormFull } from "form-full";

function Button<T>({
  children,
  action,
  feedback,
  onClick: onClickProps,
  ...props
}: ButtonProps & any) {
  const { onClick, formLoading, formDisabled } = useFormFull.button<T>({
    feedback,
    action,
    onClick: onClickProps,
  });
  return (
    <button
      {...props}
      className='button'
      disabled={formDisabled}
      style={{ opacity: formDisabled ? 0.5 : 1 }}
      onClick={formLoading || formDisabled ? null : onClick}>
      {formLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;
