import { Polybase } from "@polybase/client";
import { ethPersonalSign } from '@polybase/eth';
import { DB_NAME_SPACE } from "./Contents";

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
      sig: ethPersonalSign(`0x${process.env.NEXT_PUBLIC_CONNECT_ADDRESS_PRIVATE_KEY!}`, data)
    }
  });

  return polybase;
};