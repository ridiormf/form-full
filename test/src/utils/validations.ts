import { ErrorMessageType } from "form-full";

function removeNumberMask(string: string | number): string {
  return String(string).replace(/\D/g, "");
}

const validateCPF =
  (noCPFMessage: string, invalidCPFMessage: string) =>
  (CPF: string | number | undefined | null): ErrorMessageType => {
    if (!CPF) {
      return noCPFMessage;
    }
    let clearCPF = "";
    if (CPF) {
      clearCPF = removeNumberMask(CPF);
    } else {
      return noCPFMessage;
    }

    let errorMessage = invalidCPFMessage;
    let sum = 0;
    let rest;
    if (
      clearCPF.length !== 11 ||
      clearCPF === "00000000000" ||
      clearCPF === "11111111111" ||
      clearCPF === "22222222222" ||
      clearCPF === "33333333333" ||
      clearCPF === "44444444444" ||
      clearCPF === "55555555555" ||
      clearCPF === "66666666666" ||
      clearCPF === "77777777777" ||
      clearCPF === "88888888888" ||
      clearCPF === "99999999999"
    ) {
      return errorMessage;
    }
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(clearCPF.substring(i - 1, i), 10) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) {
      rest = 0;
    }
    if (rest !== parseInt(clearCPF.substring(9, 10), 10)) {
      return errorMessage;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(clearCPF.substring(i - 1, i), 10) * (12 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) {
      rest = 0;
    }
    if (rest !== parseInt(clearCPF.substring(10, 11), 10)) {
      return errorMessage;
    }
    return null;
  };

const validateCNPJ =
  (noCNPJMessage: string, invalidCNPJMessage: string) =>
  (CNPJ: string | number | undefined | null): ErrorMessageType => {
    let clearCNPJ = "";
    let errorMessage = noCNPJMessage;
    if (CNPJ) {
      clearCNPJ = removeNumberMask(CNPJ);
    } else {
      return invalidCNPJMessage;
    }

    if (clearCNPJ === "") {
      return invalidCNPJMessage;
    }

    if (clearCNPJ.length !== 14) {
      return errorMessage;
    }

    if (
      clearCNPJ === "00000000000000" ||
      clearCNPJ === "11111111111111" ||
      clearCNPJ === "22222222222222" ||
      clearCNPJ === "33333333333333" ||
      clearCNPJ === "44444444444444" ||
      clearCNPJ === "55555555555555" ||
      clearCNPJ === "66666666666666" ||
      clearCNPJ === "77777777777777" ||
      clearCNPJ === "88888888888888" ||
      clearCNPJ === "99999999999999"
    ) {
      return errorMessage;
    }

    let size = clearCNPJ.length - 2;
    let numbers = clearCNPJ.substring(0, size);
    const digits = clearCNPJ.substring(size);

    let sum = 0;
    let position = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i), 10) * position--;
      if (position < 2) {
        position = 9;
      }
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0), 10)) {
      return errorMessage;
    }

    size += 1;
    numbers = clearCNPJ.substring(0, size);
    sum = 0;
    position = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i), 10) * position--;
      if (position < 2) {
        position = 9;
      }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1), 10)) {
      return errorMessage;
    }

    return null;
  };

export { validateCPF, validateCNPJ };
