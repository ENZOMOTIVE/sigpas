import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { useWallet } from '../context/WalletContext';

export function useContractWithSigner() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { account } = useWallet();

  useEffect(() => {
    const initContract = async () => {
      if (!account || !window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initContract();
  }, [account]);

  return contract;
}