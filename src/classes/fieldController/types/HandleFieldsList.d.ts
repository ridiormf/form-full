import { FieldHandler } from "../classes/fieldController/FieldHandler";
import { FieldValueType } from "./FieldHandler";

export interface ActualValuesType {
  [name: string]: FieldValueType;
}

export interface Fields {
  [name: string]: FieldHandler;
}
