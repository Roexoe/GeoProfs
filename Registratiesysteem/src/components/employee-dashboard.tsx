import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { useLeaveBalance, useLeaveRequests, useTeamCalendar } from '../hooks/useApi'
import { User } from '../services/api'

interface EmployeeDashboardProps {
  user: User
}

export function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const { data: leaveBalance, loading: balanceLoading, error: balanceError } = useLeaveBalance()
  const { data: requestsData, loading: requestsLoading, error: requestsError } = useLeaveRequests({ 
    page: 1, 
    pageSize: 5 
  })
  const { data: calendarData, loading: calendarLoading, error: calendarError } = useTeamCalendar({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    department: user.department
  })

  // Loading state
  if (balanceLoading || requestsLoading || calendarLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const leaveStats = leaveBalance || {
    totalDays: user.totalDays || 25,
    usedDays: 0,
    remainingDays: user.remainingDays,
    pendingDays: 0
  }

  const recentRequests = requestsData?.requests?.slice(0, 5) || []
  const upcomingLeave = calendarData?.calendarEvents?.slice(0, 5) || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'approved': 'default',
      'rejected': 'destructive',
      'pending': 'secondary'
    }
    return variants[status] || 'outline'
  }

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'Goedgekeurd'
      case 'rejected':
        return 'Afgewezen'
      case 'pending':
        return 'In behandeling'
      case 'cancelled':
        return 'Geannuleerd'
      default:
        return status
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Welkom terug, {user.name.split(' ')[0]}!</h2>
        <p className="text-muted-foreground">
          Hier is een overzicht van je verlofstatus en recente activiteiten.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Verlofdagen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveStats.totalDays}</div>
            <p className="text-xs text-muted-foreground">Dit kalenderjaar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opgenomen</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveStats.usedDays}</div>
            <p className="text-xs text-muted-foreground">Dagen gebruikt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beschikbaar</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveStats.remainingDays}</div>
            <p className="text-xs text-muted-foreground">Dagen over</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Behandeling</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveStats.pendingDays}</div>
            <p className="text-xs text-muted-foreground">Dagen aangevraagd</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Verlofgebruik dit jaar</CardTitle>
          <CardDescription>
            {leaveStats.usedDays} van {leaveStats.totalDays} dagen gebruikt ({Math.round((leaveStats.usedDays / leaveStats.totalDays) * 100)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(leaveStats.usedDays / leaveStats.totalDays) * 100} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recente Verlofaanvragen</CardTitle>
            <CardDescription>Je laatste verlofaanvragen en hun status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(request.status)}
                      <span className="font-medium">
                        {request.startDate} - {request.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.reason} • {request.workingDays} dagen</p>
                  </div>
                  <Badge variant={getStatusBadge(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Alle aanvragen bekijken
            </Button>
          </CardContent>
        </Card>

        {/* Team Leave */}
        <Card>
          <CardHeader>
            <CardTitle>Aankomend Teamverlof</CardTitle>
            <CardDescription>Collega's die binnenkort afwezig zijn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLeave.map((leave, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{leave.employeeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {leave.startDate} - {leave.endDate} • {leave.days} dagen
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {leave.employeeName.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Volledige teamkalender
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte functies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <Calendar className="w-6 h-6" />
              Nieuwe verlofaanvraag
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CheckCircle className="w-6 h-6" />
              Status controleren
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Clock className="w-6 h-6" />
              Teamkalender bekijken
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}