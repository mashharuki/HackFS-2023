import * as LitJsSdk from '@lit-protocol/lit-node-client';

const client = new LitNodeClient();
const chain = "mumbai";

// Checks if the user has at least 50 MATIC
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "50000000000000000000", // 50 MATIC
    },
  },
];

/**
 * Lit Class
 */
class Lit {
  litNodeClient: any;

  /**
   * connect method
   */
  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  /**
   * encryptText method
   */
  async encryptText(text: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
        encryptedString,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }

  /**
   * decryptText
   */
  async decryptText(encryptedString: any, encryptedSymmetricKey: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });

    return await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
    );
  }
}

export default new Lit();
