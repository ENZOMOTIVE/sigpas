import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';
import { Award, Clock, CheckCircle, FileText, Car, Laptop, Trophy } from 'lucide-react';


interface Credential {
  tokenId: string;
  isValid: boolean;
  signatureCount: number;
  metadata: {
    name: string;
    description: string;
    attributes: {
      issueDate: string;
      template: string;
    };
  };
}

const CredentialTemplate: React.FC<{ credential: Credential }> = ({ credential }) => {
  const { metadata, isValid, signatureCount } = credential;
  const { name, description, attributes } = metadata;
  const { issueDate, template } = attributes;

  const getTemplateStyles = () => {
    switch (template) {
      case 'academic':
        return 'bg-blue-50 border-blue-200';
      case 'license':
        return 'bg-green-50 border-green-200';
      case 'course':
        return 'bg-purple-50 border-purple-200';
      case 'award':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTemplateIcon = () => {
    switch (template) {
      case 'academic':
        return <FileText className="w-12 h-12 text-blue-500" />;
      case 'license':
        return <Car className="w-12 h-12 text-green-500" />;
      case 'course':
        return <Laptop className="w-12 h-12 text-purple-500" />;
      case 'award':
        return <Trophy className="w-12 h-12 text-yellow-500" />;
      default:
        return <Award className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div className={`card ${getTemplateStyles()} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {getTemplateIcon()}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isValid 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isValid ? (
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
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
        <span>Issue Date: {new Date(issueDate).toLocaleDateString()}</span>
        <span>Signatures: {signatureCount}</span>
      </div>
    </div>
  );
};

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
          <CredentialTemplate key={credential.tokenId} credential={credential} />
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

