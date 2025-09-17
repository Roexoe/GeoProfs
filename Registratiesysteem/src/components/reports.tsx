import { useState } from 'react'
import { Download, Filter, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  remainingDays: number
}

interface ReportsProps {
  user: User
}

export function Reports({ user }: ReportsProps) {
  const [timeRange, setTimeRange] = useState('year')
  const [department, setDepartment] = useState('all')

  // Mock data - would come from API
  const overviewStats = {
    totalEmployees: 80,
    totalLeaveRequests: 234,
    approvedRequests: 198,
    pendingRequests: 12,
    averageLeavePerEmployee: 18.5,
    currentOccupancy: 87
  }

  const departmentStats = [
    { department: 'Landmeetkunde', employees: 25, leaveUsage: 72, occupancy: 84 },
    { department: 'GIS', employees: 18, leaveUsage: 68, occupancy: 89 },
    { department: 'Projectmanagement', employees: 15, leaveUsage: 75, occupancy: 80 },
    { department: 'Administratie', employees: 12, leaveUsage: 82, occupancy: 92 },
    { department: 'HR', employees: 6, leaveUsage: 65, occupancy: 83 },
    { department: 'IT', employees: 4, leaveUsage: 58, occupancy: 100 }
  ]

  const monthlyTrends = [
    { month: 'Jan', requests: 18, approved: 16, rejected: 2 },
    { month: 'Feb', requests: 24, approved: 22, rejected: 2 },
    { month: 'Mar', requests: 32, approved: 28, rejected: 4 },
    { month: 'Apr', requests: 28, approved: 25, rejected: 3 },
    { month: 'Mei', requests: 35, approved: 30, rejected: 5 },
    { month: 'Jun', requests: 42, approved: 38, rejected: 4 },
    { month: 'Jul', requests: 48, approved: 45, rejected: 3 },
    { month: 'Aug', requests: 38, approved: 35, rejected: 3 },
    { month: 'Sep', requests: 22, approved: 20, rejected: 2 },
    { month: 'Okt', requests: 26, approved: 24, rejected: 2 },
    { month: 'Nov', requests: 19, approved: 18, rejected: 1 },
    { month: 'Dec', requests: 15, approved: 14, rejected: 1 }
  ]

  const leaveTypeDistribution = [
    { name: 'Vakantie', value: 65, color: '#3b82f6' },
    { name: 'Persoonlijk', value: 15, color: '#10b981' },
    { name: 'Ziekte', value: 12, color: '#ef4444' },
    { name: 'Training', value: 5, color: '#f97316' },
    { name: 'Overig', value: 3, color: '#6b7280' }
  ]

  const topUsers = [
    { name: 'Max van Rooijen', department: 'Landmeetkunde', daysUsed: 22, daysRemaining: 3, usage: 88 },
    { name: 'Jay Schuurman', department: 'GIS', daysUsed: 20, daysRemaining: 5, usage: 80 },
    { name: 'Mees van Aalten', department: 'Project', daysUsed: 19, daysRemaining: 6, usage: 76 },
    { name: 'Claassen', department: 'Landmeetkunde', daysUsed: 18, daysRemaining: 7, usage: 72 },
    { name: 'Jochem Bosch', department: 'Administratie', daysUsed: 17, daysRemaining: 8, usage: 68 }
  ]

  const exportReport = (type: 'excel' | 'pdf') => {
    // Mock export functionality
    alert(`${type.toUpperCase()} rapport wordt geëxporteerd...`)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Rapporten & Analytics</h2>
        <p className="text-muted-foreground">
          Inzichten en statistieken over verlofgebruik en teamperformance
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Deze maand</SelectItem>
                <SelectItem value="quarter">Dit kwartaal</SelectItem>
                <SelectItem value="year">Dit jaar</SelectItem>
                <SelectItem value="custom">Aangepast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Afdelingen</SelectItem>
              <SelectItem value="landmeetkunde">Landmeetkunde</SelectItem>
              <SelectItem value="gis">GIS</SelectItem>
              <SelectItem value="project">Projectmanagement</SelectItem>
              <SelectItem value="admin">Administratie</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="it">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="departments">Afdelingen</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="employees">Medewerkers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Medewerkers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">Actieve medewerkers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verlofaanvragen</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalLeaveRequests}</div>
                <p className="text-xs text-muted-foreground">Dit jaar totaal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bezettingsgraad</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.currentOccupancy}%</div>
                <p className="text-xs text-muted-foreground">Momenteel aanwezig</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Requests Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Maandelijkse Verlofaanvragen</CardTitle>
                <CardDescription>Aantal aanvragen per maand dit jaar</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="approved" fill="#3b82f6" name="Goedgekeurd" />
                    <Bar dataKey="rejected" fill="#ef4444" name="Afgewezen" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Leave Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Verloftype Verdeling</CardTitle>
                <CardDescription>Percentage per type verlof</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveTypeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {leaveTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Afdelingsoverzicht</CardTitle>
              <CardDescription>Verlofgebruik en bezettingsgraad per afdeling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{dept.department}</h3>
                        <p className="text-sm text-muted-foreground">{dept.employees} medewerkers</p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{dept.leaveUsage}%</div>
                          <div className="text-muted-foreground">Verlofgebruik</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{dept.occupancy}%</div>
                          <div className="text-muted-foreground">Bezetting</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Verlofgebruik</span>
                        <span>{dept.leaveUsage}%</span>
                      </div>
                      <Progress value={dept.leaveUsage} className="h-2" />
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between text-sm">
                        <span>Huidige bezetting</span>
                        <span>{dept.occupancy}%</span>
                      </div>
                      <Progress value={dept.occupancy} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verloftrends over Tijd</CardTitle>
                <CardDescription>Ontwikkeling van verlofaanvragen gedurende het jaar</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" name="Totaal aanvragen" strokeWidth={2} />
                    <Line type="monotone" dataKey="approved" stroke="#10b981" name="Goedgekeurd" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Seasonal Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Seizoensinzichten</CardTitle>
                <CardDescription>Patronen in verlofaanvragen per seizoen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">64</div>
                    <div className="text-sm text-muted-foreground">Lente aanvragen</div>
                    <Badge variant="outline" className="mt-1">+15% vs vorig jaar</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">128</div>
                    <div className="text-sm text-muted-foreground">Zomer aanvragen</div>
                    <Badge variant="outline" className="mt-1">+8% vs vorig jaar</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">67</div>
                    <div className="text-sm text-muted-foreground">Herfst aanvragen</div>
                    <Badge variant="outline" className="mt-1">-3% vs vorig jaar</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">45</div>
                    <div className="text-sm text-muted-foreground">Winter aanvragen</div>
                    <Badge variant="outline" className="mt-1">+12% vs vorig jaar</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Medewerker Verlofgebruik</CardTitle>
              <CardDescription>Top gebruikers van verlofdagen dit jaar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((employee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{employee.daysUsed} dagen gebruikt</p>
                        <p className="text-xs text-muted-foreground">{employee.daysRemaining} dagen over</p>
                      </div>
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Gebruik</span>
                          <span>{employee.usage}%</span>
                        </div>
                        <Progress value={employee.usage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Samenvatting Statistieken</CardTitle>
              <CardDescription>Algemene statistieken voor het verlofgebruik</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary">{overviewStats.averageLeavePerEmployee}</div>
                  <p className="text-sm text-muted-foreground">Gemiddeld verlofdagen per medewerker</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-green-600">{overviewStats.approvedRequests}</div>
                  <p className="text-sm text-muted-foreground">Goedgekeurde aanvragen</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-yellow-600">{overviewStats.pendingRequests}</div>
                  <p className="text-sm text-muted-foreground">Openstaande aanvragen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}