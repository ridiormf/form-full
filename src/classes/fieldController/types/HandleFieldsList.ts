import { FieldHandler } from "../FieldHandler";

export interface CurrentValuesType {
  [name: string]: any;
}

export interface Fields {
  [name: string]: FieldHandler;
}
