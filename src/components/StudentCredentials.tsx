import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';
import { Award, Clock, Search } from 'lucide-react';
import CredentialCard from '../components/CredentialCard';

interface Credential {
  tokenId: string;
  isValid: boolean;
  signatureCount: number;
  requiredSignatures: number;
  student: string;
  metadata: {
    name: string;
    description: string;
    attributes: {
      issueDate: string;
      template: string;
    };
  };
}


const StudentCredentials: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCredentials = credentials.filter(credential =>
    credential.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.metadata.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Clock className="w-6 h-6 text-orange-500 animate-spin" />
        <span className="ml-2 text-xl text-gray-600">Loading credentials...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Credentials</h2>
        <p className="text-gray-600">Manage and view your educational achievements and certifications.</p>
      </motion.div>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="text-sm text-gray-500">
          Total Credentials: {credentials.length}
        </div>
      </div>

      {filteredCredentials.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredCredentials.map((credential) => (
            <CredentialCard key={credential.tokenId} credential={credential} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 bg-orange-50 rounded-lg"
        >
          <Award className="w-16 h-16 text-orange-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No credentials found</p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start earning credentials to see them here!'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentCredentials;

