import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navigation: React.FC = () => {
  const { account, role, connecting, connect, disconnect } = useWallet();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                EduChain
              </Link>
            </div>
            {account && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {role === 'student' && (
                  <Link
                    to="/my-credentials"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    My Credentials
                  </Link>
                )}
                {role === 'issuer' && (
                  <Link
                    to="/create"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Create Credential
                  </Link>
                )}
                {role === 'validator' && (
                  <Link
                    to="/validator"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Validator Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {!account ? (
              <button
                onClick={connect}
                disabled={connecting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`} ({role})
                </span>
                <button
                  onClick={disconnect}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

