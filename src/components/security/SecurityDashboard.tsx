'use client'

import { useState, useEffect } from 'react'
import { SecurityMetrics } from './SecurityMetrics'
import { SecurityEventsTable } from './SecurityEventsTable'
import { SecurityAlerts } from './SecurityAlerts'
import { RBACManagement } from './RBACManagement'
import { SecuritySettings } from './SecuritySettings'

interface SecurityDashboardProps {
  activeTab?: string
}

export function SecurityDashboard({ activeTab = 'dashboard' }: SecurityDashboardProps) {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      failedLogins: 0,
      activeSessions: 0,
      securityEvents: 0,
      blockedIPs: 0
    },
    recentEvents: [],
    alerts: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load dashboard data from API
    const loadDashboardData = async () => {
      setLoading(true)
      
      try {
        // Fetch metrics
        const metricsResponse = await fetch('/api/security/dashboard?type=metrics')
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json()
          
          // Fetch events
          const eventsResponse = await fetch('/api/security/dashboard?type=events&limit=20')
          const eventsData = eventsResponse.ok ? await eventsResponse.json() : { events: [] }
          
          // Fetch alerts
          const alertsResponse = await fetch('/api/security/dashboard?type=alerts')
          const alertsData = alertsResponse.ok ? await alertsResponse.json() : { alerts: [] }
          
          setDashboardData({
            metrics: metricsData,
            recentEvents: eventsData.events || [],
            alerts: alertsData.alerts || []
          })
        } else {
          // Fallback to empty data if API fails
          setDashboardData({
            metrics: {
              failedLogins: 0,
              activeSessions: 0,
              securityEvents: 0,
              blockedIPs: 0
            },
            recentEvents: [],
            alerts: []
          })
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Fallback to empty data on error
        setDashboardData({
          metrics: {
            failedLogins: 0,
            activeSessions: 0,
            securityEvents: 0,
            blockedIPs: 0
          },
          recentEvents: [],
          alerts: []
        })
      }
      
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <SecurityMetrics metrics={dashboardData.metrics} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SecurityEventsTable events={dashboardData.recentEvents} loading={loading} />
              <SecurityAlerts alerts={dashboardData.alerts} loading={loading} />
            </div>
          </div>
        )
      
      case 'rbac':
        return <RBACManagement />
      
      case 'events':
        return <SecurityEventsTable events={dashboardData.recentEvents} loading={loading} showFilters={true} />
      
      case 'settings':
        return <SecuritySettings />
      
      default:
        return (
          <div className="space-y-8">
            <SecurityMetrics metrics={dashboardData.metrics} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SecurityEventsTable events={dashboardData.recentEvents} loading={loading} />
              <SecurityAlerts alerts={dashboardData.alerts} loading={loading} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {renderTabContent()}
    </div>
  )
}