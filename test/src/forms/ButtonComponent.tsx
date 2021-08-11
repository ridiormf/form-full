import React from "react";
import { useFormFull } from "form-full";

function Button({
  children,
  actionType,
  name,
  onClick: onClickProps,
  ...props
}: any) {
  const { onClick, formLoading, formDisabled } = useFormFull.button({
    name,
    actionType,
    onClick: onClickProps,
  });

  return (
    <button
      {...props}
      className="button"
      disabled={formDisabled}
      onClick={formLoading ? null : onClick}
    >
      {formLoading ? "Loading..." : children}
    </button>
  );
}

export default React.memo(Button);
