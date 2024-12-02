import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ShieldX className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page. Please make sure you're connected with the correct wallet and role.
          </p>
        </div>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;