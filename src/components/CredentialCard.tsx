import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Award, FileText, Car, Laptop, Trophy, User, ChevronDown, ChevronUp, Calendar, FilePenLineIcon as Signature, Hash } from 'lucide-react';
import '../components/credential.css';

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

const CredentialCard: React.FC<{ credential: Credential }> = ({ credential }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { tokenId, metadata, isValid, signatureCount, requiredSignatures, student } = credential;
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
      className={`relative overflow-hidden rounded-lg card-shadow ${getTemplateStyles()}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-15"
        style={{ backgroundImage: getBackgroundImage() }}
      />
      <div className={`relative z-10 p-6 bg-gradient-to-br ${getTemplateStyles()}`}>
        <div className="ribbon bg-primary text-white">
          {isValid ? 'Validated' : 'Pending'}
        </div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="animate-float"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {getTemplateIcon()}
            </motion.div>
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
        <div className="mt-4 pt-4 border-t border-orange-200 flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Issue Date: {new Date(issueDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Signature className="w-4 h-4 text-orange-500" />
              Signatures: {signatureCount} / {requiredSignatures}
            </span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <User className="w-4 h-4 text-orange-500" />
            Student: {student}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-5 h-5" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              Show More
            </>
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-orange-200"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Additional Details</h4>
                <p className="text-sm text-gray-700">
                  This credential represents a significant achievement in the field of {template}.
                  It has been issued through a secure, blockchain-based system ensuring its authenticity and immutability.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Hash className="w-4 h-4 text-orange-500" />
                  Token ID: {tokenId}
                </div>
                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200">
                          Validation Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-orange-600">
                          {Math.round((signatureCount / requiredSignatures) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-200">
                      <div
                        style={{ width: `${(signatureCount / requiredSignatures) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-primary animate-shimmer"></div>
    </motion.div>
  );
};

export default CredentialCard;
