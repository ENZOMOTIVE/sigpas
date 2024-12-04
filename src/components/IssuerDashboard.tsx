import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';
import { FileCheck, Clock, Search, Plus, Filter } from 'lucide-react';
import { CreateCredential } from './CreateCredential';
import CredentialCard from './CredentialCard';

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
  student: string;
  requiredSignatures: number;
}

export const IssuerDashboard: React.FC = () => {
  const [issuedCredentials, setIssuedCredentials] = useState<Credential[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');
  const { account } = useWallet();

  const handleCreateSuccess = (newCredential: Credential) => {
    setIssuedCredentials(prev => [
      {
        ...newCredential,
        tokenId: `temp-${Date.now()}`, // Temporary ID
        isValid: false,
        signatureCount: 0,
        requiredSignatures: newCredential.requiredSignatures || 2,
      },
      ...prev
    ]);
    setShowCreateForm(false);
    toast.success('Credential created successfully!');
  };

  const filteredCredentials = issuedCredentials.filter(credential =>
    (credential.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.metadata.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'all' || (filter === 'pending' && !credential.isValid) || (filter === 'validated' && credential.isValid))
  );


  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Please connect your wallet to access the issuer dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-gray-900 mb-8"
      >
        Start the Mint....
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        {showCreateForm ? (
          <>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create New Credential</h3>
            <CreateCredential onSuccess={handleCreateSuccess} />
            <button 
              onClick={() => setShowCreateForm(false)}
              className="mt-4 btn-secondary"
            >
              Cancel
            </button>
          </>
        ) : (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Plus className="w-5 h-5" />
            Create New Credential
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Issued Credentials</h3>
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'validated')}
                className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="validated">Validated</option>
              </select>
              <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <div className="text-sm text-gray-500">
              Total Issued: {issuedCredentials.length}
            </div>
          </div>
        </div>

        {filteredCredentials.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredCredentials.map((credential) => (
                <motion.div
                  key={credential.tokenId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <CredentialCard credential={credential} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-orange-50 rounded-lg"
          >
            <FileCheck className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No credentials found</p>
            <p className="text-gray-500 mt-2">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start issuing credentials to see them here!'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IssuerDashboard;

