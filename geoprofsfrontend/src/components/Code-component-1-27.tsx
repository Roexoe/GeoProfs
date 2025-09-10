import { useState } from 'react'
import { CheckCircle, XCircle, Clock, User, Calendar, MessageSquare, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  remainingDays: number
}

interface ApprovalPanelProps {
  user: User
}

interface LeaveRequest {
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
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  remainingBalance: number
  conflicts?: string[]
}

export function ApprovalPanel({ user }: ApprovalPanelProps) {
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [approvalComment, setApprovalComment] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data - would come from API
  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeId: 'emp1',
      employeeName: 'Maria Jansen',
      employeeEmail: 'm.jansen@geoprofs.nl',
      startDate: '2024-03-25',
      endDate: '2024-03-29',
      workingDays: 5,
      leaveType: 'vacation',
      reason: 'Familievakantie naar Italië',
      notes: 'Projecten zijn overgedragen aan Pieter',
      status: 'pending',
      submittedDate: '2024-03-10',
      priority: 'normal',
      remainingBalance: 15,
      conflicts: []
    },
    {
      id: '2',
      employeeId: 'emp2',
      employeeName: 'Pieter de Vries',
      employeeEmail: 'p.devries@geoprofs.nl',
      startDate: '2024-03-20',
      endDate: '2024-03-20',
      workingDays: 1,
      leaveType: 'personal',
      reason: 'Medische afspraak',
      status: 'pending',
      submittedDate: '2024-03-18',
      priority: 'urgent',
      remainingBalance: 8,
      conflicts: []
    },
    {
      id: '3',
      employeeId: 'emp3',
      employeeName: 'Anna van der Meer',
      employeeEmail: 'a.vandermeer@geoprofs.nl',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      workingDays: 5,
      leaveType: 'vacation',
      reason: 'Lentevakantie',
      status: 'pending',
      submittedDate: '2024-03-08',
      priority: 'normal',
      remainingBalance: 12,
      conflicts: ['Maria Jansen: 25-29 maart (overlapping periode)']
    },
    {
      id: '4',
      employeeId: 'emp4',
      employeeName: 'Tom Bakker',
      employeeEmail: 't.bakker@geoprofs.nl',
      startDate: '2024-02-15',
      endDate: '2024-02-16',
      workingDays: 2,
      leaveType: 'personal',
      reason: 'Persoonlijke aangelegenheden',
      status: 'approved',
      submittedDate: '2024-02-01',
      priority: 'normal',
      remainingBalance: 18
    }
  ]

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending')
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved')
  const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected')

  const getLeaveTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      vacation: 'Vakantie',
      personal: 'Persoonlijk',
      sick: 'Ziekte',
      maternity: 'Zwangerschap',
      emergency: 'Noodgeval',
      training: 'Training',
      other: 'Overig'
    }
    return types[type] || type
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      urgent: { variant: 'destructive', label: 'Urgent' },
      high: { variant: 'destructive', label: 'Hoog' },
      normal: { variant: 'secondary', label: 'Normaal' },
      low: { variant: 'outline', label: 'Laag' }
    }
    return variants[priority] || variants.normal
  }

  const handleApproval = async (requestId: string, approved: boolean, comment: string = '') => {
    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, this would update the backend
    console.log(`Request ${requestId} ${approved ? 'approved' : 'rejected'}`, { comment })
    
    setSelectedRequest(null)
    setApprovalComment('')
    setIsProcessing(false)
    
    // Show success message
    alert(`Aanvraag ${approved ? 'goedgekeurd' : 'afgewezen'}!`)
  }

  const filteredRequests = (requests: LeaveRequest[]) => {
    if (filter === 'all') return requests
    return requests.filter(req => req.priority === filter)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Verlofgoedkeuringen</h2>
        <p className="text-muted-foreground">
          Bekijk en verwerk verlofaanvragen van je teamleden
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <Label>Filter op prioriteit:</Label>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle aanvragen</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">Hoge prioriteit</SelectItem>
            <SelectItem value="normal">Normale prioriteit</SelectItem>
            <SelectItem value="low">Lage prioriteit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            In Behandeling
            {pendingRequests.length > 0 && (
              <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Goedgekeurd</TabsTrigger>
          <TabsTrigger value="rejected">Afgewezen</TabsTrigger>
        </TabsList>

        {/* Pending Requests */}
        <TabsContent value="pending">
          {filteredRequests(pendingRequests).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Geen aanvragen in behandeling</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests(pendingRequests).map((request) => (
                <Card key={request.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {request.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{request.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">{request.employeeEmail}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getPriorityBadge(request.priority).variant}>
                              {getPriorityBadge(request.priority).label}
                            </Badge>
                            <Badge variant="outline">{getLeaveTypeLabel(request.leaveType)}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {request.startDate} - {request.endDate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.workingDays} werkdagen
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ingediend: {request.submittedDate}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Reden:</span> {request.reason}
                      </p>
                      {request.notes && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Opmerkingen:</span> {request.notes}
                        </p>
                      )}
                      <p className="text-sm mt-1">
                        <span className="font-medium">Resterend saldo:</span> {request.remainingBalance} dagen
                      </p>
                    </div>

                    {request.conflicts && request.conflicts.length > 0 && (
                      <Alert className="mb-4">
                        <AlertDescription>
                          <strong>Mogelijke conflicten:</strong>
                          <ul className="mt-1">
                            {request.conflicts.map((conflict, index) => (
                              <li key={index} className="text-sm">• {conflict}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex-1"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Goedkeuren
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Verlofaanvraag Goedkeuren</DialogTitle>
                            <DialogDescription>
                              Je staat op het punt om de verlofaanvraag van {request.employeeName} goed te keuren.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p><strong>Periode:</strong> {request.startDate} - {request.endDate}</p>
                              <p><strong>Dagen:</strong> {request.workingDays} werkdagen</p>
                              <p><strong>Reden:</strong> {request.reason}</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="approval-comment">Opmerking (optioneel)</Label>
                              <Textarea
                                id="approval-comment"
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                placeholder="Voeg een opmerking toe..."
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                              Annuleren
                            </Button>
                            <Button
                              onClick={() => handleApproval(request.id, true, approvalComment)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Verwerken...' : 'Goedkeuren'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Afwijzen
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Verlofaanvraag Afwijzen</DialogTitle>
                            <DialogDescription>
                              Je staat op het punt om de verlofaanvraag van {request.employeeName} af te wijzen.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p><strong>Periode:</strong> {request.startDate} - {request.endDate}</p>
                              <p><strong>Dagen:</strong> {request.workingDays} werkdagen</p>
                              <p><strong>Reden:</strong> {request.reason}</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="rejection-comment">Reden voor afwijzing *</Label>
                              <Textarea
                                id="rejection-comment"
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                placeholder="Leg uit waarom deze aanvraag wordt afgewezen..."
                                rows={3}
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                              Annuleren
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleApproval(request.id, false, approvalComment)}
                              disabled={isProcessing || !approvalComment.trim()}
                            >
                              {isProcessing ? 'Verwerken...' : 'Afwijzen'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Approved Requests */}
        <TabsContent value="approved">
          <div className="space-y-4">
            {approvedRequests.map((request) => (
              <Card key={request.id} className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{request.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.startDate} - {request.endDate} • {request.workingDays} dagen
                        </p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        Goedgekeurd
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rejected Requests */}
        <TabsContent value="rejected">
          <div className="text-center py-8 text-muted-foreground">
            <XCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Geen afgewezen aanvragen</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}