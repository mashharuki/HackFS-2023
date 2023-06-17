# document for English

## Description

OkozukaiWallet is a product that creates an opportunity for mass adoption of Web3.

EOA will take care of the setup for entering the Web3 world, including the management of private keys, and users will be able to manage their tokens easily.

Although the technology has developed and various use cases have been created, the public still has a speculative and dangerous image of Web3.

The fact that private keys must be managed by individuals is also a major hurdle.

Therefore, we developed a prototype that combines Account Abstraction, The Graph, Polybase, Push Protocol, and Lit Protocol technologies to realize a smart contract wallet application that can be used even by children.

Someone who can properly understand the concept of EOA will manage the setup and financial resources. From there, assets are deposited into a contract wallet for the user.

The user has the authority to operate the deposited assets, and can transfer money at any time at the user's will.
However, the private key signature is not required.

Polybase and Push Protocol technologies are also combined to provide instant access to information necessary for wallet management.

## Archtechture

## How's it built

The front end was built primarily using React.js and TypeScript.
The backend was built primarily using Hardhat and Solidity.

The technologies used to create this application are as follows

1 React.js  
2 Tailwind CSS  
3 ERC4337  
4 ERC20  
5 The Graph  
6 hardhat  
7 Alchemy SDK
8 TypeScript  
9 Polybase SDK  
10 Account Abstraction
11 Push Protocol SDK  
12 openzeppelin  
13 ethers.js  
14 userOp.js  
15 yarn workspaces  
16 Spheron  
17 LitProtocol  
18 Alchemy SDK

Each SDK and other technologies related to the Prize are used as follows

- Polybase

  It is used to manage and query information on transactions sent from the contract wallet.

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/pkgs/frontend/src/Components/Transfer/index.tsx#L46-L58)

- Push Protocol

  Used to send out notifications to recipients when tokens are transferred from a contract wallet.

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/pkgs/frontend/src/hooks/usePush.ts)

- IPFS

  Upload and manage files for Subgraph.

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/README.md#subgrph-info)

- FileCoin Network

  We use FileCoin Network as the foundation for uploading our builds to spheron.

- Lit Protcol

  It is used to encrypt the signature key needed to use the bundler's functions.

  [使っている場所](https://github.com/mashharuki/HackFS-2023/blob/main/pkgs/frontend/src/hooks/useUserOp.ts#L19-L44)

## Mission

- Problems

  1. There is Responsibility for key management on the end-user side, many risks
  2. This is an area with high barriers to entry for children and those unfamiliar with digital technology.
  3. For reasons 1 and 2, it is harder for technology to penetrate the masses.

- Solutions

  1. EOA will be responsible for key management and management of the major financial resources.
  2. Create a UX that allows end users to manage assets without key management.
  3. The wallet should also have an easy-to-use UX, such as usage history and notification functions.

## Developed features

- for admin (EOA)

  1. Ability to create per-user contract wallets
  2. Ability to deposit funds into a contract wallet
  3. Transaction execution history inquiry function for each contract wallet

- for user (non-EOA)

  1. Ability to send tokens (Native, ERC20, NFT) to any address
  2. Transaction History Inquiry Function
  3. Notification function upon receipt of token

## What I tried

I developed Dapp for the first time using the Push Protocol SDK and the Polybase and Lit Protocol SDKs.
The most difficult part was researching the features and functions of each protocol and assembling them into a single app based on account abstractions.

After conducting technical verification by referring to the starter kit and Get Started documentation, we incorporated the functions into the main application.

## About Future

Since processing has become slow in some areas, I will review the design to see if performance can be improved.
Also, although not implemented yet, I want to make the system easier to use and more secure by implementing KYC and account management functions for users.
