// Custom hooks for data fetching and state management
import { useState, useEffect, useCallback } from 'react'
import { apiService, User, LeaveRequest, LeaveBalance, CalendarEvent, DashboardStats, ReportData, Department, LeaveType, Notification } from '../services/api'

// Generic hook for async operations with loading states
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFunction()
      setData(result)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, refetch: execute }
}

// Authentication hooks
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.login(email, password)
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      setUser(response.user)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  const getCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const currentUser = await apiService.getCurrentUser()
      setUser(currentUser)
    } catch (err: any) {
      setError(err.message)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getCurrentUser()
  }, [getCurrentUser])

  return { user, loading, error, login, logout, refetchUser: getCurrentUser }
}

// User management hooks
export function useUsers(params?: { department?: string; role?: string; page?: number; pageSize?: number; searchTerm?: string }) {
  return useAsync(() => apiService.getAllUsers(params), false)
}

export function useUsersByDepartment(departmentId: string) {
  return useAsync(() => apiService.getUsersByDepartment(departmentId))
}

// Leave request hooks
export function useLeaveRequests(params?: { status?: string; year?: number; page?: number; pageSize?: number }) {
  return useAsync(() => apiService.getUserLeaveRequests(params))
}

export function useTeamLeaveRequests(params?: { status?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }) {
  return useAsync(() => apiService.getTeamLeaveRequests(params))
}

export function useAllLeaveRequests(params?: { department?: string; status?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }) {
  return useAsync(() => apiService.getAllLeaveRequests(params))
}

export function useLeaveRequest(id: string) {
  return useAsync(() => apiService.getLeaveRequestById(id))
}

export function useConflictingRequests(params: { startDate: string; endDate: string; departmentId?: string; excludeRequestId?: string }) {
  return useAsync(() => apiService.getConflictingRequests(params), false)
}

// Leave request mutations
export function useCreateLeaveRequest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRequest = async (requestData: {
    startDate: string
    endDate: string
    leaveType: string
    reason: string
    notes?: string
    isUrgent?: boolean
  }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.createLeaveRequest(requestData)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createRequest, loading, error }
}

export function useUpdateLeaveRequest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRequest = async (id: string, requestData: Partial<LeaveRequest>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.updateLeaveRequest(id, requestData)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateRequest, loading, error }
}

export function useDeleteLeaveRequest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteRequest = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.deleteLeaveRequest(id)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteRequest, loading, error }
}

// Approval hooks
export function usePendingApprovals(params?: { department?: string; priority?: string; page?: number; pageSize?: number }) {
  return useAsync(() => apiService.getPendingApprovals(params))
}

export function useApprovalHistory(params?: { status?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }) {
  return useAsync(() => apiService.getApprovalHistory(params))
}

export function useApprovalActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approveRequest = async (requestId: string, comment?: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.approveLeaveRequest(requestId, comment)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const rejectRequest = async (requestId: string, reason: string, comment?: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.rejectLeaveRequest(requestId, reason, comment)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const bulkApproval = async (requestIds: string[], action: 'Approve' | 'Reject', comment?: string, reason?: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.bulkApproval(requestIds, action, comment, reason)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { approveRequest, rejectRequest, bulkApproval, loading, error }
}

// Leave balance hooks
export function useLeaveBalance() {
  return useAsync(() => apiService.getUserLeaveBalance())
}

export function useTeamLeaveBalances(params?: { department?: string; sortBy?: string; sortOrder?: string }) {
  return useAsync(() => apiService.getTeamLeaveBalances(params))
}

// Calendar hooks
export function useTeamCalendar(params?: { month?: number; year?: number; department?: string; includePublicHolidays?: boolean }) {
  return useAsync(() => apiService.getTeamCalendar(params))
}

export function useDepartmentCalendar(departmentId: string, params?: { startDate?: string; endDate?: string }) {
  return useAsync(() => apiService.getDepartmentCalendar(departmentId, params))
}

export function useCompanyCalendar(params?: { startDate?: string; endDate?: string; includePublicHolidays?: boolean }) {
  return useAsync(() => apiService.getCompanyCalendar(params))
}

export function useCalendarByDateRange(params: { startDate: string; endDate: string; department?: string; leaveTypes?: string[] }) {
  return useAsync(() => apiService.getCalendarByDateRange(params), false)
}

// Dashboard hooks
export function useDashboardMetrics(params?: { timeframe?: string; department?: string }) {
  return useAsync(() => apiService.getDashboardMetrics(params))
}

// Reports hooks
export function useLeaveUsageReport(params?: { startDate?: string; endDate?: string; department?: string; groupBy?: string }) {
  return useAsync(() => apiService.getLeaveUsageReport(params), false)
}

export function useDepartmentReport(params?: { departmentId?: string; year?: number; quarter?: number }) {
  return useAsync(() => apiService.getDepartmentReport(params), false)
}

export function useAbsenteeismReport(params?: { startDate?: string; endDate?: string; department?: string; includeTypes?: string[] }) {
  return useAsync(() => apiService.getAbsenteeismReport(params), false)
}

export function useLeaveBalanceReport(params?: { department?: string; asOfDate?: string; includeInactive?: boolean }) {
  return useAsync(() => apiService.getLeaveBalanceReport(params), false)
}

export function useTrendAnalysis(params?: { metricType?: string; timeframe?: string; department?: string; granularity?: string }) {
  return useAsync(() => apiService.getTrendAnalysis(params), false)
}

// Notification hooks
export function useNotifications(params?: { unread?: boolean; type?: string; page?: number; pageSize?: number }) {
  return useAsync(() => apiService.getNotifications(params))
}

export function useMarkNotificationAsRead() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const markAsRead = async (notificationId: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.markNotificationAsRead(notificationId)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { markAsRead, loading, error }
}

// Department hooks
export function useDepartments(params?: { includeInactive?: boolean; includeUserCount?: boolean }) {
  return useAsync(() => apiService.getDepartments(params))
}

export function useDepartment(id: string) {
  return useAsync(() => apiService.getDepartmentById(id))
}

export function useDepartmentUsers(id: string, params?: { includeInactive?: boolean; role?: string }) {
  return useAsync(() => apiService.getDepartmentUsers(id, params))
}

// Leave types hooks
export function useLeaveTypes(params?: { includeInactive?: boolean; userId?: string }) {
  return useAsync(() => apiService.getLeaveTypes(params))
}

export function useUserLeaveTypes(userId: string) {
  return useAsync(() => apiService.getUserLeaveTypes(userId))
}

// Working days calculation hook
export function useWorkingDays() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateWorkingDays = async (params: { startDate: string; endDate: string; excludeHolidays?: boolean; region?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.getWorkingDays(params)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { calculateWorkingDays, loading, error }
}