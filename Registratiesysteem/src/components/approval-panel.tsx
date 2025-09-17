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
import { usePendingApprovals, useApprovalActions, useApprovalHistory } from '../hooks/useApi'
import { ErrorDisplay, LoadingSpinner } from './ErrorHandling'
import { User as UserType, LeaveRequest } from '../services/api'

interface ApprovalPanelProps {
  user: UserType
}

export function ApprovalPanel({ user }: ApprovalPanelProps) {
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [approvalComment, setApprovalComment] = useState('')

  // API hooks
  const { data: pendingData, loading: pendingLoading, error: pendingError, refetch: refetchPending } = usePendingApprovals({ 
    department: user.department 
  })
  const { data: historyData, loading: historyLoading, error: historyError } = useApprovalHistory()
  const { approveRequest, rejectRequest, loading: isProcessing, error: actionError } = useApprovalActions()

  const leaveRequests = pendingData?.pendingApprovals || []
  const approvalHistory = historyData?.approvalHistory || []

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending')
  const approvedRequests = approvalHistory.filter(req => req.status === 'approved')
  const rejectedRequests = approvalHistory.filter(req => req.status === 'rejected')

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
    try {
      if (approved) {
        await approveRequest(requestId, comment)
      } else {
        await rejectRequest(requestId, 'Afgewezen door manager', comment)
      }
      
      setSelectedRequest(null)
      setApprovalComment('')
      
      // Refresh the data
      refetchPending()
      
      alert(`Aanvraag ${approved ? 'goedgekeurd' : 'afgewezen'}!`)
    } catch (error) {
      console.error('Error processing approval:', error)
      alert('Er is een fout opgetreden bij het verwerken van de aanvraag.')
    }
  }

  const filteredRequests = (requests: LeaveRequest[]) => {
    if (filter === 'all') return requests
    return requests.filter(req => req.priority === filter)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Verlofgoedkeuringen</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Bekijk en verwerk verlofaanvragen van je teamleden
        </p>
      </div>

      {/* Error Display */}
      <ErrorDisplay error={pendingError || historyError || actionError} retry={refetchPending} className="mb-4" />

      {/* Loading State */}
      {(pendingLoading || historyLoading) && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Filter Controls */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <Label className="text-sm">Filter op prioriteit:</Label>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
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
                  <CardContent className="p-4 sm:p-6">
                    {/* Mobile-first layout */}
                    <div className="space-y-4">
                      {/* Header section */}
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <AvatarFallback>
                            {request.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{request.employeeName}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{request.employeeEmail}</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                            <Badge variant={getPriorityBadge(request.priority || 'normal').variant} className="text-xs">
                              {getPriorityBadge(request.priority || 'normal').label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{getLeaveTypeLabel(request.leaveType)}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Date and duration info */}
                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div>
                            <p className="text-sm font-medium">
                              {request.startDate} - {request.endDate}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {request.workingDays} werkdagen
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Ingediend: {request.submittedDate}
                          </p>
                        </div>
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

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex-1"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Goedkeuren</span>
                            <span className="sm:hidden">Goedkeuren</span>
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
                            <span className="hidden sm:inline">Afwijzen</span>
                            <span className="sm:hidden">Afwijzen</span>
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

                      <Button variant="ghost" size="sm" className="px-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="sr-only">Bericht sturen</span>
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback>
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{request.employeeName}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          <span className="block sm:inline">{request.startDate} - {request.endDate}</span>
                          <span className="hidden sm:inline"> • </span>
                          <span className="block sm:inline">{request.workingDays} dagen</span>
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
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