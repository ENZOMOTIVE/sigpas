import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './context/WalletContext';
import { IssuerDashboard } from './components/IssuerDashboard';
import StudentCredentials from './components/StudentCredentials';
import { ValidatorDashboard } from './components/ValidatorDashboard';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import { Shield, BookOpen, Award } from 'lucide-react';
import './index.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="max-w-4xl mx-auto text-center py-16">
                  <h1 className="text-5xl font-bold text-gray-900 mb-8">
                    Introducing Multiple Signature Minting{' '}
                    <span className="text-primary">Sigpas</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Adding an extra layer of proof and trust to the NFTs.
                  </p>
                  <div className="grid md:grid-cols-3 gap-8 mt-16">
                    <div className="card">
                      <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Secure</h3>
                      <p className="text-gray-600">Multi-signature verification ensures credential authenticity</p>
                    </div>
                    <div className="card">
                      <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Transparent</h3>
                      <p className="text-gray-600">Immutable blockchain records for complete traceability</p>
                    </div>
                    <div className="card">
                      <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Verifiable</h3>
                      <p className="text-gray-600">Instant verification of academic achievements</p>
                    </div>
                  </div>
                </div>
              } />
              <Route 
                path="/issuer" 
                element={<ProtectedRoute component={IssuerDashboard} allowedRoles={['issuer']} />} 
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
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#059669',
              },
            },
            error: {
              duration: 3000,
              style: {
                background: '#dc2626',
              },
            },
          }}
        />
      </Router>
    </WalletProvider>
  );
}

export default App;

