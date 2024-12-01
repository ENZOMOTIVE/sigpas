import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { uploadToPinata } from '../utils/pinata';
import { getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';

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
      // Create metadata
      const metadata = {
        name: credentialName,
        description,
        attributes: {
          issueDate: new Date().toISOString(),
          requiredSignatures,
        },
      };

      // Upload to Pinata
      const metadataURI = await uploadToPinata(metadata);
      
      // Get contract instance
      const contract = await getContract();

      // Create credential on blockchain
      const tx = await contract.createCredential(
        studentAddress,
        metadataURI,
        requiredSignatures
      );
      await tx.wait();

      toast.success('Credential created successfully!');

      // Reset form
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Credential</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student Address
          </label>
          <input
            type="text"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credential Name
          </label>
          <input
            type="text"
            value={credentialName}
            onChange={(e) => setCredentialName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Required Signatures
          </label>
          <input
            type="number"
            value={requiredSignatures}
            onChange={(e) => setRequiredSignatures(Number(e.target.value))}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Creating...' : 'Create Credential'}
        </button>
      </form>
    </div>
  );
};