declare namespace NodeJS {
    interface ProcessEnv {
      VITE_CONTRACT_ADDRESS: string;
      VITE_PINATA_API_KEY: string;
      VITE_PINATA_SECRET_KEY: string;
      VITE_OPENCAMPUS_RPC_URL: string;
    }
  }