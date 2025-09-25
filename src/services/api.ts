import { Deal, Target, KPIData, UnitPerformance, NotificationItem, TrendDataPoint } from '@/types/dashboard';
import { BackendDeal, BackendKPIData, BackendUnitPerformance, BackendNotificationItem, BackendTrendDataPoint, LoginRequest, LoginResponse, User } from '@/types/api';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// API Client configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Get auth token from localStorage (except for login requests)
    const isLoginRequest = endpoint === '/login';
    const token = !isLoginRequest ? localStorage.getItem('auth_token') : null;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard API methods
  async getKPIs(period: string = 'month', unitId?: string): Promise<BackendKPIData> {
    const params = new URLSearchParams({ period, ...(unitId && { unit_id: unitId }) });
    const response = await this.request<BackendKPIData>(`/dashboard/kpis?${params}`);
    return response.data;
  }

  async getTrends(period: string = 'month', unitId?: string): Promise<BackendTrendDataPoint[]> {
    const params = new URLSearchParams({ period, ...(unitId && { unit_id: unitId }) });
    const response = await this.request<BackendTrendDataPoint[]>(`/dashboard/trends?${params}`);
    return response.data;
  }

  async getUnitPerformance(period: string = 'month'): Promise<BackendUnitPerformance[]> {
    const params = new URLSearchParams({ period });
    const response = await this.request<BackendUnitPerformance[]>(`/dashboard/unit-performance?${params}`);
    return response.data;
  }

  async getNotifications(): Promise<BackendNotificationItem[]> {
    const response = await this.request<BackendNotificationItem[]>('/dashboard/notifications');
    return response.data;
  }

  async getAgingAnalysis(): Promise<{ [key: string]: { count: number; amount: number } }> {
    const response = await this.request<{ [key: string]: { count: number; amount: number } }>('/dashboard/aging-analysis');
    return response.data;
  }

  async getUnits(): Promise<{ id: number; name: string; description?: string; is_active: boolean }[]> {
    const response = await this.request<{ id: number; name: string; description?: string; is_active: boolean }[]>('/units?active=true');
    console.log('API getUnits response:', response);
    return response.data;
  }

  async getDeals(params: {
    period?: string;
    unit_id?: string;
    status?: string;
    search?: string;
    per_page?: number;
  } = {}): Promise<PaginatedResponse<BackendDeal>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    const response = await this.request<PaginatedResponse<BackendDeal>>(`/deals${query ? `?${query}` : ''}`);
    return response.data;
  }

  async updateDealStatus(dealId: number, status: 'open' | 'partial' | 'paid'): Promise<BackendDeal> {
    const response = await this.request<BackendDeal>(`/deals/${dealId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.request('/logout', {
      method: 'POST',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const dashboardAPI = {
  getKPIs: (period?: string, unitId?: string) => apiClient.getKPIs(period, unitId),
  getTrends: (period?: string, unitId?: string) => apiClient.getTrends(period, unitId),
  getUnitPerformance: (period?: string) => apiClient.getUnitPerformance(period),
  getNotifications: () => apiClient.getNotifications(),
  getAgingAnalysis: () => apiClient.getAgingAnalysis(),
  getUnits: () => apiClient.getUnits(),
  getDeals: (params?: {
    period?: string;
    unit_id?: string;
    status?: string;
    search?: string;
    per_page?: number;
  }) => apiClient.getDeals(params),
  updateDealStatus: (dealId: number, status: 'open' | 'partial' | 'paid') => apiClient.updateDealStatus(dealId, status),
};

// Export authentication functions
export const authAPI = {
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
};
