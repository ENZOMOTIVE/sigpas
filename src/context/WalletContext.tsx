import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkIfWalletIsConnected, connectWallet, getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';

type Role = 'student' | 'issuer' | 'validator' | null;

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
  const [role, setRole] = useState<Role>(null);
  const [connecting, setConnecting] = useState(false);

  const checkRole = async (address: string) => {
    const contract = await getContract();
    const isIssuer = await contract.hasRole(await contract.ISSUER_ROLE(), address);
    const isValidator = await contract.hasRole(await contract.VALIDATOR_ROLE(), address);
    
    if (isIssuer) return 'issuer';
    if (isValidator) return 'validator';
    return 'student';
  };

  useEffect(() => {
    const checkWallet = async () => {
      const address = await checkIfWalletIsConnected();
      setAccount(address);
      if (address) {
        const userRole = await checkRole(address);
        setRole(userRole);
      }
    };

    checkWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        const newAccount = accounts[0] || null;
        setAccount(newAccount);
        if (newAccount) {
          const userRole = await checkRole(newAccount);
          setRole(userRole);
        } else {
          setRole(null);
        }
      });
    }
  }, []);

  const connect = async () => {
    try {
      setConnecting(true);
      const address = await connectWallet();
      setAccount(address);
      const userRole = await checkRole(address);
      setRole(userRole);
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
    setRole(null);
    toast.success('Wallet disconnected');
  };

  return (
    <WalletContext.Provider value={{ account, role, connecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

