import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut } from 'lucide-react';
import Logo from '../../Assets/main.png'; 

const Navigation: React.FC = () => {
  const { account, role, connecting, connect, disconnect } = useWallet();

  return (
    <nav className="bg-white shadow-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
            <img 
    src={Logo} 
    alt="Your Logo"
    className="inline-block h-12 align-baseline" // Adjust height as needed
  />
            </Link>
            {account && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6 items-center">
                {role === 'student' && (
                  <Link
                    to="/my-credentials"
                    className="text-gray-700 hover:text-primary transition-colors duration-200"
                  >
                    My-Credentials
                  </Link>
                )}
                {role === 'issuer' && (
                  <Link
                  to="/issuer"
                  className="text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </Link>
                )}
                {role === 'validator' && (
                  <Link
                    to="/validator"
                    className="text-gray-700 hover:text-primary transition-colors duration-200"
                  >
                    Dashboard
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
                className="btn-primary flex items-center gap-2"
              >
                <Wallet size={20} />
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </span>
                <span className="text-sm font-medium text-primary capitalize">
                  {role}
                </span>
                <button
                  onClick={disconnect}
                  className="btn-secondary flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Disconnect
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