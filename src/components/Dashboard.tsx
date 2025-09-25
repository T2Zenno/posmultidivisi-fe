import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Deal, DashboardState } from '@/types/dashboard';
import { BackendDeal } from '@/types/api';
import { dashboardAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  calculateKPIs,
  calculateUnitPerformance,
  getNotifications,
  buildTrendData,
  filterDeals,
  exportToCSV,
  getPeriodRange,
  formatDaysUntilDueShort
} from '@/utils/dashboard';

// Components
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardFilters from './dashboard/DashboardFilters';
import KPICards from './dashboard/KPICards';
import TrendChart from './dashboard/TrendChart';
import UnitPerformanceTable from './dashboard/UnitPerformanceTable';
import DealsTable from './dashboard/DealsTable';
import NotificationsPanel from './dashboard/NotificationsPanel';
import AgingPanel from './dashboard/AgingPanel';
import LegendPanel from './dashboard/LegendPanel';
import LoadingToast from './ui/LoadingToast';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [state, setState] = useState<DashboardState>({
    period: 'month',
    unit: 'all',
    search: ''
  });

  // Fetch deals data
  const { data: dealsData, isLoading: dealsLoading, error: dealsError } = useQuery({
    queryKey: ['deals', state.period, state.unit, state.search],
    queryFn: () => dashboardAPI.getDeals({
      period: state.period,
      unit_id: state.unit !== 'all' ? state.unit : undefined,
      search: state.search || undefined,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch KPI data
  const { data: kpisData, isLoading: kpisLoading, error: kpisError } = useQuery({
    queryKey: ['kpis', state.period, state.unit],
    queryFn: () => dashboardAPI.getKPIs(state.period, state.unit !== 'all' ? state.unit : undefined),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch unit performance data
  const { data: unitPerformanceData, isLoading: unitPerformanceLoading } = useQuery({
    queryKey: ['unitPerformance', state.period],
    queryFn: () => dashboardAPI.getUnitPerformance(state.period),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch units data
  const { data: unitsData, isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: () => dashboardAPI.getUnits(),
    staleTime: 10 * 60 * 1000, // 10 minutes - units don't change often
  });

  // Fetch notifications data
  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => dashboardAPI.getNotifications(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch trend data
  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['trends', state.period, state.unit],
    queryFn: () => dashboardAPI.getTrends(state.period, state.unit !== 'all' ? state.unit : undefined),
    staleTime: 5 * 60 * 1000,
  });

  // Transform deals data to match frontend format
  const deals = useMemo(() => {
    if (!dealsData?.data) return [];
    return dealsData.data.map((deal: BackendDeal) => ({
      id: deal.id,
      unit: deal.unit?.name || 'Unknown',
      product: deal.product_name,
      customer: deal.customer_name,
      total: deal.total_amount,
      dp: deal.dp_amount,
      dateDeal: deal.date_deal,
      date_deal_formatted: deal.date_deal_formatted,
      dueDate: deal.due_date,
      due_date_formatted: deal.due_date_formatted,
      status: deal.status,
    }));
  }, [dealsData]);

  // Transform KPI data
  const kpis = useMemo(() => {
    if (!kpisData) {
      return {
        scaledTarget: 0,
        actualCollected: 0,
        progressPct: 0,
        outstanding: 0,
        agingBuckets: [0, 0, 0],
        collectionRate: 0,
      };
    }
    return kpisData;
  }, [kpisData]);

  // Transform unit performance data
  const unitPerformance = useMemo(() => {
    if (!unitPerformanceData) return [];
    return unitPerformanceData;
  }, [unitPerformanceData]);

  // Transform notifications data
  const notifications = useMemo(() => {
    if (!notificationsData) return [];
    return notificationsData.map(notification => ({
      deal: {
        id: notification.deal.id,
        unit: notification.deal.unit?.name || 'Unknown',
        product: notification.deal.product_name,
        customer: notification.deal.customer_name,
        total: notification.deal.total_amount,
        dp: notification.deal.dp_amount,
        dateDeal: notification.deal.date_deal,
        dueDate: notification.deal.due_date,
        status: notification.deal.status,
      },
      daysUntilDue: notification.daysUntilDue,
      daysUntilDueFormatted: formatDaysUntilDueShort(notification.daysUntilDue),
      outstandingAmount: notification.outstandingAmount,
    }));
  }, [notificationsData]);

  // Memoize units from API data
  const units = useMemo(() => {
    if (!unitsData) {
      console.warn('unitsData is undefined or null');
      return [];
    }
    console.log('unitsData:', unitsData);
    const unitNames = unitsData.map(unit => unit.name);
    console.log('units (names):', unitNames);
    return unitNames;
  }, [unitsData]);

  // Memoize period label - only recalculate when period changes
  const periodLabel = useMemo(() => {
    return getPeriodRange(state.period).label;
  }, [state.period]);

  // Use backend-filtered deals directly
  const filteredDeals = useMemo(() => {
    return deals || [];
  }, [deals]);

  // Use useCallback for event handlers to prevent recreation
  const handleStateChange = useCallback((newState: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const handleTogglePaid = useCallback(async (dealId: number) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    let confirmMessage = '';
    let newStatus: Deal['status'];

    if (deal.status === 'paid') {
      confirmMessage = 'Tandai sebagai belum lunas?';
      newStatus = deal.dp > 0 ? 'partial' : 'open';
    } else {
      confirmMessage = 'Tandai sebagai LUNAS (akan dianggap seluruh sisa dibayar)?';
      newStatus = 'paid';
    }

    if (window.confirm(confirmMessage)) {
      try {
        await dashboardAPI.updateDealStatus(dealId, newStatus);
        // Refetch deals data to update the UI
        window.location.reload(); // Simple refresh for now
      } catch (error) {
        console.error('Failed to update deal status:', error);
        alert('Gagal mengupdate status deal. Silakan coba lagi.');
      }
    }
  }, [deals]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(filteredDeals);
  }, [filteredDeals]);

  // Loading state - show dialog instead of full screen
  const isLoading = dealsLoading || kpisLoading;

  // Error state
  if (dealsError || kpisError) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
          <p className="text-dashboard-muted mb-4">
            Gagal memuat data dari server. Pastikan backend API berjalan dengan baik.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-dashboard-accent text-white rounded-lg hover:bg-dashboard-accent/90"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Loading Toast */}
      <LoadingToast open={isLoading} />

      <div className="dashboard-container">
        {/* Header */}
        <DashboardHeader onLogout={logout} />

        {/* Filters */}
        <DashboardFilters
          state={state}
          units={units}
          unitsData={unitsData}
          onStateChange={handleStateChange}
          onExportCSV={handleExportCSV}
        />

        {/* KPI Cards */}
        <KPICards kpis={kpis} isLoading={kpisLoading} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Charts and Tables */}
          <div className="xl:col-span-2 space-y-6">
            {/* Trend Chart */}
            <TrendChart data={trendData || []} periodLabel={periodLabel} />

            {/* Unit Performance Table */}
            <UnitPerformanceTable units={unitPerformance} />

            {/* Deals Table */}
            <DealsTable deals={filteredDeals} onTogglePaid={handleTogglePaid} />
          </div>

          {/* Right Column - Side Panels */}
          <div className="space-y-6">
            {/* Notifications */}
            <NotificationsPanel notifications={notifications} />

            {/* Aging & Metrics */}
            <AgingPanel
              agingBuckets={kpis.agingBuckets}
              collectionRate={kpis.collectionRate}
            />

            {/* Legend & Tips */}
            <LegendPanel />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center text-sm text-dashboard-muted border-t border-border/50">
          Connected to live API data
        </footer>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
