import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import LobbyPage from './pages/LobbyPage';
import ChatRoomPage from './pages/ChatRoomPage';
import MathManiaPage from './pages/MathManiaPage';
import SpellingBeePage from './pages/SpellingBeePage';
import TalesPage from './pages/TalesPage';
import RhymesPage from './pages/RhymesPage';
import TablesPage from './pages/TablesPage';
import TeamDrawingPage from './pages/TeamDrawingPage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { SupabaseProvider } from './contexts/SupabaseContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isProfileComplete } = useUser();
  
  if (!isProfileComplete || !user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  
  if (user) {
    return <Navigate to="/lobby" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        } />
        <Route path="/auth" element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />
        <Route path="/lobby" element={
          <ProtectedRoute>
            <LobbyPage />
          </ProtectedRoute>
        } />
        <Route path="/chat-room/:roomId" element={
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        } />
        <Route path="/math-mania" element={<MathManiaPage />} />
        <Route path="/spelling-bee" element={<SpellingBeePage />} />
        <Route path="/tales" element={<TalesPage />} />
        <Route path="/rhymes" element={<RhymesPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/team-drawing" element={<TeamDrawingPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <SupabaseProvider>
      <UserProvider>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </UserProvider>
    </SupabaseProvider>
  );
}

export default App;