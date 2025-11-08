'use client'

import { useState } from 'react'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: Date
}

interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export function RBACManagement() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [showCreateRole, setShowCreateRole] = useState(false)

  // Mock data - in real implementation, this would come from APIs
  const roles: Role[] = [
    {
      id: '1',
      name: 'SUPER_ADMIN',
      description: 'Full system access',
      permissions: ['*'],
      userCount: 2,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'ADMIN',
      description: 'Administrative access with user management',
      permissions: [
        'site:create', 'site:read', 'site:update', 'site:list',
        'room:create', 'room:read', 'room:update', 'room:list',
        'asset:create', 'asset:read', 'asset:update', 'asset:delete', 'asset:list',
        'user:read', 'user:list', 'security:read'
      ],
      userCount: 5,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'SITE_MANAGER',
      description: 'Limited to assigned sites',
      permissions: [
        'site:read', 'site:list',
        'room:read', 'room:list',
        'asset:create', 'asset:read', 'asset:update', 'asset:list'
      ],
      userCount: 12,
      createdAt: new Date('2024-01-01')
    }
  ]

  const permissions: Permission[] = [
    // Asset permissions
    { id: 'asset:create', name: 'Create Asset', description: 'Create new assets', resource: 'asset', action: 'create' },
    { id: 'asset:read', name: 'Read Asset', description: 'View asset details', resource: 'asset', action: 'read' },
    { id: 'asset:update', name: 'Update Asset', description: 'Modify assets', resource: 'asset', action: 'update' },
    { id: 'asset:delete', name: 'Delete Asset', description: 'Remove assets', resource: 'asset', action: 'delete' },
    { id: 'asset:list', name: 'List Assets', description: 'View asset lists', resource: 'asset', action: 'list' },
    
    // Site permissions
    { id: 'site:create', name: 'Create Site', description: 'Create new sites', resource: 'site', action: 'create' },
    { id: 'site:read', name: 'Read Site', description: 'View site details', resource: 'site', action: 'read' },
    { id: 'site:update', name: 'Update Site', description: 'Modify sites', resource: 'site', action: 'update' },
    { id: 'site:delete', name: 'Delete Site', description: 'Remove sites', resource: 'site', action: 'delete' },
    { id: 'site:list', name: 'List Sites', description: 'View site lists', resource: 'site', action: 'list' },
    
    // Security permissions
    { id: 'security:read', name: 'Read Security', description: 'View security events', resource: 'security', action: 'read' },
    { id: 'security:manage', name: 'Manage Security', description: 'Manage security settings', resource: 'security', action: 'manage' },
  ]

  const handleCreateRole = () => {
    setShowCreateRole(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
  }

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Roles ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Permissions ({permissions.length})
          </button>
        </nav>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Role Management</h3>
            <button
              onClick={handleCreateRole}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Role
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {roles.map((role) => (
                <li key={role.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {role.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {role.userCount} users
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {role.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {role.permissions.length === 1 && role.permissions[0] === '*' 
                              ? 'All permissions' 
                              : `${role.permissions.length} permissions`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Permission Management</h3>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {permissions.map((permission) => (
                <li key={permission.id}>
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {permission.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {permission.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {permission.resource}:{permission.action}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Role</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="e.g., DEPARTMENT_HEAD"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Brief description of this role's responsibilities"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {permission.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateRole(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateRole(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Role: {editingRole.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role Name</label>
                  <input
                    type="text"
                    defaultValue={editingRole.name}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    defaultValue={editingRole.description}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={editingRole.permissions.includes(permission.id) || editingRole.permissions.includes('*')}
                          className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {permission.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                  Delete Role
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditingRole(null)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setEditingRole(null)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}