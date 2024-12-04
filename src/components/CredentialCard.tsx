import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Award, FileText, Car, Laptop, Trophy } from 'lucide-react';

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

const CredentialCard: React.FC<{ credential: Credential }> = ({ credential }) => {
  const { metadata, isValid, signatureCount } = credential;
  const { name, description, attributes } = metadata;
  const { issueDate, template } = attributes;

  const getTemplateStyles = () => {
    switch (template) {
      case 'academic':
        return 'from-orange-100 to-orange-200 border-orange-300';
      case 'license':
        return 'from-amber-100 to-amber-200 border-amber-300';
      case 'course':
        return 'from-yellow-100 to-yellow-200 border-yellow-300';
      case 'award':
        return 'from-orange-200 to-orange-300 border-orange-400';
      default:
        return 'from-gray-100 to-gray-200 border-gray-300';
    }
  };

  const getTemplateIcon = () => {
    switch (template) {
      case 'academic':
        return <FileText className="w-12 h-12 text-orange-500" />;
      case 'license':
        return <Car className="w-12 h-12 text-amber-500" />;
      case 'course':
        return <Laptop className="w-12 h-12 text-yellow-500" />;
      case 'award':
        return <Trophy className="w-12 h-12 text-orange-500" />;
      default:
        return <Award className="w-12 h-12 text-gray-500" />;
    }
  };

  const getBackgroundImage = () => {
    switch (template) {
      case 'academic':
        return "url('/images/academic-bg.jpg')";
      case 'license':
        return "url('/images/license-bg.jpg')";
      case 'course':
        return "url('/images/course-bg.jpg')";
      case 'award':
        return "url('/images/award-bg.jpg')";
      default:
        return "url('/images/default-bg.jpg')";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-lg shadow-lg border-2 ${getTemplateStyles()}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-15"
        style={{ backgroundImage: getBackgroundImage() }}
      />
      <div className="relative z-10 p-6 bg-gradient-to-br ${getTemplateStyles()}">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {getTemplateIcon()}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-700 mt-1">{description}</p>
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
        <div className="mt-4 pt-4 border-t border-orange-200 flex justify-between items-center text-sm text-gray-700">
          <span>Issue Date: {new Date(issueDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-500" />
            Signatures: {signatureCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CredentialCard;

