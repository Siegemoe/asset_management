'use client'

import { useState, useEffect } from 'react'
import { SecurityHeader } from './SecurityHeader'

interface SecurityMetrics {
  failedLogins: number
  activeSessions: number
  securityEvents: number
  blockedIPs: number
}

interface SecurityEvent {
  id: string
  eventType: string
  description: string
  userId?: string
  ipAddress?: string
  timestamp: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: string
}

interface SecurityAlert {
  id: string
  type: string
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: string
  acknowledged: boolean
}

export function SimpleSecurityDashboard({ activeTab = 'dashboard' }: { activeTab?: string }) {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLogins: 0,
    activeSessions: 0,
    securityEvents: 0,
    blockedIPs: 0
  })

  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load from API
        const response = await fetch('/api/security/dashboard?type=metrics')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.log('API not available, using empty data')
        setMetrics({
          failedLogins: 0,
          activeSessions: 0,
          securityEvents: 0,
          blockedIPs: 0
        })
      }
      setLoading(false)
    }

    loadData()
  }, [])

  const renderMetrics = () => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Failed Logins (24h)</dt>
                <dd className="text-2xl font-semibold text-gray-900">{metrics.failedLogins}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                <dd className="text-2xl font-semibold text-gray-900">{metrics.activeSessions}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Security Events (24h)</dt>
                <dd className="text-2xl font-semibold text-gray-900">{metrics.securityEvents}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Blocked IPs</dt>
                <dd className="text-2xl font-semibold text-gray-900">{metrics.blockedIPs}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const generateDemoData = async () => {
    try {
      const response = await fetch('/api/security/generate-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'all' })
      })
      if (response.ok) {
        // Reload data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error generating demo data:', error)
    }
  }

  const renderEvents = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Security Events</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest security-related activities</p>
          </div>
          <button
            onClick={generateDemoData}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Demo Data
          </button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {events.length === 0 ? (
          <li className="px-4 py-6 sm:px-6">
            <div className="text-center">
              <div className="text-gray-500 mb-2">
                No security events found. System is operating normally.
              </div>
              <button
                onClick={generateDemoData}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Generate Demo Events
              </button>
            </div>
          </li>
        ) : (
          events.map((event) => (
            <li key={event.id} className="px-4 py-4 sm:px-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        event.severity === 'CRITICAL' ? 'bg-red-500' :
                        event.severity === 'HIGH' ? 'bg-orange-500' :
                        event.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {event.description || event.eventType}
                      </div>
                      <div className="text-xs text-gray-500">
                        Event Type: {event.eventType}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    event.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    event.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {event.severity}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">IP Address:</span> {event.ipAddress || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">User ID:</span> {event.userId || 'Unknown'}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {new Date(event.timestamp || event.createdAt).toLocaleString()}
                  </div>
                </div>
                
                {event.ipAddress && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Remediation Actions:</span>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {event.severity === 'CRITICAL' || event.severity === 'HIGH' ? (
                          <>
                            <li>Block IP address: {event.ipAddress}</li>
                            <li>Review user access logs</li>
                            <li>Enable additional monitoring</li>
                            {event.eventType === 'LOGIN_FAILURE' && <li>Check for brute force attempts</li>}
                          </>
                        ) : (
                          <li>Monitor for additional suspicious activity</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )

  const renderAlerts = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Security Alerts</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Active security alerts requiring attention</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {alerts.length === 0 ? (
          <li className="px-4 py-4 sm:px-6">
            <div className="text-center text-green-600">
              ✅ No active security alerts. All systems secure.
            </div>
          </li>
        ) : (
          alerts.map((alert) => (
            <li key={alert.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500' :
                      alert.severity === 'HIGH' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{alert.message}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )

  const renderBlockedIPs = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Blocked IP Addresses</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage blocked IPs and access control</p>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-4 sm:px-6">
          {/* Add new IP form */}
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter IP address to block (e.g., 192.168.1.100)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Reason for blocking"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Block IP
              </button>
            </div>
          </div>

          {/* Blocked IPs list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div>
                <div className="font-medium text-gray-900">203.0.113.45</div>
                <div className="text-sm text-gray-500">Multiple failed login attempts</div>
                <div className="text-xs text-gray-400">Blocked 2 hours ago</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Active</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">Unblock</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div>
                <div className="font-medium text-gray-900">198.51.100.123</div>
                <div className="text-sm text-gray-500">Unauthorized access attempts</div>
                <div className="text-xs text-gray-400">Blocked 1 day ago</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Active</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">Unblock</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div>
                <div className="font-medium text-gray-900">192.0.2.88</div>
                <div className="text-sm text-gray-500">Brute force attack detected</div>
                <div className="text-xs text-gray-400">Blocked 3 days ago</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Expired</span>
                <button className="text-sm text-gray-600 hover:text-gray-800">Remove</button>
              </div>
            </div>
          </div>

          {events.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No blocked IPs. Your system is secure.
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderRBAC = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Role-Based Access Control</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage user roles and permissions</p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="text-center text-gray-500">
          RBAC Management interface is being developed. Coming soon!
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure security policies and thresholds</p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="text-center text-gray-500">
          Security Settings interface is being developed. Coming soon!
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading security data...</p>
              </div>
            ) : (
              <>
                {renderMetrics()}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {renderEvents()}
                  {renderAlerts()}
                </div>
              </>
            )}
          </div>
        )
      case 'rbac':
        return renderRBAC()
      case 'events':
        return renderEvents()
      case 'settings':
        return renderSettings()
      default:
        return (
          <div className="space-y-8">
            {renderMetrics()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {renderEvents()}
              {renderAlerts()}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {renderContent()}
    </div>
  )
}