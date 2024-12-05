import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut } from 'lucide-react';
import Logo from '../../Assets/main.png'; 

const Navigation: React.FC = () => {
  const { account, role, connecting, connect, disconnect } = useWallet();

  return (
    <nav className="bg-white shadow-custom" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center" aria-label="Go to homepage">
              <img 
                src={Logo} 
                alt="Sigpas Logo"
                className="inline-block h-12 w-auto"
              />
            </Link>
            {account && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6 items-center">
                {role === 'student' && (
                  <Link
                    to="/my-credentials"
                    className="text-gray-700 hover:text-primary transition-colors duration-200"
                  >
                    My Credentials
                  </Link>
                )}
                {(role === 'issuer' || role === 'validator') && (
                  <Link
                    to={`/${role}`}
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
                aria-label={connecting ? 'Connecting wallet' : 'Connect wallet'}
              >
                <Wallet size={20} aria-hidden="true" />
                <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full" aria-label="Wallet address">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </span>
                <span className="text-sm font-medium text-primary capitalize" aria-label="User role">
                  {role}
                </span>
                <button
                  onClick={disconnect}
                  className="btn-secondary flex items-center gap-2"
                  aria-label="Disconnect wallet"
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>Disconnect</span>
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

