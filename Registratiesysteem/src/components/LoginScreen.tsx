import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Eye, EyeOff, Mail, Lock, MapPin, Users, Calendar, Shield, Zap, CheckCircle } from 'lucide-react'

interface LoginScreenProps {
  onLogin?: (email: string, password: string) => void
  loading?: boolean
  error?: string
}

export function LoginScreen({ onLogin, loading = false, error }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onLogin) {
      onLogin(email, password)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Left Side - Enhanced Brand & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-y-12 translate-y-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-white/10 to-transparent transform skew-y-12 -translate-y-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 opacity-20 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.05\"><path d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/></g></g></svg>')" }}></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white h-full">
            <div className="mb-12">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-white/30 hover:scale-105 transition-all duration-500 hover:rotate-3">
                <MapPin className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                GeoProfs <span className="text-blue-200">BV</span>
              </h1>
              <p className="text-xl text-blue-100 font-light leading-relaxed max-w-md">
                Professionele landmeetkundige diensten met moderne technologie
              </p>
            </div>

            <div className="space-y-8 mb-16">
              <div className="flex items-center space-x-6 group hover:translate-x-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 group-hover:bg-white/30 transition-all duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Smart Team Beheer</h3>
                  <p className="text-blue-100 text-lg">Beheer uw team en verlofaanvragen intelligent</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 group hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '100ms' }}>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 group-hover:bg-white/30 transition-all duration-300">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Geavanceerde Planning</h3>
                  <p className="text-blue-100 text-lg">Real-time planning van verlof en projecten</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 group hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '200ms' }}>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 group-hover:bg-white/30 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Veilig & Betrouwbaar</h3>
                  <p className="text-blue-100 text-lg">Enterprise-grade beveiliging voor uw data</p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-blue-200">80+ medewerkers vertrouwen ons systeem</span>
              </div>
              <div className="text-sm text-blue-300 flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>© 2025 GeoProfs BV. Alle rechten voorbehouden.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div style={{ width: '32vw', minWidth: '380px', maxWidth: '480px' }}>
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white hover:scale-105 transition-all duration-300">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GeoProfs BV</h1>
            <p className="text-gray-600 text-lg">Verlofregistratie Systeem</p>
          </div>

          <Card 
            className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl relative overflow-hidden hover:shadow-3xl transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Enhanced gradient overlay with animation */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-cyan-50/70 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-80'}`}></div>
            
            {/* Subtle animated border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 p-[1px]">
              <div className="h-full w-full rounded-lg bg-white/95 backdrop-blur-xl"></div>
            </div>
            
            <CardHeader className="text-center pb-10 relative z-10">
              <div className="hidden lg:block">
                <div className={`w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl border-4 border-white transition-all duration-500 ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}`}>
                  <span className="text-3xl font-bold tracking-wide">GP</span>
                </div>
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Welkom terug
              </CardTitle>
              <CardDescription className="text-gray-600 text-xl font-medium leading-relaxed">
                Log in om toegang te krijgen tot uw<br />verlofregistratie dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 px-12 pb-10 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50/90 backdrop-blur-sm shadow-lg animate-in slide-in-from-top-2 duration-300">
                    <AlertDescription className="text-red-800 font-medium text-lg">{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800 font-semibold text-sm tracking-wide uppercase">
                    E-mailadres
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-all duration-300 group-focus-within:scale-110 z-10" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="   uw.email@geoprofs.nl"
                      className="pl-12 pr-5 h-16 w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-2xl transition-all duration-300 text-gray-800 font-medium shadow-lg hover:shadow-xl bg-white/90 backdrop-blur-sm placeholder:text-gray-400 text-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800 font-semibold text-sm tracking-wide uppercase">
                    Wachtwoord
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-all duration-300 group-focus-within:scale-110 z-10" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="   ••••••••"
                      className="pl-12 pr-14 h-16 w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-2xl transition-all duration-300 text-gray-800 font-medium shadow-lg hover:shadow-xl bg-white/90 backdrop-blur-sm placeholder:text-gray-400 text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-all duration-300 p-1.5 rounded-full hover:bg-blue-50 hover:scale-110 z-10"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 mt-10 relative overflow-hidden group"
                  disabled={loading}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {loading ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="font-semibold tracking-wide">Bezig met inloggen...</span>
                    </div>
                  ) : (
                    <span className="tracking-wide relative z-10">Inloggen</span>
                  )}
                </Button>
              </form>
              
              <div className="mt-10 text-center">
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:underline decoration-2 underline-offset-4 text-lg hover:scale-105"
                >
                  Wachtwoord vergeten?
                </Button>
              </div>

              {/* Enhanced Additional Info */}
              <div className="mt-10 pt-8 border-t border-gray-200/60">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-sm text-gray-600 font-medium">Systeem Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 font-medium">SSL Beveiligd</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
                    <span>Hulp nodig? Neem contact op met IT Support</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}