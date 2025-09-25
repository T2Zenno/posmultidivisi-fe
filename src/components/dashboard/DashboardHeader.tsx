import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOutIcon, BarChart3Icon } from 'lucide-react';

interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-dashboard-accent to-dashboard-success rounded-xl shadow-lg">
          <BarChart3Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-dashboard-accent to-dashboard-success bg-clip-text text-transparent">
            Dashboard Simple — Sales & Finance Monitoring
          </h1>
          <p className="text-sm text-dashboard-muted mt-1">
            Ringkasan target, progress, DP & outstanding per unit/produk
          </p>
        </div>
      </div>

      <Button
        onClick={onLogout}
        variant="outline"
        size="sm"
        className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        style={{ pointerEvents: 'auto' }}
      >
        <LogOutIcon className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
};

export default DashboardHeader;