import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { Brain, Loader2, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const emailSchema = z.string().email('Please enter a valid email address')
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters')

export default function Auth() {
  const [searchParams] = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  // 🚨 HARD REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (user) {
      navigate('/generate', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup')
  }, [searchParams])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    const emailResult = emailSchema.safeParse(email)
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message
    }

    const passwordResult = passwordSchema.safeParse(password)
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🛑 Never allow auth actions if already logged in
    if (user) return

    if (!validateForm()) return

    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName)

        if (error) {
          if (error.message.toLowerCase().includes('already')) {
            toast.error('This email is already registered. Please sign in.')
          } else {
            toast.error(error.message)
          }
          return
        }

        toast.success('Account created successfully!')
        navigate('/generate', { replace: true })
        return
      }

      // SIGN IN
      const { error } = await signIn(email, password)

      if (error) {
        toast.error('Invalid email or password')
        return
      }

      toast.success('Welcome back!')
      navigate('/generate', { replace: true })
    } catch {
      toast.error('Unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Link
        to="/"
        className="flex items-center gap-2 mb-8 font-heading font-bold text-2xl"
      >
        <div className="p-2 rounded-xl bg-primary text-primary-foreground">
          <Brain className="w-6 h-6" />
        </div>
        MindMap AI
      </Link>

      <Card className="w-full max-w-md shadow-warm animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Start creating beautiful mind maps today'
              : 'Sign in to access your mind maps'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <button
                onClick={() => setIsSignUp(false)}
                className="text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                onClick={() => setIsSignUp(true)}
                className="text-primary hover:underline"
              >
                Don’t have an account? Create one
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
