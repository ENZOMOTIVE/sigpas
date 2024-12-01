import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';

interface PendingCredential {
  tokenId: string;
  student: string;
  signatureCount: string;
  metadata: {
    name: string;
    description: string;
  };
}

export const ValidatorDashboard: React.FC = () => {
  const [pendingCredentials, setPendingCredentials] = useState<PendingCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWallet();

  useEffect(() => {
    const fetchPendingCredentials = async () => {
      if (!account) return;

      try {
        const contract = await getContract();
        const filter = contract.filters.CredentialCreated();
        const events = await contract.queryFilter(filter);

        const credentialPromises = events.map(async (event: any) => {
          const tokenId = event.args.tokenId;
          const isValid = await contract.isCredentialValid(tokenId);
          
          if (!isValid) {
            const signatureCount = await contract.getSignatureCount(tokenId);
            const metadataURI = event.args.metadataURI;
            const response = await fetch(metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'));
            const metadata = await response.json();

            return {
              tokenId: tokenId.toString(),
              student: event.args.student,
              signatureCount: signatureCount.toString(),
              metadata,
            };
          }
          return null;
        });

        const resolvedCredentials = (await Promise.all(credentialPromises))
          .filter((cred): cred is PendingCredential => cred !== null);
        setPendingCredentials(resolvedCredentials);
      } catch (error) {
        console.error('Error fetching pending credentials:', error);
        toast.error('Failed to fetch pending credentials');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCredentials();
  }, [account]);

  const handleSign = async (tokenId: string) => {
    try {
      const contract = await getContract();
      const tx = await contract.signCredential(tokenId);
      await tx.wait();
      
      toast.success('Credential signed successfully!');
      
      // Remove the signed credential from the list
      setPendingCredentials(prev => 
        prev.filter(cred => cred.tokenId !== tokenId)
      );
    } catch (error) {
      console.error('Error signing credential:', error);
      toast.error('Failed to sign credential');
    }
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Please connect your wallet to access the validator dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Loading pending credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Validations</h2>
      <div className="grid gap-6">
        {pendingCredentials.map((credential) => (
          <div 
            key={credential.tokenId}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-2">{credential.metadata.name}</h3>
            <p className="text-gray-600 mb-4">{credential.metadata.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">
                  Student: {credential.student}
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  Current Signatures: {credential.signatureCount}
                </span>
              </div>
              <button
                onClick={() => handleSign(credential.tokenId)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign Credential
              </button>
            </div>
          </div>
        ))}
        {pendingCredentials.length === 0 && (
          <p className="text-gray-500 text-center">No pending credentials</p>
        )}
      </div>
    </div>
  );
};