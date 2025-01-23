import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './context/WalletContext'
import { IssuerDashboard } from './components/IssuerDashboard'
import StudentCredentials from './components/StudentCredentials'
import { ValidatorDashboard } from './components/ValidatorDashboard'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './components/Unauthorized'
import { Shield, BookOpen, Award, ArrowRight } from 'lucide-react'
import { AnimatedBackground } from './components/ui/animated-background'
import { FunMintingViz } from './components/fun-minting-viz'
import { motion } from 'framer-motion'
import {Footer} from './components/Footer';
import './index.css'

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    <div className="relative">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
)

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="relative min-h-screen bg-gray-50">
          <AnimatedBackground />
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="mx-auto max-w-6xl py-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <h1 className="mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-6xl font-bold text-transparent">
                      Introducing Multiple Signature Minting{' '}
                      <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                        Sigpas
                      </span>
                    </h1>
                    <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
                      Adding an extra layer of proof and trust to the NFTs.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group mb-16 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-lg font-medium text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
                    >
                      Get Started
                      <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid gap-8 md:grid-cols-3"
                  >
                    <FeatureCard
                      icon={Shield}
                      title="Secure"
                      description="Multi-signature verification ensures credential authenticity"
                    />
                    <FeatureCard
                      icon={BookOpen}
                      title="Cheaper"
                      description="A layer 3 blockchain, Educhain is used"
                    />
                    <FeatureCard
                      icon={Award}
                      title="Verifiable"
                      description="Instant verification of academic achievements"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-24"
                  >
                    <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
                      Watch NFTs Being Minted
                    </h2>
                    <div className="mx-auto max-w-4xl">
                      <FunMintingViz />
                    </div>
                  </motion.div>
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
          <Footer />
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



  )
}

export default App

