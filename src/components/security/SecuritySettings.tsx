'use client'

import { useState } from 'react'

interface SecurityConfig {
  accountLockout: {
    maxFailedAttempts: number
    lockoutDuration: number
    progressiveLockout: boolean
    maxLockoutDuration: number
  }
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxHistory: number
    maxAge: number
    preventCommonPasswords: boolean
  }
  sessionManagement: {
    sessionTimeout: number
    maxConcurrentSessions: number
    refreshTokenRotation: boolean
    requireHTTPS: boolean
    sessionFingerprinting: boolean
  }
}

export function SecuritySettings() {
  const [activeSection, setActiveSection] = useState<'account' | 'password' | 'session'>('account')
  const [config, setConfig] = useState<SecurityConfig>({
    accountLockout: {
      maxFailedAttempts: 5,
      lockoutDuration: 15,
      progressiveLockout: true,
      maxLockoutDuration: 1440
    },
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxHistory: 5,
      maxAge: 90,
      preventCommonPasswords: true
    },
    sessionManagement: {
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
      refreshTokenRotation: true,
      requireHTTPS: true,
      sessionFingerprinting: true
    }
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleConfigChange = (section: keyof SecurityConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const sections = [
    { id: 'account', name: 'Account Lockout', icon: '🔒' },
    { id: 'password', name: 'Password Policy', icon: '🔑' },
    { id: 'session', name: 'Session Management', icon: '🔐' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Security Configuration</h3>
        <div className="flex items-center space-x-3">
          {saved && (
            <div className="flex items-center text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Saved</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeSection === section.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Account Lockout Settings */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Account Lockout Configuration</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Failed Attempts
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={config.accountLockout.maxFailedAttempts}
                      onChange={(e) => handleConfigChange('accountLockout', 'maxFailedAttempts', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">Number of failed login attempts before account lockout</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lockout Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={config.accountLockout.lockoutDuration}
                      onChange={(e) => handleConfigChange('accountLockout', 'lockoutDuration', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">Initial lockout duration in minutes</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Lockout Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="10080"
                      value={config.accountLockout.maxLockoutDuration}
                      onChange={(e) => handleConfigChange('accountLockout', 'maxLockoutDuration', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">Maximum lockout duration in minutes</p>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="progressive-lockout"
                      type="checkbox"
                      checked={config.accountLockout.progressiveLockout}
                      onChange={(e) => handleConfigChange('accountLockout', 'progressiveLockout', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="progressive-lockout" className="ml-2 block text-sm text-gray-900">
                      Progressive Lockout
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Policy Settings */}
          {activeSection === 'password' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Password Policy Configuration</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="128"
                      value={config.passwordPolicy.minLength}
                      onChange={(e) => handleConfigChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password History
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={config.passwordPolicy.maxHistory}
                      onChange={(e) => handleConfigChange('passwordPolicy', 'maxHistory', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">Number of previous passwords to remember</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      value={config.passwordPolicy.maxAge}
                      onChange={(e) => handleConfigChange('passwordPolicy', 'maxAge', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">0 means no expiration</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="require-uppercase"
                        type="checkbox"
                        checked={config.passwordPolicy.requireUppercase}
                        onChange={(e) => handleConfigChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="require-uppercase" className="ml-2 block text-sm text-gray-900">
                        Require Uppercase Letters
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="require-lowercase"
                        type="checkbox"
                        checked={config.passwordPolicy.requireLowercase}
                        onChange={(e) => handleConfigChange('passwordPolicy', 'requireLowercase', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="require-lowercase" className="ml-2 block text-sm text-gray-900">
                        Require Lowercase Letters
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="require-numbers"
                        type="checkbox"
                        checked={config.passwordPolicy.requireNumbers}
                        onChange={(e) => handleConfigChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="require-numbers" className="ml-2 block text-sm text-gray-900">
                        Require Numbers
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="require-special"
                        type="checkbox"
                        checked={config.passwordPolicy.requireSpecialChars}
                        onChange={(e) => handleConfigChange('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="require-special" className="ml-2 block text-sm text-gray-900">
                        Require Special Characters
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="prevent-common"
                        type="checkbox"
                        checked={config.passwordPolicy.preventCommonPasswords}
                        onChange={(e) => handleConfigChange('passwordPolicy', 'preventCommonPasswords', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="prevent-common" className="ml-2 block text-sm text-gray-900">
                        Prevent Common Passwords
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Session Management Settings */}
          {activeSection === 'session' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Session Management Configuration</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      value={config.sessionManagement.sessionTimeout}
                      onChange={(e) => handleConfigChange('sessionManagement', 'sessionTimeout', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Concurrent Sessions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={config.sessionManagement.maxConcurrentSessions}
                      onChange={(e) => handleConfigChange('sessionManagement', 'maxConcurrentSessions', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="token-rotation"
                        type="checkbox"
                        checked={config.sessionManagement.refreshTokenRotation}
                        onChange={(e) => handleConfigChange('sessionManagement', 'refreshTokenRotation', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="token-rotation" className="ml-2 block text-sm text-gray-900">
                        Refresh Token Rotation
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="require-https"
                        type="checkbox"
                        checked={config.sessionManagement.requireHTTPS}
                        onChange={(e) => handleConfigChange('sessionManagement', 'requireHTTPS', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="require-https" className="ml-2 block text-sm text-gray-900">
                        Require HTTPS Only
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="session-fingerprinting"
                        type="checkbox"
                        checked={config.sessionManagement.sessionFingerprinting}
                        onChange={(e) => handleConfigChange('sessionManagement', 'sessionFingerprinting', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="session-fingerprinting" className="ml-2 block text-sm text-gray-900">
                        Session Fingerprinting
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}