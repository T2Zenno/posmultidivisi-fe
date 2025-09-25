// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Authentication types
export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Backend Deal type (matches Laravel response)
export interface BackendDeal {
  id: number;
  unit_id: number;
  unit: {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  product_name: string;
  customer_name: string;
  total_amount: number;
  dp_amount: number;
  date_deal: string;
  date_deal_formatted?: string;
  due_date: string;
  due_date_formatted?: string;
  status: 'open' | 'partial' | 'paid';
  outstanding: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  payments?: Array<{
    id: number;
    deal_id: number;
    amount: number;
    payment_date: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  }>;
}

// Backend Target type
export interface BackendTarget {
  id: number;
  unit_id: number;
  unit: {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  target_amount: number;
  period_type: string;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

// Backend Unit type
export interface BackendUnit {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Backend KPI response
export interface BackendKPIData {
  scaledTarget: number;
  actualCollected: number;
  progressPct: number;
  outstanding: number;
  agingBuckets: number[];
  collectionRate: number;
}

// Backend Unit Performance response
export interface BackendUnitPerformance {
  unit: string;
  target: number;
  actual: number;
  percentage: number;
  status: 'on' | 'risk' | 'off';
}

// Backend Notification response
export interface BackendNotificationItem {
  deal: BackendDeal;
  daysUntilDue: number;
  outstandingAmount: number;
}

// Backend Trend response
export interface BackendTrendDataPoint {
  label: string;
  value: number;
}

// Backend Aging Analysis response
export interface BackendAgingData {
  [key: string]: {
    count: number;
    amount: number;
  };
}
