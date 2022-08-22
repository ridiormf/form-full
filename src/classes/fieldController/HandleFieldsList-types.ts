import FieldHandler from "./FieldHandler";

export interface Fields<FormData> {
  [name: string]: FieldHandler<FormData>;
}
