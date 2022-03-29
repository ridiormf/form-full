import { ButtonHandlerParams } from "./ButtonHandler-types";
import { Buttons } from "./HandleButtonsList-types";
import { ButtonHandler } from "./ButtonHandler";

class HandleButtonsList {
  formButtons: Buttons = {};
  buttonNames: Array<string> = [];

  static invalidNameError(name: string): void {
    throw new Error(
      `The "form-full" button expects to receive the "name" property as a string, but it received a "${typeof name}".`,
    );
  }

  static buttonAlreadyExist(name: string): void {
    throw new Error(`The button "${name}" has already been created.`);
  }

  static cantDeleteButton(name: string): void {
    throw new Error(
      `The button "${name}" doesn't exist and cannot be removed.`,
    );
  }

  setNewButton = (name: string, buttonParams: ButtonHandlerParams): void => {
    if (typeof name !== "string") {
      HandleButtonsList.invalidNameError(name);
    } else if (!this.formButtons[name]) {
      this.buttonNames.push(name);
      this.formButtons[name] = new ButtonHandler(buttonParams);
    } else {
      HandleButtonsList.buttonAlreadyExist(name);
    }
  };

  removeButton = (name: string): void => {
    if (!this.formButtons[name]) {
      HandleButtonsList.cantDeleteButton(name);
    } else {
      delete this.formButtons[name];
      const nameIndex = this.buttonNames.indexOf(name);
      this.buttonNames.splice(nameIndex, 1);
    }
  };

  setButtonsStatus = (isValidating: boolean): void => {
    this.buttonNames.forEach((name) => {
      this.formButtons[name]._handleStatus(isValidating);
    });
  };

  setButtonsDisabled = (disabled: boolean): void => {
    this.buttonNames.forEach((name) => {
      this.formButtons[name]._setDisabledByForm(disabled);
    });
  };
}

export { HandleButtonsList };
