import { useState, useEffect } from 'react'
import { Calendar, Save, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Calendar as CalendarComponent } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { useLeaveTypes, useCreateLeaveRequest, useConflictingRequests, useWorkingDays } from '../hooks/useApi'
import { User } from '../services/api'

// Mock date functions for demo purposes
const format = (date: Date, formatStr: string, options?: any) => {
  return date.toLocaleDateString('nl-NL')
}
const isWeekend = (date: Date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}
const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

interface LeaveRequestFormProps {
  user: User
}

export function LeaveRequestForm({ user }: LeaveRequestFormProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [leaveType, setLeaveType] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const leaveTypes = [
    { value: 'vacation', label: 'Vakantie' },
    { value: 'personal', label: 'Persoonlijk verlof' },
    { value: 'sick', label: 'Ziekteverlof' },
    { value: 'maternity', label: 'Zwangerschapsverlof' },
    { value: 'emergency', label: 'Noodgeval' },
    { value: 'training', label: 'Training/Opleiding' },
    { value: 'other', label: 'Overig' }
  ]

  const calculateWorkingDays = (start: Date, end: Date): number => {
    let workingDays = 0
    let currentDate = new Date(start)
    
    while (currentDate <= end) {
      if (!isWeekend(currentDate)) {
        workingDays++
      }
      currentDate = addDays(currentDate, 1)
    }
    
    return workingDays
  }

  const workingDays = startDate && endDate ? calculateWorkingDays(startDate, endDate) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Reset form
    setStartDate(undefined)
    setEndDate(undefined)
    setLeaveType('')
    setReason('')
    setNotes('')
    setIsSubmitting(false)

    // Show success message (in real app, would handle this properly)
    alert('Verlofaanvraag succesvol ingediend!')
  }

  const isFormValid = startDate && endDate && leaveType && reason.trim()

  // Check for conflicts (mock data)
  const conflictingLeave = [
    { name: 'Max van Rooijen', dates: '15-20 maart' },
    { name: 'Jay Schuurman', dates: '22-26 maart' }
  ]

  const hasConflicts = conflictingLeave.length > 0

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Nieuwe Verlofaanvraag</h2>
        <p className="text-muted-foreground">
          Vul onderstaand formulier in om verlof aan te vragen
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Verlofgegevens</CardTitle>
              <CardDescription>
                Vul alle vereiste gegevens in voor je verlofaanvraag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Startdatum *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'dd MMMM yyyy') : 'Selecteer datum'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Einddatum *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'dd MMMM yyyy') : 'Selecteer datum'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date: Date) => date < (startDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Leave Type */}
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Type verlof *</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer type verlof" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reden *</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Korte omschrijving van de reden"
                    required
                  />
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Aanvullende opmerkingen</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optionele aanvullende informatie..."
                    rows={3}
                  />
                </div>

                {/* Conflicts Warning */}
                {hasConflicts && (
                  <Alert>
                    <AlertDescription>
                      <strong>Let op:</strong> Er zijn overlappende verlofperiodes in je team:
                      {conflictingLeave.map((conflict, index) => (
                        <div key={index} className="mt-1">
                          • {conflict.name}: {conflict.dates}
                        </div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Form Actions */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>Indienen...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Verlofaanvraag Indienen
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Overzicht Aanvraag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Periode:</span>
                  <span className="text-sm font-medium">
                    {startDate && endDate 
                      ? `${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM')}`
                      : 'Niet geselecteerd'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Werkdagen:</span>
                  <span className="text-sm font-medium">{workingDays} dagen</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium">
                    {leaveType ? leaveTypes.find(t => t.value === leaveType)?.label : '-'}
                  </span>
                </div>
              </div>
              
              {workingDays > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Resterend saldo:</span>
                    <span className="text-sm font-medium">
                      {user.remainingDays - workingDays} dagen
                    </span>
                  </div>
                  {user.remainingDays - workingDays < 0 && (
                    <Alert className="mt-2">
                      <AlertDescription className="text-xs">
                        Onvoldoende verlofsaldo beschikbaar
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Leave Balance */}
          <Card>
            <CardHeader>
              <CardTitle>Jouw Verlofsaldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{user.remainingDays}</div>
                <div className="text-sm text-muted-foreground">dagen beschikbaar</div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Totaal 2024:</span>
                  <span>25 dagen</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gebruikt:</span>
                  <span>7 dagen</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">In behandeling:</span>
                  <span>3 dagen</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Plan verlof minimaal 2 weken van te voren</p>
              <p>• Controleer teambezetting voor je periode</p>
              <p>• Urgente aanvragen binnen 48 uur</p>
              <p>• Weekend dagen tellen niet mee</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}