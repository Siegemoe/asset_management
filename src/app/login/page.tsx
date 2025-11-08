"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SessionManager } from "@/lib/security/sessionManager"
import { SimpleAuditLogger } from "@/lib/security/simpleAuditLogger"

interface ValidationErrors {
  email?: string
  password?: string
  name?: string
  general?: string
}

interface ErrorMessage {
  type: 'error' | 'warning' | 'success'
  message: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  })
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}

    // Email validation
    if (!formData.email) {
      errors.email = "Email address is required"
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required"
    } else if (!isValidPassword(formData.password)) {
      errors.password = "Password must be at least 6 characters long"
    }

    // Name validation for signup
    if (isSignUp && !formData.name.trim()) {
      errors.name = "Full name is required for account creation"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Clear error message after a delay
  const clearMessages = () => {
    setTimeout(() => {
      setErrorMessage(null)
      setSuccessMessage(null)
    }, 5000)
  }

  // Set error message
  const setError = (type: ErrorMessage['type'], message: string) => {
    setErrorMessage({ type, message })
    clearMessages()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous messages
    setErrorMessage(null)
    setSuccessMessage(null)
    
    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        await handleSignUp()
      } else {
        await handleSignIn()
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setError('error', 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: "SITE_MANAGER" // Default role, not user-selectable
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting to dashboard...')
        
        // Auto sign in after successful signup
        setTimeout(async () => {
          const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false
          })
          
          if (result?.ok) {
            router.push('/dashboard')
          }
        }, 1500)
      } else {
        // Handle specific signup errors
        switch (response.status) {
          case 400:
            if (data.message?.includes('Email already exists')) {
              setError('error', 'An account with this email address already exists. Please use a different email or try signing in.')
            } else {
              setError('error', data.message || 'Failed to create account. Please check your information and try again.')
            }
            break
          case 422:
            setError('error', 'Please check your information and try again.')
            break
          default:
            setError('error', 'Failed to create account. Please try again later.')
        }
      }
    } catch {
      setError('error', 'Network error. Please check your internet connection and try again.')
    }
  }

  const handleSignIn = async () => {
    try {
      console.log('Attempting to sign in with:', { email: formData.email, password: formData.password.substring(0, 3) + '...' })
      
      // Get client info for session management
      const ipAddress = '127.0.0.1' // In production, this would come from headers
      const userAgent = navigator.userAgent || 'Unknown Browser'
      
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      console.log('SignIn result:', result)

      // Check if sign in was successful
      if (result && result.ok && !result.error) {
        // Create session for successful login
        const session = await SessionManager.createSession(
          'user_from_login', // We'll get the actual user ID from the session
          `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          undefined, // No refresh token for credential login
          'Web Browser',
          ipAddress,
          userAgent
        )

        console.log('Session created for user:', session.id)

        // Log successful login to audit system
        await SimpleAuditLogger.logLoginAttempt(
          'user_from_login',
          formData.email,
          true,
          ipAddress,
          userAgent
        )

        setSuccessMessage('Welcome back! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        // Handle sign-in failures
        const errorMessage = result?.error || 'Sign in failed'
        
        console.log('Sign in failed with error:', errorMessage)
        
        // Log failed login to audit system
        await SimpleAuditLogger.logLoginAttempt(
          undefined,
          formData.email,
          false,
          ipAddress,
          userAgent,
          errorMessage
        )
        
        // More specific error handling
        if (!result) {
          setError('error', 'Authentication service is unavailable. Please try again later.')
        } else if (result.error) {
          switch (result.error) {
            case 'CredentialsSignin':
            case 'InvalidLogin':
            case 'Invalid credentials':
              setError('error', 'Invalid email or password. Please check your credentials and try again.')
              break
            case 'User not found':
            case 'User not found.':
              setError('error', 'No account found with this email address. Please check your email or create a new account.')
              break
            case 'Invalid password':
              setError('error', 'The password you entered is incorrect. Please try again.')
              break
            case 'Email not verified':
              setError('error', 'Please verify your email address before signing in.')
              break
            case 'Too many requests':
              setError('error', 'Too many login attempts. Please wait a few minutes before trying again.')
              break
            default:
              // Generic error handling
              if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('credentials')) {
                setError('error', 'Invalid email or password. Please check your credentials and try again.')
              } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
                setError('error', 'Network error. Please check your internet connection and try again.')
              } else if (errorMessage.toLowerCase().includes('user') || errorMessage.toLowerCase().includes('email')) {
                setError('error', 'No account found with this email address. Please check your email or create a new account.')
              } else {
                setError('error', `Sign in failed: ${errorMessage}`)
              }
          }
        } else {
          setError('error', 'Sign in failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      
      // Log unexpected errors to audit system
      await SimpleAuditLogger.logLoginAttempt(
        undefined,
        formData.email,
        false,
        '127.0.0.1',
        navigator.userAgent || 'Unknown Browser',
        error instanceof Error ? error.message : 'Unknown error'
      )
      
      setError('error', 'Network error. Please check your internet connection and try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMessage(null)
    
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch {
      setError('error', 'Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignUp(!isSignUp)
    setErrorMessage(null)
    setSuccessMessage(null)
    setValidationErrors({})
    setFormData({
      email: "",
      password: "",
      name: ""
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 border border-gray-300 rounded-lg p-8 bg-white shadow-sm">
        <div>
          <div className="flex justify-center">
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">
            APM Asset Management
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? 'Create your account to get started' : 'Sign in to manage your assets'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {errorMessage && (
            <div className={`rounded-md p-4 ${
              errorMessage.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
              errorMessage.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
              'bg-green-50 border border-green-200 text-green-700'
            }`}>
              <div className="flex">
                <div className="shrink-0">
                  {errorMessage.type === 'error' ? (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : errorMessage.type === 'warning' ? (
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{errorMessage.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required={isSignUp}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                  if (validationErrors.email) {
                    const { email, ...restErrors } = validationErrors
                    setValidationErrors(restErrors)
                  }
                }}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                  if (validationErrors.password) {
                    const { password, ...restErrors } = validationErrors
                    setValidationErrors(restErrors)
                  }
                }}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
              {isSignUp && !validationErrors.password && formData.password && (
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Role Field (Sign Up Only) - Removed role selection */}
            {isSignUp && (
              <div>
                <p className="text-sm text-gray-500">
                  Your account will be created with standard permissions.
                  System administrators can adjust your access level if needed.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Please wait...
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Switch Mode Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                type="button"
                onClick={switchMode}
                className="font-medium text-blue-600 hover:text-blue-500"
                disabled={loading}
              >
                {isSignUp ? 'Sign in here' : 'Create an account'}
              </button>
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our terms of service and privacy policy.
            </p>
            {isSignUp && (
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <Link href="/help" className="hover:text-gray-700">Help & Support</Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
