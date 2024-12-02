import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { uploadToPinata } from '../utils/pinata';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';
import { FileCheck, Loader2 } from 'lucide-react';

export const CreateCredential: React.FC = () => {
  const { account } = useWallet();
  const [studentAddress, setStudentAddress] = useState('');
  const [credentialName, setCredentialName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const metadata = {
        name: credentialName,
        description,
        attributes: {
          issueDate: new Date().toISOString(),
          requiredSignatures,
        },
      };

      const metadataURI = await uploadToPinata(metadata);
      const contract = await getContract();
      const tx = await contract.createCredential(
        studentAddress,
        metadataURI,
        requiredSignatures
      );
      await tx.wait();

      toast.success('Credential created successfully!');
      setStudentAddress('');
      setCredentialName('');
      setDescription('');
      setRequiredSignatures(2);
    } catch (error) {
      console.error('Error creating credential:', error);
      toast.error('Failed to create credential');
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Please connect your wallet to create credentials.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Create New Credential</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Address
            </label>
            <input
              type="text"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              className="input-field"
              required
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credential Name
            </label>
            <input
              type="text"
              value={credentialName}
              onChange={(e) => setCredentialName(e.target.value)}
              className="input-field"
              required
              placeholder="Bachelor of Science in Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={4}
              required
              placeholder="Describe the credential and its significance..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Signatures
            </label>
            <input
              type="number"
              value={requiredSignatures}
              onChange={(e) => setRequiredSignatures(Number(e.target.value))}
              min="1"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Credential'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};