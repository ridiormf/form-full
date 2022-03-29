import React from "react";

export function useConstructor(onBuilding: Function): void {
  const created = React.useRef(false);
  if (!created.current) {
    created.current = true;
    onBuilding();
  }
}
