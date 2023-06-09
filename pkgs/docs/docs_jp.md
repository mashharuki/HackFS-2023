# document for Japanese

## Description

OkozukaiWallet は、Web3 のマスアダプションのきっかけを作るプロダクトです。

秘密鍵の管理など Web3 の世界に入るためのセットアップは EOA が引き受けて、ユーザーはトークンの管理を手軽に行うことができます。

技術が発展してきて様々なユースケースが生まれているものの、まだ世間的には Web3 に対する投機的なイメージや危険なイメージがあります。

秘密鍵の管理を個人が行わなければならない点も大きなハードルになっています。

そこで、Account Abstraction・The Graph・Polybase・Push Protocol・ Lit Protocol の技術を組み合わせて、子供でも使えるようなスマートコントラクトウォレットアプリの実現を目指してプロトタイプを開発しました。

EOA の概念を正しく理解できる人がセットアップや財源の管理を行います。そこからユーザー用のコントラクトウォレットに資産を入金します。

入金された資産の操作権限はユーザーが持つ形となり、送金もユーザーの意思で好きなタイミングで行うことができます。
ただし、秘密鍵による署名は不要です。

Polybase や Push Protocol の技術も組み合わせてウォレットの管理に必要な情報もすぐに確認できるようにしています。

## Archtechture

## How's it built

フロントエンドは、React.js と TypeScript を主に使って作りました。
バックエンドは、Hardhat と Solidity を主に使って作りました。

このアプリを作るために使った技術は以下の通りです。

| No. | Name                |
| :-- | :------------------ |
| 1   | React.js            |
| 2   | Tailwind CSS        |
| 3   | ERC4337             |
| 4   | ERC20               |
| 5   | The Graph           |
| 6   | hardhat             |
| 8   | TypeScript          |
| 9   | Polybase SDK        |
| 10  | Account Abstraction |
| 11  | Push Protocol SDK   |
| 12  | openzeppelin        |
| 13  | ethers.js           |
| 14  | userOp.js           |
| 15  | yarn workspaces     |
| 16  | Spheron             |
| 17  | LitProtocol         |
| 18  | Alchemy SDK         |

各 SDK など今回 Prize に関係する技術はそれぞれ次のように使用しています。

- Polybase

  コントラクトウォレットから送信したトランザクションの情報を管理・照会するために使用しています。

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/pkgs/frontend/src/Components/Transfer/index.tsx#L46-L58)

- Push Protocol

  コントラクトウォレットからトークンを送金した場合に受け取り手に通知を発信するために使用しています。

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/pkgs/frontend/src/hooks/usePush.ts)

- IPFS

  Subgraph 用のファイルをアップロード・管理しています。

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/README.md#subgrph-info)

- FileCoin Network

  spheron にビルドした成果物をアップロードしていますが、この時の基盤に FileCoin Network を使用しています。

- Lit Protcol

  バンドラーの機能を使うために必要な署名鍵を暗号化しておくために使用しています。

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/pkgs/frontend/src/hooks/useUserOp.ts#L19-L44)

## Mission

- Problems

  1. まだまだ投機的イメージが強い。
  2. エンドユーザー側に鍵管理の責任が存在している。
  3. 子供やデジタルに不慣れな人には参入障壁が高い領域となっている。

- Solutions

  1. 鍵管理や大元の財源管理などは EOA が行う。
  2. エンドユーザーが鍵管理無しで資産を管理できる UX を作る。
  3. 使用履歴や通知機能など使いやすい UX も兼ね備えたウォレットにする。

## Developed features

- for admin (EOA)

  1. ユーザーごとのコントラクトウォレットの作成機能
  2. コントラクトウォレットへの入金機能
  3. 各コントラクトウォレットのトランザクション実行履歴照会機能

- for user (non-EOA)

  1. 任意のアドレスへのトークン(Native、ERC20、NFT)送金機能
  2. トランザクション実行履歴照会機能
  3. トークン受け取り時の通知機能

## What I tried

Push Protocol SDK と Polybase SDK・ Lit Protocol SDK を使って初めて Dapp を開発しました。
それぞれのプロトコルの特徴・機能を調べて、アカウントアブストラクションをベースにしながら一個のアプリに組み上げたところが一番苦労した点です。

スターターキットや Get Started のドキュメントを参考にして技術検証を行った後に、本体のアプリに機能を組み込んでいきました。

## About Future

処理が遅くなってしまっている部分があるため、もう少し性能が改善できないか設計も見直していこうと思います。
また、今はまだ実装していませんが、ユーザー向けの KYC 機能やアカウント管理機能なども実装してより使いやすくセキュアなシステムに改修することを目指します。

## resolver のサンプル例

```ts
/**
 * resolve ENS
 */
const resolveEns = async (value: string) => {
  // check ENS
  const suffix = ".eth";
  const suffixLength = suffix.length;
  const inputLength = value.length;

  if (inputLength < suffixLength) {
    alert("This is invalid ENS!");
    setAddress("");
  }

  const lastFourCharacters = value.slice(-suffixLength);

  if (lastFourCharacters === suffix) {
    // get provider
    const provider = getProvider();
    console.log("provider:", provider);
    // resolve ENS
    const resolver = await provider.getResolver("abittooawesome.eth");
    console.log("resolver:", resolver);
  } else {
    setAddress(value);
  }
};
```

### デモ動画の構成案

1. まず簡単に今回作った概要説明 (40 秒)  
   Ok, Let's start prezentation.
   I developed OkozukaiWallet at this hackathon.
   It is a product that makes an opportunity for mass adoption of Web3.

   Non EOA users will be able to manage their tokens easily without key management.

   Although the technology has developed and various use cases have been created, the public still has a dangerous image of Web3.

   The fact that private keys must be managed by individuals is also a major hurdle.

   Therefore, I developed a prototype that combines Web3 Technology (Account Abstraction, The Graph, Polybase, Push Protocol, and Lit Protocol technologies ) to realize a smart contract wallet application that can be used even by children.

2. 機能の紹介 (30 秒)
   I have developed 3 functions each for EOA and non-EOA users!  
   A detailed functional overview will be shown in the demo that follows.

- for admin (EOA)

  1. Ability to create per-user contract wallets
  2. Ability to deposit funds into a contract wallet
  3. Transaction execution history inquiry function for each contract wallet

- for user (non-EOA)

  1. Ability to send tokens (Native, ERC20, NFT) to any address
  2. Transaction History Inquiry Function
  3. Notification function upon receipt of token

3. prize になりそうな技術をどのように使ったか説明する。 (30 秒)

To apply for the PRIZE slot, the following techniques are used.

4. デモ (デモ用の factory を作成 + 入金 + 送金 + トランザクションの履歴確認 + 通知履歴を確認) (110 秒)
   this screen is home screen for admin.
   first, Admin need to create walletFactory & stake a little bit Native token.

   OK! Next, Let's transfer tokens from Contract Wallet!
   You can see Asset management Screen. this is home screen for user.(non EOA)

   This time I show you to transfer NFT token.
   I would like to send it to the address I just created.

   this Screen is home screen for Non-EOA users.

   Push Protocol is used to send notifications to recipients when tokens are transferred from a contract wallet.

   Polybase is used to manage and query information on transactions sent from the contract wallet.

   The AccountAbstraction is used to allow non-EOA users to send tokens. In this case, a private key for the bundler is required, and LitProtocol is used for its encryption.

   Notification incresed! Transaction incresed!!

   OK! It's success!!

   My prezation is done! Thank you for listening!

5. 今後対応していく予定のもの (30 秒)

mission の部分の細かい部分は、画像データとしてアップロードだけにする。

プレゼン資料にはこの他、ミッションのことを追記する。
目次

1. コンセプト
2. アーキテクチャ
3. コントラクトレイヤーの設計
4. mission
5. 機能
6. prize になりそうなポイントをまとめたスライド
7. 今後について
