"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface User {
  id: string
  name: string | null
  email: string
  image?: string | null
  role: string
  siteIds: string
}

interface UserProfileCardProps {
  user: User
  onEdit: (userId: string) => void
  canEdit: boolean
}

interface Site {
  id: string
  name: string
}

export default function UserProfileCard({ user, onEdit, canEdit }: UserProfileCardProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch associated sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        if (user.siteIds) {
          const siteIds = JSON.parse(user.siteIds)
          const sitePromises = siteIds.map((siteId: string) =>
            fetch(`/api/sites/${siteId}`).then(res => res.json())
          )
          const sitesData = await Promise.all(sitePromises)
          setSites(sitesData.filter(Boolean))
        }
      } catch (error) {
        console.error('Error fetching sites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [user.siteIds])

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      SUPER_ADMIN: { color: 'bg-purple-100 text-purple-800', label: 'Super Admin' },
      ADMIN: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      SITE_MANAGER: { color: 'bg-blue-100 text-blue-800', label: 'Site Manager' },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.SITE_MANAGER
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {user.image ? (
              <Image
                className="h-12 w-12 rounded-full"
                src={user.image}
                alt={user.name || "User"}
                width={48}
                height={48}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {user.name || "No Name"}
              </dt>
              <dd className="text-sm text-gray-900 truncate">
                {user.email}
              </dd>
              <dd className="mt-1">
                {getRoleBadge(user.role)}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <h4 className="text-gray-900 font-medium mb-2">Access & Permissions</h4>
          
          {/* Role Information */}
          <div className="mb-3">
            <span className="text-gray-500">Role:</span>
            <span className="ml-2 text-gray-900">{user.role.replace('_', ' ')}</span>
          </div>

          {/* Associated Sites */}
          {loading ? (
            <div className="mb-2">Loading sites...</div>
          ) : sites.length > 0 ? (
            <div className="mb-3">
              <span className="text-gray-500">Sites:</span>
              <div className="mt-1 space-y-1">
                {sites.map((site) => (
                  <Link
                    key={site.id}
                    href={`/sites/${site.id}`}
                    className="block text-indigo-600 hover:text-indigo-900 text-xs"
                  >
                    • {site.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <span className="text-gray-500">Sites:</span>
              <span className="ml-2 text-gray-400 text-xs">No sites assigned</span>
            </div>
          )}
        </div>
        
        {canEdit && (
          <div className="mt-3">
            <button
              onClick={() => onEdit(user.id)}
              className="w-full bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit User
            </button>
          </div>
        )}
      </div>
    </div>
  )
}