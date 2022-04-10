import { CONSTS } from "./consts";

export const throwError = (message: string): never => {
  throw new Error(`${CONSTS.ERROR_MESSAGE_PREFIX}${message}`);
};
