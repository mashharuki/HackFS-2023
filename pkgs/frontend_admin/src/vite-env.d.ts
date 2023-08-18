interface ImportMetaEnv {
  readonly VITE_RPC_URL: string;
  readonly VITE_ETH_MAINNET_RPC_URL: string;
  readonly VITE_BUNDLER_RPC_URL: string;
  readonly VITE_PAYMASTER_RPC_URL: string;
  readonly VITE_ALCHEMY_API_KEY: string;
  readonly VITE_PAYMASTER_CONTEXT: string;
  readonly VITE_CONNECT_ADDRESS_PRIVATE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}