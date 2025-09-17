// API Service Layer for GeoProfs Leave Management System

export interface User {
  id: string
  name: string
  email: string
  role: 'employee' | 'manager' | 'hr'
  department: string
  remainingDays: number
  totalDays: number
  startDate: string
  phone?: string
  profilePicture?: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  startDate: string
  endDate: string
  workingDays: number
  leaveType: string
  reason: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
  priority?: 'urgent' | 'high' | 'normal' | 'low'
  remainingBalance?: number
  conflicts?: string[]
}

export interface LeaveBalance {
  userId: string
  totalDays: number
  usedDays: number
  remainingDays: number
  pendingDays: number
  carryOverDays?: number
  accrualRate?: number
  balanceAsOf: string
}

export interface CalendarEvent {
  id: string
  employeeName: string
  startDate: string
  endDate: string
  leaveType: string
  status: 'approved' | 'pending' | 'rejected'
  days: number
}

export interface DashboardStats {
  totalEmployees?: number
  totalMembers?: number
  currentlyOnLeave: number
  pendingApprovals: number
  upcomingLeave: number
  occupancyRate: number
  totalRequests?: number
  approvedRequests?: number
  averageLeavePerEmployee?: number
}

export interface ReportData {
  overviewStats: {
    totalEmployees: number
    totalLeaveRequests: number
    approvedRequests: number
    pendingRequests: number
    averageLeavePerEmployee: number
    currentOccupancy: number
  }
  departmentStats: Array<{
    department: string
    employees: number
    leaveUsage: number
    occupancy: number
  }>
  monthlyTrends: Array<{
    month: string
    requests: number
    approved: number
    rejected: number
  }>
  leaveTypeDistribution: Array<{
    name: string
    value: number
    color: string
  }>
  topUsers: Array<{
    name: string
    department: string
    daysUsed: number
    percentage: number
  }>
}

export interface LeaveType {
  value: string
  label: string
  requiresApproval: boolean
  maxDays?: number
  color?: string
}

export interface Department {
  id: string
  name: string
  description?: string
  managerId?: string
  managerName?: string
  userCount?: number
  isActive: boolean
}

export interface Notification {
  id: string
  message: string
  type: 'approval' | 'info' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Authentication API
  async login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(): Promise<{ success: boolean }> {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
    })
  }

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    return this.request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
    })
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean }> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    })
  }

  // User API
  async getCurrentUser(): Promise<User> {
    return this.request('/users/current')
  }

  async getUserProfile(): Promise<User> {
    return this.request('/users/profile')
  }

  async updateUserProfile(profile: Partial<User>): Promise<{ success: boolean; updatedUser: User }> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    })
  }

  async getAllUsers(params?: { department?: string; role?: string; page?: number; pageSize?: number; searchTerm?: string }): Promise<{ users: User[]; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/users${queryString}`)
  }

  async getUsersByDepartment(departmentId: string): Promise<User[]> {
    return this.request(`/users/department/${departmentId}`)
  }

  async createUser(userData: Omit<User, 'id'>): Promise<{ success: boolean; userId: string }> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<{ success: boolean; updatedUser: User }> {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deactivateUser(userId: string, reason: string): Promise<{ success: boolean }> {
    return this.request(`/users/${userId}/deactivate`, {
      method: 'PUT',
      body: JSON.stringify({ deactivationReason: reason }),
    })
  }

  // Leave Request API
  async createLeaveRequest(requestData: {
    startDate: string
    endDate: string
    leaveType: string
    reason: string
    notes?: string
    isUrgent?: boolean
  }): Promise<{ id: string; status: string; submittedDate: string; workingDays: number }> {
    return this.request('/leave-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  async getUserLeaveRequests(params?: { status?: string; year?: number; page?: number; pageSize?: number }): Promise<{ requests: LeaveRequest[]; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/leave-requests/user${queryString}`)
  }

  async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    return this.request(`/leave-requests/${id}`)
  }

  async updateLeaveRequest(id: string, requestData: Partial<LeaveRequest>): Promise<{ success: boolean; updatedRequest: LeaveRequest }> {
    return this.request(`/leave-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    })
  }

  async deleteLeaveRequest(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/leave-requests/${id}`, {
      method: 'DELETE',
    })
  }

  async getTeamLeaveRequests(params?: { status?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }): Promise<{ requests: LeaveRequest[]; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/leave-requests/team${queryString}`)
  }

  async getAllLeaveRequests(params?: { department?: string; status?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }): Promise<{ requests: LeaveRequest[]; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/leave-requests/all${queryString}`)
  }

  async getConflictingRequests(params: { startDate: string; endDate: string; departmentId?: string; excludeRequestId?: string }): Promise<Array<{ employeeName: string; startDate: string; endDate: string; leaveType: string; overlap: boolean }>> {
    const queryString = '?' + new URLSearchParams(params as any).toString()
    return this.request(`/leave-requests/conflicts${queryString}`)
  }

  // Approval API
  async getPendingApprovals(params?: { department?: string; priority?: string; page?: number; pageSize?: number }): Promise<{ pendingApprovals: LeaveRequest[]; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/approvals/pending${queryString}`)
  }

  async approveLeaveRequest(requestId: string, comment?: string): Promise<{ success: boolean; approvedRequest: LeaveRequest; message: string }> {
    return this.request(`/approvals/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approvalComment: comment, approvedDate: new Date().toISOString() }),
    })
  }

  async rejectLeaveRequest(requestId: string, reason: string, comment?: string): Promise<{ success: boolean; rejectedRequest: LeaveRequest; message: string }> {
    return this.request(`/approvals/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejectionReason: reason, rejectionComment: comment, rejectedDate: new Date().toISOString() }),
    })
  }

  async bulkApproval(requestIds: string[], action: 'Approve' | 'Reject', comment?: string, reason?: string): Promise<{ processedCount: number; successfulIds: string[]; failedIds: string[]; errors: string[] }> {
    return this.request('/approvals/bulk', {
      method: 'POST',
      body: JSON.stringify({ requestIds, action, comment, reason }),
    })
  }

  async getApprovalHistory(params?: { status?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }): Promise<{ approvalHistory: LeaveRequest[]; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/approvals/history${queryString}`)
  }

  // Leave Balance API
  async getUserLeaveBalance(): Promise<LeaveBalance> {
    return this.request('/leave-balance/user')
  }

  async getLeaveBalanceHistory(params?: { year?: number; page?: number; pageSize?: number }): Promise<{ balanceHistory: LeaveBalance[]; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/leave-balance/history${queryString}`)
  }

  async updateLeaveBalance(userId: string, balanceData: { totalDays: number; remainingDays: number; reason: string; effectiveDate: string }): Promise<{ success: boolean; updatedBalance: LeaveBalance }> {
    return this.request(`/leave-balance/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(balanceData),
    })
  }

  async getTeamLeaveBalances(params?: { department?: string; sortBy?: string; sortOrder?: string }): Promise<Array<{ userId: string; userName: string; totalDays: number; usedDays: number; remainingDays: number; department: string }>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/leave-balance/team${queryString}`)
  }

  // Calendar API
  async getTeamCalendar(params?: { month?: number; year?: number; department?: string; includePublicHolidays?: boolean }): Promise<{ calendarEvents: CalendarEvent[]; publicHolidays?: any[] }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/calendar/team${queryString}`)
  }

  async getDepartmentCalendar(departmentId: string, params?: { startDate?: string; endDate?: string }): Promise<{ departmentId: string; calendarEvents: CalendarEvent[]; occupancyRate: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/calendar/department/${departmentId}${queryString}`)
  }

  async getCompanyCalendar(params?: { startDate?: string; endDate?: string; includePublicHolidays?: boolean }): Promise<{ companyEvents: CalendarEvent[]; publicHolidays?: any[]; totalOccupancy: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/calendar/company${queryString}`)
  }

  async getCalendarByDateRange(params: { startDate: string; endDate: string; department?: string; leaveTypes?: string[] }): Promise<CalendarEvent[]> {
    const queryString = '?' + new URLSearchParams(params as any).toString()
    return this.request(`/calendar/date-range${queryString}`)
  }

  async getWorkingDays(params: { startDate: string; endDate: string; excludeHolidays?: boolean; region?: string }): Promise<{ workingDays: number; totalDays: number; excludedHolidays: string[] }> {
    return this.request('/calendar/working-days', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  // Reports API
  async getLeaveUsageReport(params?: { startDate?: string; endDate?: string; department?: string; groupBy?: string }): Promise<{ reportData: any; generatedAt: string }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/reports/leave-usage${queryString}`)
  }

  async getDepartmentReport(params?: { departmentId?: string; year?: number; quarter?: number }): Promise<{ departmentReport: any; metrics: any }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/reports/department${queryString}`)
  }

  async getAbsenteeismReport(params?: { startDate?: string; endDate?: string; department?: string; includeTypes?: string[] }): Promise<{ absenteeismData: any; trendAnalysis: any }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/reports/absenteeism${queryString}`)
  }

  async getLeaveBalanceReport(params?: { department?: string; asOfDate?: string; includeInactive?: boolean }): Promise<{ balanceReport: any[]; summary: any }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/reports/leave-balance${queryString}`)
  }

  async getDashboardMetrics(params?: { timeframe?: string; department?: string }): Promise<DashboardStats> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/reports/dashboard-metrics${queryString}`)
  }

  async getTrendAnalysis(params?: { metricType?: string; timeframe?: string; department?: string; granularity?: string }): Promise<{ trendData: any[]; projections: any[]; insights: string[] }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/reports/trend-analysis${queryString}`)
  }

  async exportReport(reportData: { reportType: string; format: 'Excel' | 'PDF'; filters: any; includeCharts?: boolean }): Promise<{ success: boolean; fileUrl: string; fileName: string; expiresAt: string }> {
    return this.request('/reports/export', {
      method: 'POST',
      body: JSON.stringify(reportData),
    })
  }

  // Notification API
  async getNotifications(params?: { unread?: boolean; type?: string; page?: number; pageSize?: number }): Promise<{ notifications: Notification[]; unreadCount: number; totalCount: number }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/notifications${queryString}`)
  }

  async markNotificationAsRead(notificationId: string): Promise<{ success: boolean }> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    })
  }

  async sendNotification(notificationData: { recipientIds: string[]; subject: string; message: string; type: string; priority?: string }): Promise<{ success: boolean; sentCount: number; failedCount: number }> {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    })
  }

  // Department API
  async getDepartments(params?: { includeInactive?: boolean; includeUserCount?: boolean }): Promise<Department[]> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/departments${queryString}`)
  }

  async getDepartmentById(id: string): Promise<Department> {
    return this.request(`/departments/${id}`)
  }

  async getDepartmentUsers(id: string, params?: { includeInactive?: boolean; role?: string }): Promise<User[]> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/departments/${id}/users${queryString}`)
  }

  // Leave Types API
  async getLeaveTypes(params?: { includeInactive?: boolean; userId?: string }): Promise<LeaveType[]> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/leave-types${queryString}`)
  }

  async getLeaveTypeById(id: string): Promise<LeaveType> {
    return this.request(`/leave-types/${id}`)
  }

  async getUserLeaveTypes(userId: string): Promise<LeaveType[]> {
    return this.request(`/leave-types/user/${userId}`)
  }
}

export const apiService = new ApiService()