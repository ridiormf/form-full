import FieldHandler from "./FieldHandler";

export interface Fields<ValueType extends any, FormData extends any> {
  [name: string]: FieldHandler<ValueType, FormData>;
}
