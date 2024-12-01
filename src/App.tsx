import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './context/WalletContext';
import { CreateCredential } from './components/CreateCredential';
import { StudentCredentials } from './components/StudentCredentials';
import { ValidatorDashboard } from './components/ValidatorDashboard';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import './index.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-8">
                  Introducing Multisignature NFTs
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A 2 Layered Security Protocol for Sharing NFTs.
                  </p>
                </div>
              } />
              <Route 
                path="/create" 
                element={<ProtectedRoute component={CreateCredential} allowedRoles={['issuer']} />} 
              />
              <Route 
                path="/my-credentials" 
                element={<ProtectedRoute component={StudentCredentials} allowedRoles={['student']} />} 
              />
              <Route 
                path="/validator" 
                element={<ProtectedRoute component={ValidatorDashboard} allowedRoles={['validator']} />} 
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </Router>
    </WalletProvider>
  );
}

export default App;

