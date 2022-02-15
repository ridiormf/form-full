import { ButtonActionType } from "./ButtonHandler";

export interface ButtonProps {
  name: string;
  actionType?: ButtonActionType;
  onClick?: (event: any) => void;
}
