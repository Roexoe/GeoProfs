import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  remainingDays: number
}

interface TeamCalendarProps {
  user: User
}

interface LeaveEvent {
  id: string
  employeeName: string
  startDate: string
  endDate: string
  leaveType: string
  status: 'approved' | 'pending' | 'rejected'
  days: number
}

export function TeamCalendar({ user }: TeamCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<'month' | 'week' | 'list'>('month')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Mock data - would come from API
  const leaveEvents: LeaveEvent[] = [
    {
      id: '1',
      employeeName: 'Max van Rooijen',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      leaveType: 'vacation',
      status: 'approved',
      days: 3
    },
    {
      id: '2',
      employeeName: 'Jay Schuurman',
      startDate: '2024-03-20',
      endDate: '2024-03-22',
      leaveType: 'personal',
      status: 'approved',
      days: 3
    },
    {
      id: '3',
      employeeName: 'Mees van Aalten',
      startDate: '2024-03-25',
      endDate: '2024-03-29',
      leaveType: 'vacation',
      status: 'pending',
      days: 5
    },
    {
      id: '4',
      employeeName: 'Claassen',
      startDate: '2024-03-12',
      endDate: '2024-03-14',
      leaveType: 'sick',
      status: 'approved',
      days: 3
    },
    {
      id: '5',
      employeeName: 'Jochem Bosch',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      leaveType: 'vacation',
      status: 'approved',
      days: 5
    }
  ]

  const departments = [
    { value: 'all', label: 'Alle Afdelingen' },
    { value: 'landmeetkunde', label: 'Landmeetkunde' },
    { value: 'gis', label: 'GIS' },
    { value: 'projectmanagement', label: 'Projectmanagement' },
    { value: 'administratie', label: 'Administratie' }
  ]

  const getLeaveTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      vacation: 'bg-blue-500',
      personal: 'bg-green-500',
      sick: 'bg-red-500',
      maternity: 'bg-purple-500',
      training: 'bg-orange-500',
      other: 'bg-gray-500'
    }
    return colors[type] || colors.other
  }

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vacation: 'Vakantie',
      personal: 'Persoonlijk',
      sick: 'Ziekte',
      maternity: 'Zwangerschap',
      training: 'Training',
      other: 'Overig'
    }
    return labels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive'
    }
    return variants[status] || 'outline'
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
  }

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startOfCalendar = new Date(startOfMonth)
    startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay())
    
    const days = []
    const currentDateCalendar = new Date(startOfCalendar)
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      days.push(new Date(currentDateCalendar))
      currentDateCalendar.setDate(currentDateCalendar.getDate() + 1)
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return leaveEvents.filter(event => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      return date >= startDate && date <= endDate
    })
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Team Kalender</h2>
        <p className="text-muted-foreground">
          Overzicht van verlof en afwezigheid binnen je team
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-medium min-w-48 text-center">
              {formatMonth(currentDate)}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Vandaag
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'month' | 'week' | 'list')}>
            <TabsList>
              <TabsTrigger value="month">Maand</TabsTrigger>
              <TabsTrigger value="list">Lijst</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={viewType} className="space-y-4">
        {/* Month View */}
        <TabsContent value="month">
          <Card>
            <CardContent className="p-0">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 border-b">
                {weekDays.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                  const isToday = day.toDateString() === new Date().toDateString()
                  const events = getEventsForDate(day)

                  return (
                    <div
                      key={index}
                      className={`min-h-32 p-2 border-r border-b last:border-r-0 ${
                        !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : ''
                      } ${isToday ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`text-sm ${isToday ? 'font-bold text-primary' : ''}`}>
                        {day.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded text-white truncate ${getLeaveTypeColor(event.leaveType)}`}
                            title={`${event.employeeName} - ${getLeaveTypeLabel(event.leaveType)}`}
                          >
                            {event.employeeName}
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{events.length - 3} meer
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Leave */}
            <Card>
              <CardHeader>
                <CardTitle>Aankomend Verlof</CardTitle>
                <CardDescription>Verlof dat binnenkort start</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveEvents
                    .filter(event => new Date(event.startDate) >= new Date())
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .slice(0, 10)
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {event.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{event.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.startDate} - {event.endDate} • {event.days} dagen
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getLeaveTypeLabel(event.leaveType)}
                            </Badge>
                            <Badge variant={getStatusBadge(event.status)} className="text-xs">
                              {event.status === 'approved' && 'Goedgekeurd'}
                              {event.status === 'pending' && 'In behandeling'}
                              {event.status === 'rejected' && 'Afgewezen'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Absences */}
            <Card>
              <CardHeader>
                <CardTitle>Huidige Afwezigheden</CardTitle>
                <CardDescription>Medewerkers die nu afwezig zijn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveEvents
                    .filter(event => {
                      const today = new Date()
                      const startDate = new Date(event.startDate)
                      const endDate = new Date(event.endDate)
                      return today >= startDate && today <= endDate && event.status === 'approved'
                    })
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg bg-muted/20">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {event.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{event.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            Tot {event.endDate} • {getLeaveTypeLabel(event.leaveType)}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getLeaveTypeColor(event.leaveType)}`}></div>
                      </div>
                    ))}
                  {leaveEvents.filter(event => {
                    const today = new Date()
                    const startDate = new Date(event.startDate)
                    const endDate = new Date(event.endDate)
                    return today >= startDate && today <= endDate && event.status === 'approved'
                  }).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4" />
                      <p>Geen huidige afwezigheden</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Events List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Alle Verlofevenementen</CardTitle>
              <CardDescription>Complete lijst van verlofaanvragen en goedkeuringen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveEvents
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded ${getLeaveTypeColor(event.leaveType)}`}></div>
                        <div>
                          <p className="font-medium">{event.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.startDate} - {event.endDate} • {event.days} dagen
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getLeaveTypeLabel(event.leaveType)}
                        </Badge>
                        <Badge variant={getStatusBadge(event.status)}>
                          {event.status === 'approved' && 'Goedgekeurd'}
                          {event.status === 'pending' && 'In behandeling'}
                          {event.status === 'rejected' && 'Afgewezen'}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span>Vakantie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>Persoonlijk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span>Ziekte</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span>Training</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span>Zwangerschapsverlof</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}