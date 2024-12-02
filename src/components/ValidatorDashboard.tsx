import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';
import { Shield, Clock, CheckCircle, Loader2 } from 'lucide-react';

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
  const [signingId, setSigningId] = useState<string | null>(null);
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
    setSigningId(tokenId);
    try {
      const contract = await getContract();
      const tx = await contract.signCredential(tokenId);
      await tx.wait();
      
      toast.success('Credential signed successfully!');
      setPendingCredentials(prev => prev.filter(cred => cred.tokenId !== tokenId));
    } catch (error) {
      console.error('Error signing credential:', error);
      toast.error('Failed to sign credential');
    } finally {
      setSigningId(null);
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
      <div className="flex items-center justify-center py-12">
        <Clock className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-2 text-xl text-gray-600">Loading pending credentials...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Pending Validations</h2>
      </div>
      <div className="grid gap-6">
        {pendingCredentials.map((credential) => (
          <div key={credential.tokenId} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {credential.metadata.name}
                </h3>
                <p className="text-gray-600 mb-4">{credential.metadata.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Signatures: {credential.signatureCount}
                  </span>
                  <span>•</span>
                  <span className="truncate">Student: {credential.student}</span>
                </div>
              </div>
              <button
                onClick={() => handleSign(credential.tokenId)}
                disabled={signingId === credential.tokenId}
                className="btn-primary flex items-center gap-2 ml-4"
              >
                {signingId === credential.tokenId ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Sign
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        {pendingCredentials.length === 0 && (
          <div className="text-center py-8 card">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pending credentials to validate</p>
          </div>
        )}
      </div>
    </div>
  );
};