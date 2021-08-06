import { FormButtonHandlerContructor } from "../types/FormButtonHandler";

class FormButtonHandler {
  type; // tipos de interações entre botão - form
  setLoading; // callback loading do botão com o form
  setDisabled; // callback disabled do botão com o form

  constructor({ type, setLoading, setDisabled }: FormButtonHandlerContructor) {
    this.type = type;
    this.setLoading = setLoading;
    this.setDisabled = setDisabled;
  }

  _handleStatus = (isValidating: boolean): void => {
    if (this.type === "submit") {
      this.setLoading(isValidating);
    } else {
      this.setDisabled(isValidating);
    }
  };
}

export { FormButtonHandler };
