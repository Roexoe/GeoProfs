import { useState } from 'react'
import { Calendar, Users, FileText, Settings, Bell, LogOut } from 'lucide-react'
import { Button } from './components/ui/button'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import { Badge } from './components/ui/badge'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { EmployeeDashboard } from './components/employee-dashboard'
import { ManagerDashboard } from './components/manager-dashboard'
import { LeaveRequestForm } from './components/leave-request-form'
import { ApprovalPanel } from './components/approval-panel'
import { TeamCalendar } from './components/team-calendar'
import { Reports } from './components/reports'

// Mock user data - in real app this would come from authentication
const currentUser = {
  id: '1',
  name: 'Pim Melchers',
  email: 'p.melchers@geoprofs.nl',
  role: 'manager', // 'employee', 'manager', 'hr'
  department: 'Landmeetkunde',
  remainingDays: 18
}

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [notifications] = useState([
    { id: 1, message: 'Max van Rooijen heeft verlof aangevraagd', type: 'approval' },
    { id: 2, message: 'Uw verlofaanvraag is goedgekeurd', type: 'info' }
  ])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'request', label: 'Verlof Aanvragen', icon: Calendar },
    { id: 'calendar', label: 'Team Kalender', icon: Calendar },
    ...(currentUser.role === 'manager' || currentUser.role === 'hr' ? [
      { id: 'approvals', label: 'Goedkeuringen', icon: FileText },
      { id: 'reports', label: 'Rapporten', icon: FileText }
    ] : [])
  ]

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        if (currentUser.role === 'manager' || currentUser.role === 'hr') {
          return <ManagerDashboard user={currentUser} />
        }
        return <EmployeeDashboard user={currentUser} />
      case 'request':
        return <LeaveRequestForm user={currentUser} />
      case 'approvals':
        return <ApprovalPanel user={currentUser} />
      case 'calendar':
        return <TeamCalendar user={currentUser} />
      case 'reports':
        return <Reports user={currentUser} />
      default:
        return <EmployeeDashboard user={currentUser} />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                GP
              </div>
              <div>
                <h2 className="text-lg font-semibold">GeoProfs BV</h2>
                <p className="text-sm text-muted-foreground">Verlofregistratie</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentView === item.id}
                    onClick={() => setCurrentView(item.id)}
                    className="w-full"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center gap-3 p-2">
                <Avatar>
                  <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.department}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {menuItems.find(item => item.id === currentView)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.remainingDays} dagen over
                </p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}