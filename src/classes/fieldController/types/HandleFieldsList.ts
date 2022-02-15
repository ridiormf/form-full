import { FieldHandler } from "../FieldHandler";
import { FieldValueType } from "./FieldHandler";

export interface CurrentValuesType {
  [name: string]: FieldValueType;
}

export interface Fields {
  [name: string]: FieldHandler;
}
