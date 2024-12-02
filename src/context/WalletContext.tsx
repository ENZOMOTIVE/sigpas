import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkIfWalletIsConnected, connectWallet } from '../utils/ethereum';
import { useWalletRole, Role } from '../hooks/useWalletRole';
import { toast } from 'react-hot-toast';

interface WalletContextType {
  account: string | null;
  role: Role;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  role: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const role = useWalletRole(account);

  useEffect(() => {
    const checkWallet = async () => {
      const address = await checkIfWalletIsConnected();
      setAccount(address);
    };

    checkWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  const connect = async () => {
    try {
      setConnecting(true);
      const address = await connectWallet();
      setAccount(address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    toast.success('Wallet disconnected');
  };

  return (
    <WalletContext.Provider value={{ account, role, connecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};