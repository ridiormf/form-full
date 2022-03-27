import { maskCPF, removeNumberMask } from "../utils/masks";
import { validateCPF } from "../utils/validations";
import InputComponent from "./InputComponent";

export default function InputCPF<T>(props: any) {
  return (
    <InputComponent<T>
      {...props}
      validation={validateCPF(
        "Insira um número de CPF",
        "O CPF digitado não está no formato válido",
      )}
      mask={maskCPF}
      maskToSubmit={removeNumberMask}
    />
  );
}
