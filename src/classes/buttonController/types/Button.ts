import { ButtonActionType } from "./ButtonHandler";

export interface ButtonProps {
  feedback?: boolean;
  action?: ButtonActionType;
  onClick?: (event: any) => void;
}
