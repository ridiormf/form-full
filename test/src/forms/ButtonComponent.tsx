import React from "react";
import { useFormFull } from "form-full";

function Button<T>({
  children,
  actionType,
  name,
  onClick: onClickProps,
  ...props
}: any) {
  const { onClick, formLoading, formDisabled } = useFormFull.button<T>({
    name,
    actionType,
    onClick: onClickProps,
  });

  return (
    <button
      {...props}
      className='button'
      disabled={formDisabled}
      onClick={formLoading ? null : onClick}>
      {formLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;
