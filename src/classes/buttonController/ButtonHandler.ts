import { ButtonHandlerParams } from "./types/ButtonHandler";

class ButtonHandler {
  actionType;
  setLoading;
  setDisabled;

  constructor({ actionType, setLoading, setDisabled }: ButtonHandlerParams) {
    this.actionType = actionType;
    this.setLoading = setLoading;
    this.setDisabled = setDisabled;
  }

  _handleStatus = (isValidating: boolean): void => {
    if (this.actionType === "submit") {
      this.setLoading(isValidating);
    } else {
      this.setDisabled(isValidating);
    }
  };
}

export { ButtonHandler };
