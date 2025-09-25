export interface Deal {
  id: number;
  unit: string;
  product: string;
  customer: string;
  total: number;
  dp: number;
  dateDeal: string;
  date_deal_formatted?: string;
  dueDate: string;
  due_date_formatted?: string;
  days_until_due_formatted?: string;
  status: 'open' | 'partial' | 'paid';
}

export interface Target {
  [unit: string]: number;
}

export interface KPIData {
  scaledTarget: number;
  actualCollected: number;
  progressPct: number;
  outstanding: number;
  agingBuckets: number[];
  collectionRate: number;
}

export interface UnitPerformance {
  unit: string;
  target: number;
  actual: number;
  percentage: number;
  status: 'on' | 'risk' | 'off';
}

export interface NotificationItem {
  deal: Deal;
  daysUntilDue: number;
  daysUntilDueFormatted: string;
  outstandingAmount: number;
}

export type Period = 'day' | 'week' | 'month' | '3m' | '6m' | '1y';

export interface DashboardState {
  period: Period;
  unit: string;
  search: string;
}

export interface TrendDataPoint {
  label: string;
  value: number;
}