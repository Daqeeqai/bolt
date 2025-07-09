import React, { useEffect } from 'react';
import { useAppStore } from './lib/store';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  const { user, profile, activeView, loading } = useAppStore();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#ED1C24] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if user is not authenticated
  if (!user || !profile) {
    return <LoginForm />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'conversations':
        return <div className="p-8 text-center text-gray-600">AI Conversations View (Coming Soon)</div>;
      case 'travelers':
        return <div className="p-8 text-center text-gray-600">Traveler Management View (Coming Soon)</div>;
      case 'training':
        return <div className="p-8 text-center text-gray-600">AI Training View (Coming Soon)</div>;
      case 'analytics':
        return <div className="p-8 text-center text-gray-600">Analytics View (Coming Soon)</div>;
      case 'settings':
        return <div className="p-8 text-center text-gray-600">Settings View (Coming Soon)</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderView()}
    </DashboardLayout>
  );
}

export default App;