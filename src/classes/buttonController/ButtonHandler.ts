import { ButtonHandlerParams } from "./ButtonHandler-types";

class ButtonHandler {
  action;
  setLoading;
  setDisabled;

  constructor({ action, setLoading, setDisabled }: ButtonHandlerParams) {
    this.action = action;
    this.setLoading = setLoading;
    this.setDisabled = setDisabled;
  }

  _handleStatus = (isValidating: boolean): void => {
    if (this.action === "submit") {
      this.setLoading(isValidating);
    } else {
      this.setDisabled(isValidating);
    }
  };

  _setDisabledByForm = (disabled: boolean): void => {
    this.setDisabled(disabled);
  };
}

export { ButtonHandler };
