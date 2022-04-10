import FieldHandler from "./FieldHandler";

export interface Fields<FormType> {
  [name: string]: FieldHandler<FormType>;
}
