import { FormButtonHandlerContructor } from "../types/FormButtonHandler";
import { FormButtons } from "../types/HandleFormButtons";
import { FormButtonHandler } from "./FormButtonHandler";

class HandleFormButtons {
  formButtons: FormButtons = {};
  buttonNames: Array<string> = [];

  static invalidNameError(name: string): void {
    throw new Error(
      `O botão do formConfig espera receber a propriedade "name" como string, mas recebeu um "${typeof name}".`
    );
  }

  static buttonAlreadyExist(name: string): void {
    throw new Error(`O botão "${name}" já foi criado.`);
  }

  static cantDeleteButton(name: string): void {
    throw new Error(`O botão "${name}" não existe e não pode ser deletado.`);
  }

  setNewButton = (
    name: string,
    buttonParams: FormButtonHandlerContructor
  ): void => {
    if (typeof name !== "string") {
      HandleFormButtons.invalidNameError(name);
    } else if (!this.formButtons[name]) {
      this.buttonNames.push(name);
      this.formButtons[name] = new FormButtonHandler(buttonParams);
    } else {
      HandleFormButtons.buttonAlreadyExist(name);
    }
  };

  removeButton = (name: string): void => {
    if (!this.formButtons[name]) {
      HandleFormButtons.cantDeleteButton(name);
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
}

export { HandleFormButtons };
