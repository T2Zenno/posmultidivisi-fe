import React from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dashboard-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-dashboard-accent/30 border-t-dashboard-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dashboard-muted">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <LoginForm onLogin={() => {}} />;
  }

  return <Dashboard />;
};

export default Index;
