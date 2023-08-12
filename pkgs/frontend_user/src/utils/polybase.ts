import { Polybase } from "@polybase/client";
import { ethPersonalSign } from '@polybase/eth';
import { DB_NAME_SPACE } from "./Contents";

const {
  REACT_APP_CONNECT_ADDRESS_PRIVATE_KEY
} = process.env;


/**
 * create polybase object
 */
export const createPolybaseObject = ():any => {
  // Config of polybase
  const polybase = new Polybase({
    defaultNamespace: DB_NAME_SPACE,
  });

  polybase.signer((data: any) => {
    return {
      h: 'eth-personal-sign',
      sig: ethPersonalSign(`0x${REACT_APP_CONNECT_ADDRESS_PRIVATE_KEY!}`, data)
    }
  });

  return polybase;
};