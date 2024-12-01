import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';

interface Credential {
  tokenId: string;
  isValid: boolean;
  signatureCount: string;
  metadata: {
    name: string;
    description: string;
  };
}

export const StudentCredentials: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWallet();

  useEffect(() => {
    const fetchStudentCredentials = async () => {
      if (!account) return;

      try {
        const contract = await getContract();
        const filter = contract.filters.CredentialCreated(null, account, null);
        const events = await contract.queryFilter(filter);

        const credentialPromises = events.map(async (event: any) => {
          const tokenId = event.args.tokenId;
          const isValid = await contract.isCredentialValid(tokenId);
          const signatureCount = await contract.getSignatureCount(tokenId);
          const metadataURI = event.args.metadataURI;

          // Fetch metadata from IPFS
          const response = await fetch(metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'));
          const metadata = await response.json();

          return {
            tokenId: tokenId.toString(),
            isValid,
            signatureCount: signatureCount.toString(),
            metadata,
          };
        });

        const resolvedCredentials = await Promise.all(credentialPromises);
        setCredentials(resolvedCredentials);
      } catch (error) {
        console.error('Error fetching credentials:', error);
        toast.error('Failed to fetch credentials');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCredentials();
  }, [account]);

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Please connect your wallet to view your credentials.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Loading credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Credentials</h2>
      <div className="grid gap-6">
        {credentials.map((credential) => (
          <div 
            key={credential.tokenId}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-2">{credential.metadata.name}</h3>
            <p className="text-gray-600 mb-4">{credential.metadata.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Token ID: {credential.tokenId}</span>
                <br />
                <span className="text-sm text-gray-500">
                  Signatures: {credential.signatureCount}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                credential.isValid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {credential.isValid ? 'Validated' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
        {credentials.length === 0 && (
          <p className="text-gray-500 text-center">No credentials found</p>
        )}
      </div>
    </div>
  );
};