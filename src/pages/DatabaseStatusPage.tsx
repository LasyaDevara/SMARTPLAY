import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Database, Settings, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import DatabaseStatus from '../components/DatabaseStatus';
import { useSupabase } from '../contexts/SupabaseContext';

const DatabaseStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, userProfile } = useSupabase();

  const handleBackToLobby = () => {
    if (userProfile) {
      navigate('/lobby');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <header className="py-4 px-4 md:px-8 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleBackToLobby}
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              
              <div className="ml-4 flex items-center">
                <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
                <span className="text-xl font-bold text-primary-600">SmartPlay</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <DatabaseStatus compact />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Database Connection Status
            </h1>
            <p className="text-xl text-gray-600">
              Monitor your Supabase database connection and troubleshoot issues
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Status Panel */}
            <div className="lg:col-span-2">
              <DatabaseStatus showDetails />
            </div>

            {/* Quick Actions & Info */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    Open Supabase Dashboard
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => window.open('https://supabase.com/docs', '_blank')}
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    View Documentation
                  </Button>
                  
                  <Button
                    variant="accent"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Example:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your_anon_key_here`;
                      
                      navigator.clipboard.writeText(envContent);
                      alert('Environment template copied to clipboard!');
                    }}
                  >
                    Copy .env Template
                  </Button>
                </div>
              </div>

              {/* Connection Guide */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Setup Guide
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Create Supabase Project</div>
                      <div className="text-gray-600">Sign up at supabase.com and create a new project</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Get API Credentials</div>
                      <div className="text-gray-600">Copy URL and anon key from Settings → API</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Update Environment</div>
                      <div className="text-gray-600">Add credentials to your .env file</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Run Migration</div>
                      <div className="text-gray-600">Execute the SQL migration in Supabase</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment Variables */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Environment Check
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_URL</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      import.meta.env.VITE_SUPABASE_URL && 
                      import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {import.meta.env.VITE_SUPABASE_URL && 
                       import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'
                        ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_ANON_KEY</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      import.meta.env.VITE_SUPABASE_ANON_KEY && 
                      import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_anon_key_here'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {import.meta.env.VITE_SUPABASE_ANON_KEY && 
                       import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_anon_key_here'
                        ? 'Set' : 'Missing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DatabaseStatusPage;