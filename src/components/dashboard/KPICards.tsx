import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { KPIData } from '@/types/dashboard';
import { rupiah } from '@/utils/dashboard';
import { TrendingUpIcon, TrendingDownIcon, TargetIcon, WalletIcon, PercentIcon, AlertCircleIcon } from 'lucide-react';

interface KPICardsProps {
  kpis: KPIData;
  isLoading?: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ kpis, isLoading = false }) => {
  const getProgressStatus = (percentage: number) => {
    if (percentage >= 95) return { status: 'success', label: 'On Track', icon: TrendingUpIcon };
    if (percentage >= 85) return { status: 'warning', label: 'At Risk', icon: AlertCircleIcon };
    return { status: 'danger', label: 'Off Track', icon: TrendingDownIcon };
  };

  const progressStatus = getProgressStatus(kpis.progressPct);
  const ProgressIcon = progressStatus.icon;

  const cards = [
    {
      title: 'Total Target',
      value: rupiah(Math.round(kpis.scaledTarget)),
      description: 'Aggregate target untuk periode yang dipilih',
      icon: TargetIcon,
      gradient: 'from-dashboard-accent/10 to-dashboard-accent/5',
      iconColor: 'text-dashboard-accent'
    },
    {
      title: 'Total Aktual',
      value: rupiah(Math.round(kpis.actualCollected)),
      description: 'Total nilai deal (DP + Lunas) dalam periode',
      icon: WalletIcon,
      gradient: 'from-dashboard-success/10 to-dashboard-success/5',
      iconColor: 'text-dashboard-success'
    },
    {
      title: '% Progress',
      value: `${kpis.progressPct}%`,
      description: progressStatus.label,
      icon: ProgressIcon,
      gradient: `from-dashboard-${progressStatus.status}/10 to-dashboard-${progressStatus.status}/5`,
      iconColor: `text-dashboard-${progressStatus.status}`,
      badge: {
        text: progressStatus.label,
        className: `status-${progressStatus.status}`
      }
    },
    {
      title: 'Outstanding',
      value: rupiah(Math.round(kpis.outstanding)),
      description: 'Jumlah sisa yang belum tertagih',
      icon: PercentIcon,
      gradient: 'from-dashboard-warning/10 to-dashboard-warning/5',
      iconColor: 'text-dashboard-warning'
    }
  ];

  // Loading state - show skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className="kpi-card overflow-hidden fade-in bg-gradient-to-br from-gray-100/50 to-gray-50/50 animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`kpi-card overflow-hidden fade-in bg-gradient-to-br ${card.gradient}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 ${card.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {card.badge && (
                    <span className={card.badge.className}>
                      {card.badge.text}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-dashboard-muted">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-xs text-dashboard-muted">
                    {card.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default React.memo(KPICards);