'use client'

import { useState } from 'react'

interface SecurityAlert {
  id: string
  type: string
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: Date
  acknowledged: boolean
}

interface SecurityAlertsProps {
  alerts: SecurityAlert[]
  loading: boolean
}

export function SecurityAlerts({ alerts, loading }: SecurityAlertsProps) {
  const [acknowledgeAlert, setAcknowledgeAlert] = useState<string | null>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'HIGH':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
    }
  }

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgeAlert(alertId)
    // Here you would typically make an API call to acknowledge the alert
    setTimeout(() => {
      setAcknowledgeAlert(null)
    }, 1000)
  }

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged)
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged)

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Security Alerts
        </h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="mt-2 text-gray-500">No security alerts</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Unacknowledged alerts */}
            {unacknowledgedAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Unacknowledged Alerts</h4>
                <div className="space-y-3">
                  {unacknowledgedAlerts.map((alert) => (
                    <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {alert.type}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={acknowledgeAlert === alert.id}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {acknowledgeAlert === alert.id ? 'Acknowledging...' : 'Acknowledge'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acknowledged alerts */}
            {acknowledgedAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Acknowledged Alerts</h4>
                <div className="space-y-2">
                  {acknowledgedAlerts.map((alert) => (
                    <div key={alert.id} className="border border-gray-200 rounded-lg p-3 opacity-75">
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 truncate">
                            {alert.type}
                          </p>
                          <p className="text-xs text-gray-400">
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          Acknowledged
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}