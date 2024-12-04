import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FileCheck, Loader2 } from 'lucide-react';

const credentialOptions = [
  { value: 'btech', label: 'B.Tech Certificate', template: 'academic' },
  { value: 'mtech', label: 'M.Tech Certificate', template: 'academic' },
  { value: 'driving', label: 'Driving License', template: 'license' },
  { value: 'course', label: 'Online Course Certificate', template: 'course' },
  { value: 'achievement', label: 'Achievement Award', template: 'award' },
];

interface CreateCredentialProps {
  onSuccess: (newCredential: any) => void;
}

interface Credential {
  tokenId: string;
  isValid: boolean;
  signatureCount: number;
  requiredSignatures: number;
  metadata: {
    name: string;
    description: string;
    attributes: {
      issueDate: string;
      template: string;
    };
  };
  student: string;
}

export const CreateCredential: React.FC<CreateCredentialProps> = ({ onSuccess }) => {
 
  const [studentAddress, setStudentAddress] = useState('');
  const [credentialType, setCredentialType] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedCredential = credentialOptions.find(option => option.value === credentialType);
      if (!selectedCredential) {
        throw new Error('Invalid credential type');
      }

      const newCredential: Credential = {
        tokenId: '', // This will be set in the IssuerDashboard
        isValid: false,
        signatureCount: 0,
        requiredSignatures,
        metadata: {
          name: selectedCredential.label,
          description,
          attributes: {
            issueDate: new Date().toISOString(),
            template: selectedCredential.template,
          },
        },
        student: studentAddress,
      };

      onSuccess(newCredential);

      setStudentAddress('');
      setCredentialType('');
      setDescription('');
      setRequiredSignatures(2);
    } catch (error) {
      console.error('Error creating credential:', error);
      toast.error('Failed to create credential');
    } finally {
      setIsLoading(false);
    }
  };

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
              Credential Type
            </label>
            <select
              value={credentialType}
              onChange={(e) => setCredentialType(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a credential type</option>
              {credentialOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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

