import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';
import { Award, Clock, CheckCircle } from 'lucide-react';

interface Credential {
  tokenId: string;
  isValid: boolean;
  signatureCount: number;
  metadata: {
    name: string;
    description: string;
  };
}

const StudentCredentials: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWallet();

  useEffect(() => {
    const fetchStudentCredentials = async () => {
      if (!account) return;

      try {
        const contract = await getContract();
        const filter = contract.filters.CredentialCreated();
        const events = await contract.queryFilter(filter);

        const credentialPromises = events.map(async (event: any) => {
          const tokenId = event.args.tokenId;
          const student = event.args.student;

          if (student.toLowerCase() !== account.toLowerCase()) {
            return null;
          }

          const isValid = await contract.isCredentialValid(tokenId);
          const signatureCount = await contract.getSignatureCount(tokenId);
          const metadataURI = await contract.tokenURI(tokenId);

          const response = await fetch(metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'));
          const metadata = await response.json();

          return {
            tokenId: tokenId.toString(),
            isValid,
            signatureCount: Number(signatureCount),
            metadata,
          };
        });

        const resolvedCredentials = (await Promise.all(credentialPromises)).filter(Boolean) as Credential[];
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
      <div className="flex items-center justify-center py-12">
        <Clock className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-2 text-xl text-gray-600">Loading credentials...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">My Credentials</h2>
      </div>
      <div className="grid gap-6">
        {credentials.map((credential) => (
          <div key={credential.tokenId} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{credential.metadata.name}</h3>
                <p className="text-gray-600 mt-2">{credential.metadata.description}</p>
              </div>
              <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                credential.isValid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {credential.isValid ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Validated
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Pending
                  </>
                )}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Token ID: {credential.tokenId}</span>
              <span>•</span>
              <span>Signatures: {credential.signatureCount}</span>
            </div>
          </div>
        ))}
        {credentials.length === 0 && (
          <div className="text-center py-8 card">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No credentials found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCredentials;