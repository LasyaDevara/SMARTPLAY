import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Wifi, WifiOff, CheckCircle, AlertCircle, RefreshCw, Server, Cloud, ExternalLink, Copy } from 'lucide-react';
import Button from './Button';
import { useSupabase } from '../contexts/SupabaseContext';
import supabaseService from '../services/supabaseService';

interface DatabaseStatusProps {
  showDetails?: boolean;
  compact?: boolean;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ 
  showDetails = false, 
  compact = false 
}) => {
  const { isConnected, userProfile } = useSupabase();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);
  const [connectionDetails, setConnectionDetails] = useState({
    supabaseUrl: '',
    hasCredentials: false,
    isLocalhost: false,
    projectRef: '',
    isConfigured: false
  });

  // Check Supabase configuration on mount
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Extract project reference from URL
    const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || '';
    
    const hasValidCredentials = !!(supabaseUrl && supabaseKey && 
      supabaseUrl !== 'https://your-project.supabase.co' && 
      supabaseKey !== 'your_anon_key_here' &&
      supabaseUrl !== 'your_supabase_project_url' &&
      supabaseKey !== 'your_supabase_anon_key');

    setConnectionDetails({
      supabaseUrl: supabaseUrl || 'Not configured',
      hasCredentials: hasValidCredentials,
      isLocalhost: supabaseUrl?.includes('localhost') || false,
      projectRef,
      isConfigured: hasValidCredentials
    });
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await supabaseService.testConnection();
      setLastTestTime(new Date());
      console.log('Connection test result:', result);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const copyEnvTemplate = () => {
    const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Replace with your actual Supabase project credentials:
# 1. Go to https://supabase.com/dashboard
# 2. Select your project
# 3. Go to Settings > API
# 4. Copy the Project URL and anon/public key`;
    
    navigator.clipboard.writeText(envContent);
  };

  // Compact version for header/status bar
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-orange-600" />
        )}
        <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-orange-600'}`}>
          {isConnected ? 'Supabase Connected' : connectionDetails.isConfigured ? 'Connection Issues' : 'Setup Required'}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Database className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-800">Supabase Database</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${
            isConnected ? 'bg-green-400' : 
            connectionDetails.isConfigured ? 'bg-orange-400' : 'bg-red-400'
          }`}></div>
          <span className={`font-bold text-lg ${
            isConnected ? 'text-green-600' : 
            connectionDetails.isConfigured ? 'text-orange-600' : 'text-red-600'
          }`}>
            {isConnected ? 'Connected' : 
             connectionDetails.isConfigured ? 'Connection Issues' : 'Not Configured'}
          </span>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="space-y-4 mb-6">
        {!connectionDetails.isConfigured ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold text-red-700 mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Supabase Not Configured
            </h4>
            <div className="text-red-600 text-sm space-y-2">
              <p>SmartPlay needs Supabase to enable social features like friends, chat, and real-time updates.</p>
              <div className="bg-white rounded-lg p-3 mt-3">
                <p className="font-medium text-red-800 mb-2">Quick Setup:</p>
                <ol className="list-decimal list-inside space-y-1 text-red-700">
                  <li>Create a free account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-800">supabase.com</a></li>
                  <li>Create a new project</li>
                  <li>Go to Settings → API and copy your credentials</li>
                  <li>Update your .env file with the credentials</li>
                  <li>Run the database migration in Supabase SQL editor</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <Cloud className="h-5 w-5 mr-2" />
              Supabase Project Details
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Project Reference:</span>
                <div className="flex items-center">
                  {connectionDetails.projectRef ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {connectionDetails.projectRef || 'Not found'}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database URL:</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {connectionDetails.supabaseUrl.length > 35 
                      ? `${connectionDetails.supabaseUrl.substring(0, 35)}...` 
                      : connectionDetails.supabaseUrl}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Key:</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Configured ✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current User Info */}
        {isConnected && userProfile && (
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-green-700 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Active User Session
            </h4>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-bold">
                  {userProfile.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-green-800">{userProfile.nickname}</div>
                <div className="text-sm text-green-600">Level {userProfile.level} • {userProfile.xp} XP</div>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {isConnected && (
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              All Systems Operational
            </h4>
            <div className="text-green-600 text-sm space-y-1">
              <p>✓ Database connection established</p>
              <p>✓ Real-time subscriptions active</p>
              <p>✓ User authentication working</p>
              <p>✓ All social features available</p>
            </div>
          </div>
        )}

        {/* Connection Issues */}
        {connectionDetails.isConfigured && !isConnected && (
          <div className="bg-orange-50 rounded-xl p-4">
            <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Connection Issues
            </h4>
            <div className="text-orange-600 text-sm space-y-1">
              <p>• Unable to connect to Supabase database</p>
              <p>• Check your internet connection</p>
              <p>• Verify your Supabase project is active</p>
              <p>• Using localStorage fallback for basic features</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3 mb-6">
        {connectionDetails.isConfigured ? (
          <>
            <Button
              variant="secondary"
              onClick={testConnection}
              disabled={isTestingConnection}
              icon={isTestingConnection ? 
                <RefreshCw className="h-4 w-4 animate-spin" /> : 
                <RefreshCw className="h-4 w-4" />
              }
              fullWidth
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {connectionDetails.projectRef && (
              <Button
                variant="primary"
                onClick={() => window.open(`https://supabase.com/dashboard/project/${connectionDetails.projectRef}`, '_blank')}
                icon={<ExternalLink className="h-4 w-4" />}
                fullWidth
              >
                Open Dashboard
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={() => window.open('https://supabase.com', '_blank')}
              icon={<ExternalLink className="h-4 w-4" />}
              fullWidth
            >
              Create Supabase Project
            </Button>
            
            <Button
              variant="secondary"
              onClick={copyEnvTemplate}
              icon={<Copy className="h-4 w-4" />}
              fullWidth
            >
              Copy .env Template
            </Button>
          </>
        )}
      </div>

      {/* Last Test Time */}
      {lastTestTime && (
        <div className="text-center text-sm text-gray-500 mb-6">
          Last tested: {lastTestTime.toLocaleTimeString()}
        </div>
      )}

      {/* Features Status */}
      {showDetails && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-4">Feature Availability</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { 
                name: 'User Profiles', 
                available: true, 
                description: 'Username-based accounts',
                requiresSupabase: false
              },
              { 
                name: 'Game Progress', 
                available: true, 
                description: 'XP, levels, achievements',
                requiresSupabase: false
              },
              { 
                name: 'Friend System', 
                available: isConnected, 
                description: 'Add friends, send requests',
                requiresSupabase: true
              },
              { 
                name: 'Real-time Chat', 
                available: isConnected, 
                description: 'Live messaging in games',
                requiresSupabase: true
              },
              { 
                name: 'Live Notifications', 
                available: isConnected, 
                description: 'Instant friend updates',
                requiresSupabase: true
              },
              { 
                name: 'Online Status', 
                available: isConnected, 
                description: 'See who\'s online',
                requiresSupabase: true
              },
              { 
                name: 'Leaderboards', 
                available: isConnected, 
                description: 'Global rankings',
                requiresSupabase: true
              },
              { 
                name: 'Data Sync', 
                available: isConnected, 
                description: 'Cross-device progress',
                requiresSupabase: true
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {feature.available ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <span className={`font-medium block ${feature.available ? 'text-green-600' : 'text-red-600'}`}>
                    {feature.name}
                  </span>
                  <div className="text-xs text-gray-500 mt-0.5">{feature.description}</div>
                  {!feature.available && feature.requiresSupabase && !connectionDetails.isConfigured && (
                    <div className="text-xs text-orange-600 mt-1">Requires Supabase setup</div>
                  )}
                  {!feature.available && feature.requiresSupabase && connectionDetails.isConfigured && !isConnected && (
                    <div className="text-xs text-orange-600 mt-1">Connection issue</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {!connectionDetails.isConfigured && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> Basic features work offline, but social features require Supabase configuration.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DatabaseStatus;