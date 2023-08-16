import { PUSH_CHANNEL_ADDRESS } from '@/utils/Contents';
import { getConnectSigner } from '@/utils/ethereum';
import { getCAIPAddress } from '@/utils/helper';
import * as PushAPI from '@pushprotocol/restapi';

/**
 * send Notification method
 * @param address recipient address
 */
export const sendNotifications = async(address: string) => {
  const env: any = 'staging';
  // get signer
  const signer = getConnectSigner();
  // send notifications
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: signer,
    type: 3, // target
    identityType: 2, // direct payload
    notification: {
      title: `【Okozukai Wallet】Received Notification`,
      body: `You were received crypo currency!!`
    },
    payload: {
      title: `【Okozukai Wallet】Received Notification`,
      body: `You were received crypo currency!! Please check it!!`,
      cta: '',
      img: ''
    },
    recipients: `eip155:5:${address}`, // recipient address
    channel: `eip155:5:${PUSH_CHANNEL_ADDRESS}`, // channel address
    env: env
  });

  console.log("send notification result:", apiResponse);
};

/**
 * get Notification (Spam) method
 */
export const loadNotifications = async(
  isCAIP: boolean, 
  account: string
): Promise<PushAPI.ParsedResponseType[]> => {
  
  const env: any = 'staging';
  console.log("account:", account)
  // get spams
  const spams: PushAPI.ParsedResponseType[] = await PushAPI.user.getFeeds({
    user: isCAIP ? getCAIPAddress(env, account) : account,
    spam: true,
    env: env
  });

  return spams;
};