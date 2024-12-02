import { useState, useEffect } from 'react';
import { getContract } from '../utils/ethereum';

export type Role = 'student' | 'issuer' | 'validator' | null;

export const useWalletRole = (address: string | null) => {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!address) {
        setRole(null);
        return;
      }

      try {
        const contract = await getContract();
        const isIssuer = await contract.hasRole(await contract.ISSUER_ROLE(), address);
        const isValidator = await contract.hasRole(await contract.VALIDATOR_ROLE(), address);
        
        if (isIssuer) setRole('issuer');
        else if (isValidator) setRole('validator');
        else setRole('student');
      } catch (error) {
        console.error('Error checking role:', error);
        setRole(null);
      }
    };

    checkRole();
  }, [address]);

  return role;
};