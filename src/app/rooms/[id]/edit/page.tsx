"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/DashboardLayout"
import Breadcrumb from "@/Breadcrumb"

interface Site {
  id: string
  name: string
}

interface Room {
  id: string
  name: string
  status: string
  tenantName: string | null
  tenantPhone: string | null
  notes: string | null
  site: {
    id: string
    name: string
  }
}

interface EditRoomPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditRoomPage({ params }: EditRoomPageProps) {
  const router = useRouter()
  const { id: roomId } = use(params)
  const [room, setRoom] = useState<Room | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    siteId: "",
    status: "READY",
    tenantName: "",
    tenantPhone: "",
    notes: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomResponse, sitesResponse] = await Promise.all([
          fetch(`/api/rooms/${roomId}`),
          fetch('/api/sites')
        ])

        if (roomResponse.ok && sitesResponse.ok) {
          const [roomData, sitesData] = await Promise.all([
            roomResponse.json(),
            sitesResponse.json()
          ])
          
          setRoom(roomData)
          setSites(sitesData)
          
          setFormData({
            name: roomData.name || "",
            siteId: roomData.site.id,
            status: roomData.status,
            tenantName: roomData.tenantName || "",
            tenantPhone: roomData.tenantPhone || "",
            notes: roomData.notes || ""
          })
        } else {
          console.error('Failed to fetch data')
          router.push('/rooms')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/rooms')
      } finally {
        setLoading(false)
      }
    }

    if (roomId) {
      fetchData()
    }
  }, [roomId, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Room name must be at least 2 characters"
    }

    if (!formData.siteId) {
      newErrors.siteId = "Site is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          siteId: formData.siteId,
          status: formData.status,
          tenantName: formData.tenantName.trim() || null,
          tenantPhone: formData.tenantPhone.trim() || null,
          notes: formData.notes.trim() || null
        }),
      })

      if (response.ok) {
        alert('Room updated successfully!')
        router.push('/rooms')
      } else {
        const error = await response.json()
        setErrors({ general: error.error || error.message || 'Failed to update room' })
      }
    } catch (error) {
      console.error('Error updating room:', error)
      setErrors({ general: 'An error occurred while updating the room' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/rooms/${roomId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          alert('Room deleted successfully!')
          router.push('/rooms')
        } else {
          const error = await response.json()
          setErrors({ general: error.error || 'Failed to delete room' })
        }
      } catch (error) {
        console.error('Error deleting room:', error)
        setErrors({ general: 'An error occurred while deleting the room' })
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Rooms", href: "/rooms" },
    { label: room?.name || "Edit Room" }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading room...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!room) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h1>
            <Link href="/rooms" className="text-indigo-600 hover:text-indigo-900">
              Back to Rooms
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Edit Room: {room.name}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Update room information and tenant assignments.
              </p>

              {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 101, 2A, Unit 5"
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Site *
                  </label>
                  <select
                    value={formData.siteId}
                    onChange={(e) => handleInputChange('siteId', e.target.value)}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black ${
                      errors.siteId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select site</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                  {errors.siteId && <p className="mt-1 text-sm font-medium text-gray-500">Current site: {room.site.name}</p>}
                  {errors.siteId && <p className="mt-1 text-sm text-red-600">{errors.siteId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  >
                    <option value="READY">Ready</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="VACANT">Vacant</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Ready (Yellow), Occupied (Green), Vacant (Red)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    value={formData.tenantName}
                    onChange={(e) => handleInputChange('tenantName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    placeholder="Enter tenant name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tenant Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.tenantPhone}
                    onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    placeholder="Enter tenant phone number (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    placeholder="Additional notes about the room (optional)"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Room
                  </button>
                  <div className="space-x-3">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}