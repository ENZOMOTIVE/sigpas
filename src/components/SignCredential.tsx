import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';

interface SignCredentialProps {
  tokenId: string;
}

export const SignCredential: React.FC<SignCredentialProps> = ({ tokenId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signatureCount, setSignatureCount] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const { account } = useWallet();

  useEffect(() => {
    const fetchCredentialStatus = async () => {
      try {
        const contract = await getContract();
        const count = await contract.getSignatureCount(tokenId);
        const valid = await contract.isCredentialValid(tokenId);
        setSignatureCount(Number(count));
        setIsValid(valid);
      } catch (error) {
        console.error('Error fetching credential status:', error);
        toast.error('Failed to fetch credential status');
      }
    };

    if (account) {
      fetchCredentialStatus();
    }
  }, [tokenId, account]);

  const handleSign = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.signCredential(tokenId);
      await tx.wait();
      
      // Update status after signing
      const count = await contract.getSignatureCount(tokenId);
      const valid = await contract.isCredentialValid(tokenId);
      setSignatureCount(Number(count));
      setIsValid(valid);
      toast.success('Credential signed successfully!');
    } catch (error) {
      console.error('Error signing credential:', error);
      toast.error('Failed to sign credential');
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Please connect your wallet to sign credentials.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Credential #{tokenId}</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Current Signatures:</p>
          <p className="text-lg font-medium">{signatureCount}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Status:</p>
          <p className={`text-lg font-medium ${isValid ? 'text-green-600' : 'text-yellow-600'}`}>
            {isValid ? 'Validated' : 'Pending Signatures'}
          </p>
        </div>

        {!isValid && (
          <button
            onClick={handleSign}
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Signing...' : 'Sign Credential'}
          </button>
        )}
      </div>
    </div>
  );
};