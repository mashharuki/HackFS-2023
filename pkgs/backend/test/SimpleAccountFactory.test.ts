import { ethers } from "hardhat";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

/**
 * SimpleAccountFactoryコントラクトの用のテストコードです。
 */
describe("SimpleAccountFactory", () => {
  // エントリーポイントコントラクトのアドレス
  const ENTRY_POINT_CONTRACT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

  /**
   * デプロイなど必要なものを一式揃えるためのメソッド
   * @returns 
   */
  async function fixture() {
    const network = await ethers.provider.getNetwork();
    const [owner, other] = await ethers.getSigners();
    // コントラクトをデプロイ
    const simpleAccountFactory = await ethers.deployContract("SimpleAccountFactory", [ENTRY_POINT_CONTRACT]);
    
    return { network, owner, other, simpleAccountFactory };
  }

  /**
   * 指定したアドレスの残高をnumber型で返却するメソッド
   */
  async function getBalance(address: string): Promise<number> {
    const balance = (await ethers.provider.getBalance(address)).toNumber();
    return balance;
  }

  describe("initial state", () => {
    it("success", async () => {
      const { owner, simpleAccountFactory } = await loadFixture(fixture);

      expect(await simpleAccountFactory.entryPoint()).to.equal(ENTRY_POINT_CONTRACT);
    });
  });

  describe("create wallet", () => {
    it("event emit test", async () => {
      const { owner, simpleAccountFactory } = await loadFixture(fixture);
      expect(await simpleAccountFactory.createAccount(owner.address, 0)).to.emit(simpleAccountFactory, 'Created');
    });
    it("craete test", async () => {
      const { owner, simpleAccountFactory } = await loadFixture(fixture);
      // create
      const contractWallet = await simpleAccountFactory.createAccount(owner.address, 0);

      expect("0x9cf8542F16a97777CbA0f7C8bB6E59761E5b584B").to.equal(await simpleAccountFactory.getAddress(owner.address, 0));
    });
    it("craete test2", async () => {
      const { owner, simpleAccountFactory } = await loadFixture(fixture);
      // create
      const contractWallet = await simpleAccountFactory.createAccount(owner.address, 1);
      
      expect("0xf6e80eaa5D7532Bef7e7d864ccDD7827424E0245").to.equal(await simpleAccountFactory.getAddress(owner.address, 1));
    });
  });

  describe("addStake", () => {
    it("addStake test", async () => {
      const { owner, simpleAccountFactory } = await loadFixture(fixture);
    
      const beforeBalance: number = await getBalance(ENTRY_POINT_CONTRACT);
      // add stake
      await simpleAccountFactory.addStake( 10, {
        from: owner.address,
        value: 5
      });
      const afterBalance: number = await getBalance(ENTRY_POINT_CONTRACT);

      expect(afterBalance - beforeBalance).to.equal(5);
    });
  });
});