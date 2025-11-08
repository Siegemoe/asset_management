"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"

interface Site {
  id: string
  name: string
  address: string | null
  status: string
  createdAt: string
  _count: {
    rooms: number
    assets: number
  }
  rooms?: Room[]
  assignedUsers: User[]
}

interface Room {
  id: string
  name: string
  status: string
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface UserAssignment {
  userId: string
  role: string
}

interface EnhancedSitesClientProps {
  initialSites: Site[]
}

export default function EnhancedSitesClient({ initialSites }: EnhancedSitesClientProps) {
  const [sites, setSites] = useState<Site[]>(initialSites)
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [userAssignmentSiteId, setUserAssignmentSiteId] = useState<string | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const users = await response.json()
        setAllUsers(users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    // Fetch all users for assignment
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [])

  const refreshSites = async () => {
    try {
      const response = await fetch('/api/sites')
      if (response.ok) {
        const updatedSites = await response.json()
        setSites(updatedSites)
      }
    } catch (error) {
      console.error('Error refreshing sites:', error)
    }
  }

  const handleStatusChange = async (siteId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this site?`)) {
      return
    }

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await refreshSites()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update site status')
      }
    } catch (error) {
      console.error('Error updating site status:', error)
      alert('An error occurred while updating the site status')
    }
  }

  const handleDelete = async (siteId: string) => {
    if (!confirm('Are you sure you want to permanently delete this site? This action cannot be undone and will remove all associated rooms and assets.')) {
      return
    }

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await refreshSites()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete site')
      }
    } catch (error) {
      console.error('Error deleting site:', error)
      alert('An error occurred while deleting the site')
    }
  }

  const handleAssignUsers = async (siteId: string, userAssignments: UserAssignment[]) => {
    try {
      const response = await fetch(`/api/sites/${siteId}/assign-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAssignments }),
      })

      if (response.ok) {
        await refreshSites()
        setUserAssignmentSiteId(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to assign users')
      }
    } catch (error) {
      console.error('Error assigning users:', error)
      alert('An error occurred while assigning users')
    }
  }


  return (
    <div className="space-y-6">
      {/* Sites List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Sites ({sites.length})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your locations, assign users, and control site status.
          </p>
        </div>
        
        <ul role="list" className="divide-y divide-gray-200">
          {sites.map((site) => (
            <li key={site.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {site.name}
                      </h4>
                      <StatusBadge status={site.status} type="site" />
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {site.address || 'No address provided'}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{site._count.rooms} rooms</span>
                      <span>{site._count.assets} assets</span>
                      <span>{site.assignedUsers.length} assigned users</span>
                    </div>
                    
                    {/* Room Badges */}
                    {site.rooms && site.rooms.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-2">Rooms:</p>
                        <div className="flex flex-wrap gap-2">
                          {site.rooms.map((room) => (
                            <Link
                              key={room.id}
                              href={`/sites/${site.id}/rooms/${room.id}`}
                              className="group"
                            >
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors">
                                {room.name}
                                <StatusBadge status={room.status} type="room" />
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {site.assignedUsers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">Assigned users:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {site.assignedUsers.slice(0, 3).map((user) => (
                            <span key={user.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {user.name || user.email} ({user.role})
                            </span>
                          ))}
                          {site.assignedUsers.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{site.assignedUsers.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedSite(selectedSite === site.id ? null : site.id)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      {selectedSite === site.id ? 'Hide' : 'Details'}
                    </button>
                    
                    <button
                      onClick={() => setUserAssignmentSiteId(userAssignmentSiteId === site.id ? null : site.id)}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Assign Users
                    </button>
                    
                    <Link
                      href={`/sites/${site.id}/edit`}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    
                    {site.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleStatusChange(site.id, 'SUSPENDED')}
                        className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                      >
                        Suspend
                      </button>
                    )}
                    
                    {site.status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleStatusChange(site.id, 'ACTIVE')}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        Activate
                      </button>
                    )}
                    
                    {site.status !== 'ARCHIVED' && (
                      <button
                        onClick={() => handleStatusChange(site.id, 'ARCHIVED')}
                        className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                      >
                        Archive
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Site Details */}
                {selectedSite === site.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Created:</span>
                        <p className="text-gray-600">{new Date(site.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <p className="text-gray-600">{new Date(site.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* User Assignment Interface */}
                {userAssignmentSiteId === site.id && (
                  <UserAssignmentInterface
                    site={site}
                    allUsers={allUsers}
                    onAssignUsers={handleAssignUsers}
                    onCancel={() => setUserAssignmentSiteId(null)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        
        {sites.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500">
            No sites found. <Link href="/sites/new" className="text-indigo-600 hover:text-indigo-900">Add one</Link>
          </div>
        )}
      </div>
    </div>
  )
}

// User Assignment Component
interface UserAssignmentInterfaceProps {
  site: Site
  allUsers: User[]
  onAssignUsers: (siteId: string, assignments: UserAssignment[]) => void
  onCancel: () => void
}

function UserAssignmentInterface({ site, allUsers, onAssignUsers, onCancel }: UserAssignmentInterfaceProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set(site.assignedUsers.map(u => u.id)))
  const [roles, setRoles] = useState<Record<string, string>>({})

  const handleUserToggle = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
      const newRoles = { ...roles }
      delete newRoles[userId]
      setRoles(newRoles)
    } else {
      newSelected.add(userId)
      setRoles(prev => ({ ...prev, [userId]: 'SITE_MANAGER' }))
    }
    setSelectedUsers(newSelected)
  }

  const handleRoleChange = (userId: string, role: string) => {
    setRoles(prev => ({ ...prev, [userId]: role }))
  }

  const handleSubmit = () => {
    const assignments = Array.from(selectedUsers).map(userId => ({
      userId,
      role: roles[userId] || 'SITE_MANAGER'
    }))
    onAssignUsers(site.id, assignments)
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h5 className="text-sm font-medium text-gray-900 mb-3">
        Assign Users to {site.name}
      </h5>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {allUsers.map((user) => (
          <div key={user.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={`user-${user.id}`}
              checked={selectedUsers.has(user.id)}
              onChange={() => handleUserToggle(user.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`user-${user.id}`} className="flex-1">
              <span className="text-sm text-gray-900">
                {user.name || user.email}
              </span>
              <span className="text-sm text-gray-500 ml-2">({user.role})</span>
            </label>
            {selectedUsers.has(user.id) && (
              <select
                value={roles[user.id] || 'SITE_MANAGER'}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="SITE_MANAGER">Site Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Assign {selectedUsers.size} User(s)
        </button>
      </div>
    </div>
  )
}