"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardLayout from "@/DashboardLayout"
import Breadcrumb from "@/Breadcrumb"

interface Room {
  id: string
  name: string
  status: string
  tenantName: string | null
  tenantPhone: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  site: {
    id: string
    name: string
  }
  _count: {
    assets: number
  }
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms')
        if (response.ok) {
          const data = await response.json()
          setRooms(data)
        } else {
          console.error('Failed to fetch rooms')
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OCCUPIED: { color: 'bg-green-100 text-green-800', label: 'Occupied' },
      VACANT: { color: 'bg-red-100 text-red-800', label: 'Vacant' },
      READY: { color: 'bg-yellow-100 text-yellow-800', label: 'Ready' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.READY
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Rooms" }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your organization locations, rooms, and tenant assignments.
                </p>
              </div>
              <Link
                href="/rooms/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New Room
              </Link>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <li key={room.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            Room {room.name}
                          </h4>
                          <span className="text-gray-500">•</span>
                          <p className="text-sm text-gray-500 truncate">
                            {room.site.name}
                          </p>
                          {getStatusBadge(room.status)}
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{room._count.assets} assets</span>
                          {room.tenantName && (
                            <span>Tenant: {room.tenantName}</span>
                          )}
                          {room.tenantPhone && (
                            <span>{room.tenantPhone}</span>
                          )}
                        </div>
                        {room.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">{room.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/rooms/${room.id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/rooms/${room.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {rooms.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No rooms found. <Link href="/rooms/new" className="text-indigo-600 hover:text-indigo-900">Add one</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}