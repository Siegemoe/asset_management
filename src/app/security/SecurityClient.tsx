'use client'

import { useState } from 'react'
import { SecurityHeader } from '@/components/security/SecurityHeader'
import { SimpleSecurityDashboard } from '@/components/security/SimpleSecurityDashboard'

export default function SecurityClient() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Security Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor security events, manage roles, and configure security settings.
        </p>
      </div>

      <SecurityHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="space-y-8">
        <SimpleSecurityDashboard activeTab={activeTab} />
      </div>
    </div>
  )
}