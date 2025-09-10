import { Users, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Avatar, AvatarFallback } from './ui/avatar'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  remainingDays: number
}

interface ManagerDashboardProps {
  user: User
}

export function ManagerDashboard({ user }: ManagerDashboardProps) {
  // Mock data - would come from API
  const teamStats = {
    totalMembers: 12,
    currentlyOnLeave: 2,
    pendingApprovals: 4,
    upcomingLeave: 6,
    occupancyRate: 83
  }

  const pendingApprovals = [
    {
      id: '1',
      employeeName: 'Maria Jansen',
      startDate: '2024-03-25',
      endDate: '2024-03-29',
      days: 5,
      reason: 'Vakantie',
      submitted: '2024-03-10',
      priority: 'normal'
    },
    {
      id: '2',
      employeeName: 'Pieter de Vries',
      startDate: '2024-03-20',
      endDate: '2024-03-20',
      days: 1,
      reason: 'Persoonlijk',
      submitted: '2024-03-11',
      priority: 'urgent'
    },
    {
      id: '3',
      employeeName: 'Anna van der Meer',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      days: 5,
      reason: 'Vakantie',
      submitted: '2024-03-08',
      priority: 'normal'
    }
  ]

  const currentAbsences = [
    {
      name: 'Jan Willems',
      reason: 'Ziekte',
      returnDate: '2024-03-15',
      days: 3
    },
    {
      name: 'Lisa Bakker',
      reason: 'Vakantie',
      returnDate: '2024-03-18',
      days: 5
    }
  ]

  const departmentOccupancy = [
    { department: 'Landmeetkunde', occupied: 10, total: 12, percentage: 83 },
    { department: 'GIS', occupied: 7, total: 8, percentage: 88 },
    { department: 'Projectmanagement', occupied: 4, total: 5, percentage: 80 },
    { department: 'Administratie', occupied: 6, total: 7, percentage: 86 }
  ]

  const upcomingEvents = [
    {
      type: 'leave_start',
      employee: 'Maria Jansen',
      date: '2024-03-20',
      details: '5 dagen vakantie'
    },
    {
      type: 'leave_end',
      employee: 'Jan Willems',
      date: '2024-03-15',
      details: 'Terugkeer van ziekteverlof'
    },
    {
      type: 'approval_needed',
      employee: 'Pieter de Vries',
      date: '2024-03-20',
      details: 'Urgente goedkeuring vereist'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Manager Dashboard</h2>
        <p className="text-muted-foreground">
          Overzicht van teamverlof, goedkeuringen en bezettingsgraad voor {user.department}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Leden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">Actieve medewerkers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Momenteel Afwezig</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.currentlyOnLeave}</div>
            <p className="text-xs text-muted-foreground">Medewerkers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Te Goedkeuren</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Aanvragen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aankomend Verlof</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.upcomingLeave}</div>
            <p className="text-xs text-muted-foreground">Deze maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bezettingsgraad</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Momenteel aanwezig</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Verlofaanvragen ter Goedkeuring</CardTitle>
              <CardDescription>Aanvragen die jouw goedkeuring nodig hebben</CardDescription>
            </div>
            <Badge variant="secondary">{pendingApprovals.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.startDate} - {request.endDate} ({request.days} dagen)
                        </p>
                      </div>
                    </div>
                    {request.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reden: {request.reason} • Ingediend: {request.submitted}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Goedkeuren
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      Afwijzen
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Alle goedkeuringen bekijken
            </Button>
          </CardContent>
        </Card>

        {/* Current Absences */}
        <Card>
          <CardHeader>
            <CardTitle>Huidige Afwezigheden</CardTitle>
            <CardDescription>Medewerkers die momenteel afwezig zijn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentAbsences.map((absence, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {absence.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{absence.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {absence.reason} • Terug: {absence.returnDate}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{absence.days} dagen</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Occupancy */}
      <Card>
        <CardHeader>
          <CardTitle>Afdelingsbezetting</CardTitle>
          <CardDescription>Bezettingsgraad per afdeling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentOccupancy.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <span className="text-sm text-muted-foreground">
                    {dept.occupied}/{dept.total} ({dept.percentage}%)
                  </span>
                </div>
                <Progress value={dept.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Aankomende Gebeurtenissen</CardTitle>
          <CardDescription>Belangrijke datums en deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="flex-1">
                  <p className="font-medium">{event.employee}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.date} • {event.details}
                  </p>
                </div>
                {event.type === 'approval_needed' && (
                  <Badge variant="destructive" className="text-xs">Actie vereist</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}